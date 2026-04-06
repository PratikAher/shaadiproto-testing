import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/theme.css";
import "./styles/fonts.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ═══════════════════════════════════════════════════════
// PWA Service Worker Registration
// ═══════════════════════════════════════════════════════
// Register only in production. In dev, the service worker can cache Vite module
// URLs and cause stale UI (old bundles / icons) until a hard refresh.
// The sw.js file lives in /public and is served at the root.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Check for updates on each page load
        registration.update();

        // Log registration scope for debugging
        console.log("[PWA] Service worker registered, scope:", registration.scope);
      })
      .catch((error) => {
        console.warn("[PWA] Service worker registration failed:", error);
      });
  });
}
