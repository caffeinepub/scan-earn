# Specification

## Summary
**Goal:** Update CTR connect and scan flows to enforce a 7-digit CTR plus a required access code, persist CTR registration per user in the backend, and redirect Scan to WhatsApp with a prefilled NFC request message.

**Planned changes:**
- Update the CTR connect UI copy and inputs to require a 7-digit numeric CTR and an access code that must equal “IQL0918” (case-insensitive accepted; store/display uppercased), with English validation errors and Connect disabled until valid.
- Replace the existing CTR validation helper(s) to validate only “exactly 7 digits” and remove the prior 13-character + “IN” format rules.
- Implement backend methods to register/connect a CTR for the calling principal and to query whether the caller is already connected; enforce one CTR per principal and prevent the same CTR from being registered to multiple principals, with upgrade-safe persistence.
- Wire existing React Query hooks to the new backend CTR methods so connect works, errors are removed, and connected state is restored after reload.
- Replace simulated scan behavior with a Scan action that (when connected) redirects to WhatsApp (+91 9541525891) using a wa.me (or equivalent) link with a URL-encoded prefilled message containing exactly: “Get NFC code of 4 digits”, “Code works only: CTTH”, and “Only per CTR Registered user”.
- Gate Scan/redirect to connected users only; if not connected, block redirect and show an English prompt instructing the user to connect their CTR first.

**User-visible outcome:** Users can only connect after entering a valid 7-digit CTR and the correct access code, their CTR registration is persisted and recognized after refresh, and connected users can click Scan to open WhatsApp with the required prefilled NFC request message (while unconnected users are prompted to connect first).
