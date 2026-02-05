# Specification

## Summary
**Goal:** Make production reliably resolve the backend canister ID and remove dependency on `/env.json` availability, then redeploy with correct configuration and clearer diagnostics.

**Planned changes:**
- Update frontend runtime configuration loading to use a robust fallback chain: prefer build-time canister ID values, then optional `window.CANISTER_ID_BACKEND`, and only use `/env.json` when available (so `/env.json` 503 does not cause missing canister ID).
- Verify and fix production build/redeploy so the frontend receives the correct deployed backend canister ID mapping at runtime (and ensure `/env.json` returns 200 with expected content if it remains used).
- Improve `HttpLoggingInstructionsCard` error copy when the backend canister ID cannot be resolved to be actionable and configuration-focused (hard refresh recommendation; note to redeploy if it persists), without stack traces.

**User-visible outcome:** In production, the app loads without “CANISTER_ID_BACKEND is not set” / “Backend canister ID not found” under normal conditions, shows a valid Backend Canister ID and API URLs when deployed, and provides a clearer configuration-loading message only when the ID cannot be resolved.
