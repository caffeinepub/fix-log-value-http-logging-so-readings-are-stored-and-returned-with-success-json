# Specification

## Summary
**Goal:** Expose a simple canister health/status check over the Internet Computer raw.icp0.io HTTP gateway and surface the new URL in the frontend instructions UI.

**Planned changes:**
- Add a public query `http_request` handler in the backend canister that routes requests by URL path and returns JSON with CORS + `Content-Type: application/json; charset=utf-8`.
- Implement `GET /status` to return a JSON health payload (e.g., `ok`, current time, and logging/state counters such as `nextId` and `readingsCount`), including correct empty-state values.
- Return JSON error responses for unsupported paths/methods (e.g., 404 for unknown path and 405 for non-GET to `/status`).
- Update the frontend HTTP instructions UI to include a `/status` endpoint row built from the resolved backend canister ID, with copy-to-clipboard and open-in-new-tab controls consistent with existing rows.

**User-visible outcome:** Users can open or copy `https://<CANISTER_ID>.raw.icp0.io/status` from the UI and receive a JSON response indicating canister health and basic logging/status counters; unknown routes/methods return JSON errors.
