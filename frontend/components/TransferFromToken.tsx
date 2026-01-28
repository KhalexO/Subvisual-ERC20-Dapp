"use client";

import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function TransferFromToken() {
    const [owner, setOwner] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { address: spender } = useAccount();
    const queryClient = useQueryClient();

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "allowance",
        args: isAddress(owner) && spender ? [owner, spender] : undefined,
        query: { enabled: Boolean(isAddress(owner) && spender) },
    });

    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending,
    } = useWriteContract();

    const { isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries();
            queryClient.refetchQueries();
            refetchAllowance();

            setOwner("");
            setTo("");
            setAmount("");
            setError(null);
        }
    }, [isSuccess, queryClient, refetchAllowance]);

    useEffect(() => {
        if (isError || writeError) {
            const msg =
                writeError?.message?.includes("allowance")
                    ? "Insufficient allowance"
                    : "Transaction failed";
            setError(msg);
        }
    }, [isError, writeError]);

    if (!spender) return null;

    const validOwner = isAddress(owner);
    const validTo = isAddress(to);
    const validAmount = Number(amount) > 0;
    const isValid =
        validOwner && validTo && validAmount && decimals !== undefined;

    function onTransferFrom() {
        if (!isValid || !decimals) return;
        setError(null);

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "transferFrom",
            args: [owner, to, parseUnits(amount, decimals)],
        });
    }

    return (
        <div className="rounded border p-4 space-y-3 w-[320px]">
            <h3 className="font-semibold text-center">Transfer From</h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Owner address"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
            />
            {!validOwner && owner !== "" && (
                <p className="text-xs text-red-500">Invalid owner address</p>
            )}

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Recipient address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            {!validTo && to !== "" && (
                <p className="text-xs text-red-500">Invalid recipient address</p>
            )}

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            {!validAmount && amount !== "" && (
                <p className="text-xs text-red-500">Invalid amount</p>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
                onClick={onTransferFrom}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Sending…" : "Transfer From"}
            </button>

            {allowance !== undefined && decimals !== undefined && (
                <p className="text-sm text-zinc-600 text-center">
                    Allowance: {formatUnits(allowance, decimals)}
                </p>
            )}
        </div>
    );
}





