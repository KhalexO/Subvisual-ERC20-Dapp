"use client";

import { useChainId } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";

export function NetworkInfo() {
    const chainId = useChainId();

    if (!chainId) {
        return (
            <p className="text-sm text-zinc-500">
                No network connected
            </p>
        );
    }

    const chain =
        chainId === sepolia.id
            ? sepolia
            : chainId === localhost.id
                ? localhost
                : null;

    if (!chain) {
        return (
            <p className="text-sm text-zinc-500">
                Unknown network (chainId: {chainId})
            </p>
        );
    }

    return (
        <p className="text-sm text-zinc-600">
            Network: {chain.name} (chainId: {chain.id})
        </p>
    );
}


