# Specification

## Summary
**Goal:** Build a single-page, mobile-first “Scan & Earn” fintech rewards landing + demo experience with a dark-mode glassmorphism UI, a guided add-funds flow, and persistent per-phone wallet state backed by Motoko.

**Planned changes:**
- Create a single-page layout with smooth scrolling and consistent dark glassmorphism styling using Electric Blue accents and Gold coin highlights.
- Implement Hero section with exact headline “Turn Payments into Profits”, “Scan Now” CTA, and a live Coin Counter that count-up animates on coin increases.
- Add a “Connect phone number” step (Indian phone number input with basic validation) as the first step gating the rest of the flow.
- Build an interactive Reward Calculator grid with exact INR→coin tiers (₹10=15, ₹30=55, ₹50=95, ₹180=390, ₹500=1045, ₹1k=2200) and single-selection behavior.
- Create “My Wallet” section with Add Bank Account form (Account Holder Name, Bank Name, Account Number, IFSC) persisted per connected phone number, plus an “Add Funds” button.
- Implement an Add Funds modal simulating GPay/BHIM with a scannable QR area, payment number exactly “9541525891”, and Transaction ID submit/verify that credits coins for the selected tier.
- Add a “Scan Rewards” demo section with a simulated scan interaction and success animation; record scan completion (and optionally award coins) tied to the connected phone number.
- Implement the full guided flow on one page: connect phone → select tier → open modal → submit Transaction ID → update coin balance across all UI locations in real time via React Query invalidation/refetch.
- Add Motoko single-actor storage and APIs for per-phone user profile, coin balance, bank details, optional selected tier, scan records, and Transaction ID tracking to prevent double-crediting.

**User-visible outcome:** Users can connect a phone number, choose a payment tier, open a GPay/BHIM-style QR modal to submit a Transaction ID, see coins credited with an animated counter, manage saved bank details in “My Wallet”, and run a simulated scan-to-earn demo—all on a single, mobile-first page.
