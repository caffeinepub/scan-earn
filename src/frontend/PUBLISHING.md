# Publishing Scan & Earn to the Internet Computer

This guide explains how to build and deploy the Scan & Earn application to the Internet Computer (IC).

## Prerequisites

Before deploying, ensure you have the following installed:

1. **DFX (Internet Computer SDK)** - Version 0.15.0 or later
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. **Node.js** - Version 18 or later
   ```bash
   node --version
   ```

3. **Cycles** - You'll need cycles to deploy to the mainnet. You can get cycles from:
   - [Cycles Faucet](https://faucet.dfinity.org/) (for testing)
   - [NNS Dapp](https://nns.ic0.app/) (convert ICP to cycles)

## Local Deployment (Testing)

### 1. Start the local Internet Computer replica

