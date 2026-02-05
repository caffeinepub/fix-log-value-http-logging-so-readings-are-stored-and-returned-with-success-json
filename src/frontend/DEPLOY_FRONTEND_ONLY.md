# Frontend-Only Clean Rebuild & Redeploy Checklist

This document provides a step-by-step guide for performing a clean frontend-only rebuild and deployment to production, ensuring the latest JavaScript bundle (including runtime configuration loader updates) is deployed and served.

## Prerequisites
- Backend canister is already deployed and stable
- Production `/env.json` is accessible and contains valid `backend_canister_id`

## Steps

### 1. Clean Build
