"use client";

import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useChainId,
} from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import { tokenAbi } from "@/lib/token";
import { CONTRACTS } from "@/lib/contracts";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function ApproveToken() {
    const [spender, setSpender] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { address } = useAccount();
    const chainId = useChainId();
    const queryClient = useQueryClient();

    const tokenAddress =
        CONTRACTS[chainId as keyof typeof CONTRACTS]?.token ?? null;

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
        query: { enabled: Boolean(tokenAddress) },
    });

    const { data: allowance, refetch: refetchAllowance } =
        useReadContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "allowance",
            args:
                address && isAddress(spender)
                    ? [address, spender]
                    : undefined,
            query: {
                enabled: Boolean(address && isAddress(spender)),
            },
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
            queryClient.refetchQueries();
            refetchAllowance();

            setSpender("");
            setAmount("");
            setError(null);
        }
    }, [isSuccess, queryClient, refetchAllowance]);

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

    const validAddress = isAddress(spender);
    const validAmount = Number(amount) > 0;
    const isValid =
        validAddress && validAmount && decimals !== undefined;

    function onApprove() {
        if (!isValid || !decimals) return;

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "approve",
            args: [spender, parseUnits(amount, decimals)],
        });
    }

    return (
        <div className="rounded border p-4 space-y-3 w-[320px]">
            <h3 className="font-semibold text-center">
                Approve
            </h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Spender address"
                value={spender}
                onChange={(e) => setSpender(e.target.value)}
            />
            {!validAddress && spender !== "" && (
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
                onClick={onApprove}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Approving…" : "Approve"}
            </button>

            {allowance !== undefined &&
                decimals !== undefined && (
                    <p className="text-sm text-zinc-600 text-center">
                        Allowance:{" "}
                        {formatUnits(allowance, decimals)}
                    </p>
                )}
        </div>
    );
}






