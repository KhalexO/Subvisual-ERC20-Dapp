"use client";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/wagmi/config";

export function Providers({ children }: { children: React.ReactNode }) {
    return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}
