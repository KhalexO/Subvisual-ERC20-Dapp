import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { localhost } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost],

  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],

  transports: {
    [localhost.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },

  storage: null,
});




