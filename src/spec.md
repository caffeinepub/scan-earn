# Specification

## Summary
**Goal:** Remove all authentication and canister/connection UX so the app opens directly into the main content with no login, verification, or connection setup steps.

**Planned changes:**
- Remove all user-facing authentication/verification UI and flows (CTR ID, access code, email/password, face authentication, and any Internet Identity sign-in prompts).
- Remove auth/connection-based feature gating and conditional navigation so the primary sections (Stocks & Funds, Withdrawal, Customer Support) are accessible immediately on app load.
- Remove CTR/access-code validation utilities and any UI logic/error messaging that depends on CTR ID or access-code allowlists.
- Remove canister/connection configuration UI elements (connection/config initialization banners, reachability/offline notices, and connection settings panels) from the end-user experience.
- Update backend authorization so all app-used methods work for anonymous callers; keep any previously exposed access-control initialization method as a no-op if still referenced.

**User-visible outcome:** Users can open the app in a fresh session and immediately use Stocks & Funds, Withdrawal, and Customer Support without any login, verification, CTR/access code steps, or canister/connection configuration prompts.
