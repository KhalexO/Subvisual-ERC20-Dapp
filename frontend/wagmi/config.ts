import { createConfig, http } from "wagmi";
import { localhost } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

