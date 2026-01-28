"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { tokenAbi } from "@/lib/token";
import { CONTRACTS } from "@/lib/contracts";

export function TokenInfo() {
    const { address } = useAccount();
    const chainId = useChainId();

    const tokenAddress =
        CONTRACTS[chainId as keyof typeof CONTRACTS]?.token ?? null;

    const enabled = Boolean(address && tokenAddress);

    const { data: name } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "name",
        query: { enabled },
    });

    const { data: symbol } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "symbol",
        query: { enabled },
    });

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
        query: { enabled },
    });

    const { data: balance } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled },
    });

    const { data: totalSupply } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "totalSupply",
        query: { enabled },
    });

    if (!address) {
        return (
            <p className="text-sm text-zinc-500">
                Connect wallet to see token info
            </p>
        );
    }

    if (!tokenAddress) {
        return (
            <p className="text-sm text-zinc-500">
                Unsupported network
            </p>
        );
    }

    return (
        <div className="rounded border p-4 text-center space-y-2 w-[320px]">
            <h2 className="text-lg font-semibold">
                {name} {symbol ? `(${symbol})` : ""}
            </h2>

            {balance !== undefined && decimals !== undefined ? (
                <p className="font-mono">
                    Balance: {formatUnits(balance, decimals)}
                </p>
            ) : (
                <p className="text-sm text-zinc-400">
                    Loading balance…
                </p>
            )}

            {totalSupply !== undefined && decimals !== undefined && (
                <p className="text-sm text-zinc-600">
                    Total supply: {formatUnits(totalSupply, decimals)}
                </p>
            )}
        </div>
    );
}
















