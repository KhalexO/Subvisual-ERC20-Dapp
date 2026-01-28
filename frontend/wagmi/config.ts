import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { localhost, sepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost, sepolia],

  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],

  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!),
  },

  storage: null,
});







