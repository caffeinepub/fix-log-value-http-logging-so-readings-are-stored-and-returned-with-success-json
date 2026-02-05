# Specification

## Summary
**Goal:** Fix frontend runtime configuration parsing so the backend canister ID is correctly resolved from production `/env.json`, and redeploy the frontend so production initializes successfully.

**Planned changes:**
- Update the runtime config loader to recognize `backend_canister_id` from `/env.json` (in addition to existing supported keys) and use it to resolve the backend canister ID at runtime.
- Update `frontend/public/env.json` to include a non-empty backend canister ID key compatible with the loader (e.g., `backend_canister_id` and/or `CANISTER_ID_BACKEND`) to avoid relying on build-time env vars.
- Perform a clean frontend-only rebuild and redeploy to production so the updated loader is included in the deployed bundle.

**User-visible outcome:** The production app loads without the “Configuration Loading Failed” state, and the UI shows working endpoint URLs that include the resolved backend canister ID.
