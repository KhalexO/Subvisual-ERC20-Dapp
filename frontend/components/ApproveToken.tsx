"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, formatUnits, isAddress } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useState } from "react";

export function ApproveToken() {
    const [spender, setSpender] = useState("");
    const [amount, setAmount] = useState("");

    const { address } = useAccount();

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { data: allowance } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "allowance",
        args: address && isAddress(spender) ? [address, spender] : undefined,
        query: { enabled: Boolean(address && isAddress(spender)) },
    });

    const { writeContract, isPending } = useWriteContract();

    if (!address) return null;

    const isValid =
        isAddress(spender) &&
        amount !== "" &&
        Number(amount) > 0 &&
        decimals !== undefined;

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
            <h3 className="font-semibold text-center">Approve</h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Spender address"
                value={spender}
                onChange={(e) => setSpender(e.target.value)}
            />

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={onApprove}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Approving…" : "Approve"}
            </button>

            {allowance !== undefined && decimals !== undefined && (
                <p className="text-sm text-zinc-600 text-center">
                    Allowance: {formatUnits(allowance, decimals)}
                </p>
            )}
        </div>
    );
}

