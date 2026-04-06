# Figma HTML → Design (Official MCP) — LLM Handoff Guide

Give this document to any LLM that should **capture a running web app** (usually localhost) and **import it into Figma as editable layers**—not merely a screenshot.

---

## Is the top toolbar (“Send to Figma”, “Entire screen”, “Select element”) Cursor-only?

**No. It is not a Cursor feature.**

That bar is injected by **Figma’s own script** when your page loads:

`https://mcp.figma.com/mcp/html-to-design/capture.js`

…and the URL includes the **capture hash** (see below). It appears in **any browser** that loads that combination (Chrome, Safari, Edge, an embedded IDE browser, Playwright-controlled Chromium, etc.).

**Another LLM can use the same workflow**, as long as:

1. The human’s environment (or automation) has the **official Figma MCP** connected to an MCP client that exposes the tool **`generate_figma_design`**, and  
2. The page under test loads **`capture.js`** and is opened with the **correct `#figmacapture=...&figmaendpoint=...` hash**.

Cursor is only **one** MCP client; the toolbar and capture pipeline belong to **Figma**, not to Cursor.

---

## Which MCP (exactly)—not all “Figma MCPs” are the same

You must use **Figma’s official remote MCP server**.

| Item | Value |
|------|--------|
| **Product** | Official Figma MCP (remote) |
| **Endpoint** | `https://mcp.figma.com/mcp` |
| **Primary tool for web → Figma** | `generate_figma_design` |

**Wrong or ambiguous options** (do not assume equivalence):

- Third-party / marketplace servers sometimes branded “Figma MCP” or “Figma Console MCP”—**different tools, different behavior**.
- Old local `stdio` binaries labeled “figma-mcp” may only support **reading** files or comments and **may not** expose `generate_figma_design`.

**Verification:** The MCP tool list must include a tool named exactly **`generate_figma_design`** whose description references capturing/importing a **webpage** or **HTML** into Figma. If it is missing, fix the server URL or upgrade the integration—do not substitute a random “Figma” MCP.

**Other official tools (do not confuse):**

| Tool | Use |
|------|-----|
| `generate_figma_design` | **Web/HTML → Figma** (this document) |
| `use_figma` | Programmatic **plugin API** operations in an existing file (not the primary HTML capture entry) |
| `get_design_context` | **Figma → code** (read design) |
| `get_screenshot` | **Figma node → raster image** |
| `whoami` | Confirm Figma user for the integration |

---

## Example: Cursor MCP configuration

On macOS/Linux, Cursor often stores servers in **`~/.cursor/mcp.json`**.

**Working example:**

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

- The key `"figma"` is arbitrary; **`url`** and **`type": "http"`** are what matter for this official server.
- Other clients (Claude Desktop, Windsurf, custom agents) use **their own** config file format but the **same** Figma endpoint.
- After changing config, restart the client or reload MCP so tools appear.

---

## Architecture (two parts)

### Part A — MCP: allocate capture session

Call **`generate_figma_design`** **without** `captureId` first, with:

```json
{
  "outputMode": "existingFile",
  "fileKey": "<from figma.com/design/<fileKey>/...>",
  "nodeId": "0:1"
}
```

- `nodeId` is **optional**; use Figma format **`123:456`** (colon). In URLs, Figma uses `node-id=123-456`—convert **hyphen → colon**.
- Alternative: `"outputMode": "newFile"` with `fileName` / `planKey` per tool schema.

The response includes:

- A **single-use** `captureId` (UUID).
- A **submit** URL of the form:  
  `https://mcp.figma.com/mcp/capture/<captureId>/submit`
- Instructions to open a **localhost URL** with specific **hash** parameters.

### Part B — Browser: load `capture.js` and submit DOM

1. **Include** in the app’s HTML (e.g. Vite `index.html` before `</body>`):

```html
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
```

2. **Open** (human or automation):

```text
http://localhost:<PORT>/#figmacapture=<CAPTURE_UUID>&figmaendpoint=<URL_ENCODED_SUBMIT_URL>&figmadelay=<MILLISECONDS>
```

