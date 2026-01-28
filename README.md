# Subvisual ERC20 dApp

A simple ERC20 decentralized application built as part of the Subvisual Apprenticeship Coding Challenge.

This project demonstrates smart contract development with Solidity, automated testing with Foundry, and a modern frontend dApp using Next.js, Wagmi and Viem.

---

## Features

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
- Supports both local development and testnet deployment

---

## Tech Stack

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

## Architecture Notes

- The frontend is fully client-side rendered, which is required for wallet-based Web3 applications.
- Network selection is determined by the connected wallet (`chainId`).
- The frontend dynamically selects the correct contract address per network.
- The same UI works seamlessly for local development (Anvil) and testnet (Sepolia).

---

## Smart Contract

The ERC20 contract includes:
- Standard ERC20 functions
- Owner-restricted minting
- User-initiated burning
- Custom errors
- Automated tests

---

## Automated Tests

Implemented using Foundry:
- Mint increases balance and total supply
- Mint fails for non-owner
- Transfers update balances
- Burn reduces total supply

Run tests:

```bash
cd contracts
forge test
```
---

## Prerequisites

Install Foundry:

```shell
foundryup
```
Ensure Node.js (>=18) and pnpm are installed.

---

## Local Development(Anvil)

This project runs using three terminals.

Terminal 1 – Start local blockchain:
```shell
cd contracts
anvil
```
Terminal 2 – Deploy contract:
```shell
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key <ANVIL_PRIVATE_KEY>
```
Terminal 3 – Run frontend:
```shell
cd frontend
pnpm install #first time only
pnpm dev
```
---

## Testnet Deployment (Sepolia)

The contract is deployed on Sepolia and can be interacted with using a real wallet.
Anyone can interact with the token using their own wallet, but minting is restricted to the owner.

Environment setup

Create frontend/.env.local:

NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

Run frontend:
```shell
cd frontend
pnpm dev
```

- Switch MetaMask to Sepolia
- The frontend automatically connects to the Sepolia contract
- No redeployment is required unless the contract changes

---

## Notes

- Mint is only visible to the contract owner
- UI updates automatically after transactions
- Multiple accounts can be tested using different browser profiles
- .env.local is intentionally not committed

---

## Challenge Requirements

- Wallet connection: implemented
- Smart contract interaction: implemented
- Automated tests: implemented
- Optional testnet deployment: implemented

