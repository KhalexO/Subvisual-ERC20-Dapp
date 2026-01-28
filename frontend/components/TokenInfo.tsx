"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";

export function TokenInfo() {
    const { address } = useAccount();

    const { data: name } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "name",
    });

    const { data: symbol } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "symbol",
    });

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { data: balance } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: Boolean(address) },
    });

    const { data: totalSupply } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "totalSupply",
    });

    if (!address) {
        return (
            <p className="text-sm text-zinc-500">
                Connect wallet to see token info
            </p>
        );
    }

    return (
        <div className="rounded border p-4 text-center space-y-2 w-[320px]">
            <h2 className="text-lg font-semibold">
                {name} {symbol ? `(${symbol})` : ""}
            </h2>

            {balance !== undefined && decimals !== undefined && (
                <p className="font-mono">
                    Balance: {formatUnits(balance, decimals)}
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