| Hash param | Meaning |
|------------|--------|
| `figmacapture` | Same UUID as `captureId` |
| `figmaendpoint` | Full `https://mcp.figma.com/mcp/capture/.../submit` string, **URL-encoded** |
| `figmadelay` | Wait before auto-capture (lets SPA render) |
| `figmaselector` | Optional CSS selector; `*` can enable **manual** selection in the toolbar |

The **toolbar** is created by `capture.js` so the user can click **Entire screen** or **Select element** instead of relying only on auto-capture—still **Figma UI**, not IDE-specific.

### Part C — MCP: poll until done

Every **~5 seconds**, call **`generate_figma_design`** with:

```json
{ "captureId": "<same-uuid>" }
```

Continue until status is **`completed`** and a **Figma deep link** (with `node-id`) is returned.

**Rules:**

- **One** `captureId` = **one** capture. Do not reuse.
- Do not mint a **new** capture ID while polling the same in-flight capture unless you have abandoned the old session.
- For **another screen/state**, call `generate_figma_design` again (no `captureId`) to get a **new** UUID.

---

## Local vs external sites (hard rules from Figma’s flow)

| Target | Method |
|--------|--------|
| **Localhost** (`localhost`, `127.0.0.1`, `*.local`) | **`capture.js` in HTML** + hash URL. **Do not** rely on Playwright for local if you can edit the repo. |
| **External HTTPS** | Hash-only on sites you don’t control often **fails silently** (CSP, no script). Official pattern: **Playwright MCP**—strip CSP headers, inject `capture.js` text, call `window.figma.captureForDesign({ captureId, endpoint, selector: 'body' })`. |

---

## SPA / modal / “filters sheet open” gotcha

A **full navigation** to a new `...#figmacapture=...` URL **reloads** the app and **resets React/Vue state**.

So:

- **Modals/sheets close** unless reopened before `figmadelay` fires, **or**
- You add a **query parameter** (e.g. `?openFilters=1`) read on mount to open UI, **or**
- After the first successful capture, use the **in-page Figma toolbar** to **re-capture** while navigating inside the app (toolbar can manage new capture IDs for follow-up shots).

---

## Dev server vs preview (reliability)

Some **embedded browsers** break **Vite HMR WebSocket**. Symptom: blank or half-broken UI while `capture.js` still loads.

**Mitigation:** run a **production preview** after build, e.g. `vite preview` on a fixed port, and capture against that URL. Ensure **`dist/index.html`** includes `capture.js` **after** `npm run build`.

---

## Anti-patterns (“won’t lead to results”)

1. Using a **community MCP** that does **not** expose **`generate_figma_design`**.
2. Forgetting **`capture.js`** in HTML—or building for preview **without** rebuilding `dist`.
3. Expecting **`get_screenshot`** on a Figma node to replace **HTML capture** (opposite direction).
4. **Reusing** the same `captureId` for multiple pages.
5. Declaring failure after **one** `pending` poll (**large DOMs** can take time).
6. Opening hash URLs on **external** sites without **injection** / CSP handling.

---

## Quick checklist for the implementing LLM

1. [ ] Confirm **`generate_figma_design`** exists in the MCP tool list.  
2. [ ] Add **`capture.js`** to **`index.html`** (and rebuild if using `dist`).  
3. [ ] Start server on known **`http://localhost:<port>`**.  
4. [ ] Call **`generate_figma_design`** with `existingFile` + `fileKey`.  
5. [ ] Open **hash URL** with `figmacapture`, encoded `figmaendpoint`, `figmadelay`.  
6. [ ] **Poll** with `captureId` until **`completed`**.  
7. [ ] Return the **final Figma URL** to the user.

---

## One-line summary

**Official Figma MCP at `https://mcp.figma.com/mcp`, tool `generate_figma_design`, script `html-to-design/capture.js` in HTML, localhost URL with `#figmacapture&figmaendpoint&figmadelay`, poll until completed—the toolbar is Figma’s in-browser UI, not Cursor-only; any LLM + MCP client + browser can follow the same steps.**

---

*Document version: 1.1 — aligns with Cursor `mcp.json` using HTTP transport to `https://mcp.figma.com/mcp`.*
