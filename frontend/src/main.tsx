import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

console.log('[BOOT] App module loaded')
const navType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
console.log('[BOOT] performance navigation type =', navType ? navType.type : 'unknown')

const instanceId = crypto.randomUUID();
console.log("[APP] instance:", instanceId);

document.addEventListener("visibilitychange", () => {
  console.log("[VISIBILITY]", document.visibilityState)
});

window.addEventListener("focus", () => {
  console.log("[FOCUS] window focus")
});

window.addEventListener("blur", () => {
  console.log("[FOCUS] window blur")
});

window.addEventListener("pageshow", (e) => {
  console.log("[PAGESHOW] persisted =", e.persisted)
});

window.addEventListener("pagehide", () => {
  console.log("[PAGEHIDE]")
});

window.addEventListener("beforeunload", () => {
  console.log("[BEFOREUNLOAD]")
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
