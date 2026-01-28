"use client";

import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useChainId,
} from "wagmi";
import { parseUnits, isAddress } from "viem";
import { tokenAbi } from "@/lib/token";
import { CONTRACTS } from "@/lib/contracts";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function MintToken() {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { address } = useAccount();
    const chainId = useChainId();
    const queryClient = useQueryClient();

    const tokenAddress =
        CONTRACTS[chainId as keyof typeof CONTRACTS]?.token ?? null;

    const { data: owner } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "owner",
        query: { enabled: Boolean(tokenAddress) },
    });

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
        query: { enabled: Boolean(tokenAddress) },
    });

    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending,
    } = useWriteContract();

    const { isSuccess, isError } =
        useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries();
            setTo("");
            setAmount("");
            setError(null);
        }
    }, [isSuccess, queryClient]);

    useEffect(() => {
        if (isError || writeError) {
            setError("Transaction failed");
        }
    }, [isError, writeError]);

    if (!address) return null;

    if (!tokenAddress) {
        return (
            <p className="text-sm text-zinc-500">
                Unsupported network
            </p>
        );
    }

    if (!owner) return null;

    if (address.toLowerCase() !== owner.toLowerCase()) {
        return null;
    }

    const validAddress = isAddress(to);
    const validAmount = Number(amount) > 0;
    const isValid =
        validAddress && validAmount && decimals !== undefined;

    function onMint() {
        if (!isValid || !decimals) return;

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "mint",
            args: [to, parseUnits(amount, decimals)],
        });
    }

    return (
        <div className="rounded border p-4 space-y-3 w-[320px]">
            <h3 className="font-semibold text-center">
                Mint (Owner only)
            </h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Recipient address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            {!validAddress && to !== "" && (
                <p className="text-xs text-red-500">
                    Invalid address
                </p>
            )}

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            {!validAmount && amount !== "" && (
                <p className="text-xs text-red-500">
                    Invalid amount
                </p>
            )}

            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}

            <button
                onClick={onMint}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Minting…" : "Mint"}
            </button>
        </div>
    );
}







