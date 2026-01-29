import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { anvil } from "@/lib/chains";

export const wagmiConfig = createConfig({
  chains: [anvil, sepolia],

  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],

  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!),
  },

  storage: null,
});








