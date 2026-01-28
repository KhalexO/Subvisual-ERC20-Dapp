export const CONTRACTS = {
  31337: {
    token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  11155111: {
    token: "0x055a23FD60bE3009cd1cd155649C31A402d55094",
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACTS;

