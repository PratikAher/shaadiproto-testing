#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const FILE_KEY = process.env.FIGMA_FILE_KEY || 'tDOFWHJyLpj2rXrO8E6nQL';
const CARD_NODE_ID = process.env.FIGMA_CARD_NODE_ID || '7:2';
const AVATAR_NODE_ID = process.env.FIGMA_AVATAR_NODE_ID || '7:3';
const PROFILE_LIMIT = Number(process.env.PROFILE_LIMIT || '40');
const IMAGE_SCALE = Number(process.env.FIGMA_IMAGE_SCALE || '1');
const EXPORT_CHUNK_SIZE = Number(process.env.FIGMA_EXPORT_CHUNK_SIZE || '10');
const OUTPUT_ROOT = path.resolve(process.cwd(), 'src/assets/profiles');
const TOKEN = process.env.FIGMA_TOKEN;

if (!TOKEN) {
  console.error('Missing FIGMA_TOKEN. Export it and run again.');
  console.error('Example: FIGMA_TOKEN=xxxxx npm run sync:figma:profiles');
  process.exit(1);
}

const apiHeaders = {
  'X-Figma-Token': TOKEN,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: apiHeaders });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status} ${res.statusText} at ${url}\n${text}`);
  }
  return res.json();
}

function normalizeProfileKey(rawName) {
  const match = String(rawName).match(/female[_\s-]*0*(\d+)/i);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isInteger(n) || n < 1 || n > PROFILE_LIMIT) return null;
  return `female_${String(n).padStart(3, '0')}`;
}

function extractImageRef(node) {
  if (!node || typeof node !== 'object') return null;
  const fills = Array.isArray(node.fills) ? node.fills : [];
  for (const fill of fills) {
    if (fill?.type === 'IMAGE' && fill?.imageRef) return fill.imageRef;
  }
  const background = Array.isArray(node.background) ? node.background : [];
  for (const fill of background) {
    if (fill?.type === 'IMAGE' && fill?.imageRef) return fill.imageRef;
  }
  const children = Array.isArray(node.children) ? node.children : [];
  for (const child of children) {
    const nested = extractImageRef(child);
    if (nested) return nested;
  }
  return null;
}

function extractProfilesFromFrame(frameNode) {
  const entries = new Map();
  const children = Array.isArray(frameNode?.children) ? frameNode.children : [];

  for (const child of children) {
    const key = normalizeProfileKey(child?.name);
    if (!key) continue;
    entries.set(key, {
      key,
      nodeId: child.id,
      imageRef: extractImageRef(child),
    });
  }
  return entries;
}

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function fetchImageUrls(nodeIds) {
  const all = {};
  for (const group of chunks(nodeIds, EXPORT_CHUNK_SIZE)) {
    const ids = group.map(encodeURIComponent).join(',');
    const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=png&scale=${IMAGE_SCALE}`;
    const json = await fetchJson(url);
    Object.assign(all, json.images || {});
    await sleep(100);
  }
  return all;
}

async function downloadToFile(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed image download ${res.status} ${res.statusText}: ${url}`);
  }
  const ab = await res.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(ab));
}

async function main() {
  const idsParam = `${encodeURIComponent(CARD_NODE_ID)},${encodeURIComponent(AVATAR_NODE_ID)}`;
  const nodesUrl = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${idsParam}&depth=5`;
  const nodesJson = await fetchJson(nodesUrl);

  const cardRoot = nodesJson?.nodes?.[CARD_NODE_ID]?.document;
  const avatarRoot = nodesJson?.nodes?.[AVATAR_NODE_ID]?.document;
  if (!cardRoot || !avatarRoot) {
    throw new Error('Could not read card/avatar nodes. Check FIGMA_* env values.');
  }

  const cards = extractProfilesFromFrame(cardRoot);
  const avatars = extractProfilesFromFrame(avatarRoot);

  const keys = [...cards.keys()].filter((k) => avatars.has(k)).sort();
  if (keys.length === 0) throw new Error('No matching profile keys found in both nodes.');

  const cardNodeIds = keys.map((k) => cards.get(k).nodeId);
  const avatarNodeIds = keys.map((k) => avatars.get(k).nodeId);
  const imageUrls = await fetchImageUrls([...cardNodeIds, ...avatarNodeIds]);

  let written = 0;
  for (const key of keys) {
    const card = cards.get(key);
    const avatar = avatars.get(key);
    const cardUrl = imageUrls[card.nodeId];
    const avatarUrl = imageUrls[avatar.nodeId];
    if (!cardUrl || !avatarUrl) continue;

    const dir = path.join(OUTPUT_ROOT, key);
    await fs.mkdir(dir, { recursive: true });
    await downloadToFile(cardUrl, path.join(dir, 'card.png'));
    await downloadToFile(avatarUrl, path.join(dir, 'avatar.png'));
    written += 1;
  }

  console.log(`Synced ${written} profiles to ${OUTPUT_ROOT}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
