# Specification

## Summary
**Goal:** Consolidate the main home page (StocksHomePage) hamburger menu into a single, simplified navigation menu and ensure consistent “Funds Transaction History” labeling.

**Planned changes:**
- Update the StocksHomePage header hamburger menu to show one consolidated menu containing exactly: Dashboard, Withdrawal, Withdrawal History, Admin Panel, and Funds Transaction History (and remove any other existing menu items).
- Wire each menu item to the existing flowStore `activeSection` navigation: Dashboard → home section, Withdrawal → withdrawal, Withdrawal History → withdrawalHistory, Admin Panel → adminPanel, Funds Transaction History → fundsHistory; close the menu after selection.
- Update user-facing headings/labels so the funds history destination consistently displays “Funds Transaction History” in the menu and as the funds history section header title.

**User-visible outcome:** On the main home page, opening the hamburger menu shows only the five requested items, and selecting any item switches to the corresponding existing section (with the menu closing), with “Funds Transaction History” displayed consistently as the label/title.
