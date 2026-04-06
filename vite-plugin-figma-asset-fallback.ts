import type { Plugin } from 'vite';

// ═══════════════════════════════════════════════════════
// Vite Plugin: figma:asset Fallback
// ═══════════════════════════════════════════════════════
// In Figma Make / Figma Sites, the built-in resolver handles
// `figma:asset/xxx.png` imports natively. This plugin asks all
// OTHER plugins to resolve the import first (via this.resolve +
// skipSelf). Only if no other resolver claims it (i.e. building
// on Vercel/Netlify without Figma's infrastructure) does this
// plugin kick in and return an Unsplash fallback URL.
//
// Result:
//   Figma Make / Figma Sites → original Figma images ✓
//   Vercel / external hosts  → Unsplash fallbacks    ✓
// ═══════════════════════════════════════════════════════

const FIGMA_ASSET_PREFIX = 'figma:asset/';

// Pool of Unsplash portrait photos used as fallbacks
const PORTRAIT_POOL = [
  'https://images.unsplash.com/photo-1759840278381-bf7d5e332050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1769275061088-85697a30ee50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1757870125674-eb1dac151c28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1713078582993-fdd86b1a2c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1769275061721-bb6439d24ebc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1764740128390-4196892b3f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1610173826014-d131b02d69ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1678378819861-158c3ff303d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1546954552-eb2ada4a3654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
];

// Specific fallback for the verification image in RegistrationFlow
const VERIFICATION_FALLBACK =
  'https://images.unsplash.com/photo-1703080666768-3ea98de3a114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';

// Known verification asset hash
const VERIFICATION_HASH = '6bbde89936d233c2211e11df68bf016b303b28a5';

/**
 * Simple hash function to deterministically map a figma asset hash
 * to a consistent index in the portrait pool.
 */
function hashToIndex(hash: string, poolSize: number): number {
  let num = 0;
  for (let i = 0; i < hash.length; i++) {
    num = (num * 31 + hash.charCodeAt(i)) >>> 0;
  }
  return num % poolSize;
}

export default function figmaAssetFallback(): Plugin {
  return {
    name: 'figma-asset-fallback',
    // Must run before Vite's core vite:asset plugin, which otherwise
    // tries to read figma:asset/* as a file path and fails.
    enforce: 'pre',

    async resolveId(source, importer, options) {
      if (!source.startsWith(FIGMA_ASSET_PREFIX)) return null;

      // Ask every OTHER plugin to try resolving this import first.
      // In Figma Make, their built-in resolver will succeed here.
      // On Vercel (no Figma resolver), this returns null.
      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      });

      if (resolved && !resolved.external) {
        // Another plugin (Figma Make's resolver) handled it — use that
        return resolved;
      }

      // No other plugin handled it — we're on an external host.
      // Claim the import so our load() hook can provide a fallback.
      return source;
    },

    load(id) {
      if (!id.startsWith(FIGMA_ASSET_PREFIX)) return null;

      // Extract the hash from e.g. "figma:asset/6bbde89936d233c2211e11df68bf016b303b28a5.png"
      const filename = id.slice(FIGMA_ASSET_PREFIX.length);
      const hash = filename.replace(/\.[^.]+$/, ''); // strip extension

      let url: string;

      if (hash === VERIFICATION_HASH) {
        url = VERIFICATION_FALLBACK;
      } else {
        const idx = hashToIndex(hash, PORTRAIT_POOL.length);
        url = PORTRAIT_POOL[idx];
      }

      // Return a module that default-exports the URL string
      // (same shape as what Vite's asset pipeline produces)
      return `export default ${JSON.stringify(url)};`;
    },
  };
}
