# Specification

## Summary
**Goal:** Restore backend HTTP JSON endpoints (with CORS) for logging and retrieving readings, and fix the frontend instructions to use the backend canister URL (while keeping a production HTML reference URL visible).

**Planned changes:**
- Implement/restore `http_request` in `backend/main.mo` to serve JSON for GET `/log?value=...` (append reading) and GET `/data` (return all readings), ensuring responses include `Content-Type: application/json` and do not return the frontend HTML.
- Add GET `/readings` as an alias route that returns the same JSON payload shape/fields and `Content-Type` as `/data`.
- Add CORS support for `/log`, `/data`, and `/readings`, including successful responses to `OPTIONS` preflight requests, while still working for non-browser clients (e.g., curl without an `Origin` header).
- Update `frontend/src/components/HttpLoggingInstructionsCard.tsx` so the copyable “Log a Reading” and “Retrieve All Readings” URLs point to the backend canister HTTP base URL that serves JSON, and also display the exact reference URL `https://simple-data-logging-web-app-with-motoko-http-endpo-d3a.caffeine.xyz/log?value=2.1` labeled as a known non-JSON (HTML) endpoint.
- Verify end-to-end behavior: backend JSON endpoints return JSON in production, and new readings logged via `/log` appear in the frontend readings table after the next polling refresh.

**User-visible outcome:** Users can log readings and fetch all readings via backend JSON HTTP endpoints from browsers (including caffeine.xyz origins) or curl, and the frontend shows correct, copyable backend URLs while retaining a clearly-labeled production HTML reference URL.
