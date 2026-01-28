# Subvisual ERC20 dApp

A simple ERC20 decentralized application built as part of the Subvisual Apprenticeship Coding Challenge.

This project demonstrates smart contract development with Solidity, automated testing with Foundry, and a modern frontend dApp using Next.js, Wagmi and Viem.

---

Features

- Wallet connection (MetaMask / injected wallets)
- ERC20 token interactions:
  - Transfer
  - Approve
  - TransferFrom
  - Mint (owner only)
  - Burn
- Automatic UI updates after transactions
- Input validation with user feedback
- Automated smart contract tests

---

Tech Stack

Smart Contracts:
- Solidity
- OpenZeppelin
- Foundry (Forge, Anvil)

Frontend:
- Next.js
- TypeScript
- Wagmi
- Viem
- TanStack Query
- pnpm

---

Architecture Notes

Next.js was chosen over Vite to reflect a production-ready Web3 setup.
All blockchain interactions run client-side (CSR), which is required for wallet-based applications.
No server-side rendering is used for blockchain logic.

---

Smart Contract

The ERC20 contract includes:
- Standard ERC20 functions
- Owner-restricted minting
- User-initiated burning
- Custom errors
- Automated tests

---

Automated Tests

Implemented using Foundry:
- Mint increases balance and total supply
- Mint fails for non-owner
- Transfers update balances
- Burn reduces total supply

---

Prerequisites

Install Foundry:

curl -L https://foundry.paradigm.xyz | bash
foundryup

Ensure Node.js (>=18) and pnpm are installed.

---

Local Development

This project runs using three terminals.

Terminal 1 – Start local blockchain:

cd contracts
anvil

Terminal 2 – Deploy contract:

cd contracts
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Terminal 3 – Run frontend:

cd frontend
pnpm install
pnpm dev

---

Environment Variables

Create frontend/.env.local:

NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress

---

Notes

- Mint is only visible to the contract owner
- UI updates automatically after transactions
- Multiple accounts can be tested using different browser profiles

---

Challenge Requirements

- Wallet connection: implemented
- Smart contract interaction: implemented
- Automated tests: implemented
- Optional testnet deployment: supported

