"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useState } from "react";

export function TransferFromToken() {
    const [owner, setOwner] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");

    const { address: spender } = useAccount();

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { data: allowance } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "allowance",
        args:
            isAddress(owner) && spender
                ? [owner, spender]
                : undefined,
        query: { enabled: Boolean(isAddress(owner) && spender) },
    });

    const { writeContract, isPending } = useWriteContract();

    if (!spender) return null;

    const isValid =
        isAddress(owner) &&
        isAddress(to) &&
        amount !== "" &&
        Number(amount) > 0 &&
        decimals !== undefined;

    function onTransferFrom() {
        if (!isValid || !decimals) return;

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "transferFrom",
            args: [
                owner,
                to,
                parseUnits(amount, decimals),
            ],
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

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Recipient address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
            />

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

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

