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

This project supports local development using Anvil, Foundry’s local Ethereum node.

The frontend does not control the network — it always follows the network selected in the user’s wallet (MetaMask).
When MetaMask is connected to Anvil (Localhost / chainId 31337), the frontend automatically uses the locally deployed contract.

### Steps

This setup uses three terminals.

Terminal 1 – Start local blockchain:
```shell
cd contracts
anvil --chain-id 31337
```

Anvil provides:

- Pre-funded test accounts
- Known private keys
- A local RPC endpoint at http://127.0.0.1:8545

Terminal 2 – Deploy contract:
```shell
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key <ANVIL_PRIVATE_KEY>
```

Notes:

- Use one of the private keys printed by Anvil
- The deployer account becomes the owner of the contract
- Minting is only available when the connected wallet matches this owner address

Terminal 3 – Run frontend:
```shell
cd frontend
pnpm install #first time only
pnpm dev
```

Usage notes:

- Add the Anvil network to MetaMask (chainId 31337)
- Import one of the Anvil private keys into MetaMask
- Once MetaMask is connected to Localhost, the frontend automatically detects the network and contract

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

### Usage notes

- Switch MetaMask to Sepolia
- Connect any wallet to interact with the token
- The frontend automatically:
  - Detects the active network
  - Uses the correct contract address for Sepolia
  - No redeployment is required unless the smart contract changes

---

## Network Handling Notes

- The frontend never forces a network
- All interactions follow the network selected in MetaMask
- If the connected network has no known contract address, the UI shows “Unsupported network”
This approach avoids mismatches between wallet state and frontend state and reflects how production Web3 dApps behave.

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

