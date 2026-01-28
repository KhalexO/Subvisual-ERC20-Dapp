"use client";

import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, isAddress } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function TransferToken() {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { address } = useAccount();
    const queryClient = useQueryClient();

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
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
            // 🔥 força refresh imediato
            queryClient.invalidateQueries();
            queryClient.refetchQueries();

            // 🧹 limpar inputs
            setTo("");
            setAmount("");
            setError(null);
        }
    }, [isSuccess, queryClient]);

    useEffect(() => {
        if (isError || writeError) {
            const msg =
                writeError?.message?.includes("exceeds balance")
                    ? "Insufficient balance"
                    : "Transaction failed";
            setError(msg);
        }
    }, [isError, writeError]);

    if (!address) return null;

    const validAddress = isAddress(to);
    const validAmount = Number(amount) > 0;
    const isValid = validAddress && validAmount && decimals !== undefined;

    function onTransfer() {
        if (!isValid || !decimals) return;
        setError(null);

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "transfer",
            args: [to, parseUnits(amount, decimals)],
        });
    }

    return (
        <div className="rounded border p-4 space-y-3 w-[320px]">
            <h3 className="font-semibold text-center">Transfer</h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Recipient address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />
            {!validAddress && to !== "" && (
                <p className="text-xs text-red-500">Invalid address</p>
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
                onClick={onTransfer}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Sending…" : "Transfer"}
            </button>
        </div>
    );
}





