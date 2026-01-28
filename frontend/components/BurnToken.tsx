"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useState } from "react";

export function BurnToken() {
    const [amount, setAmount] = useState("");
    const { address } = useAccount();

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { writeContract, isPending } = useWriteContract();

    if (!address) return null;

    const isValid =
        amount !== "" &&
        Number(amount) > 0 &&
        decimals !== undefined;

    function onBurn() {
        if (!isValid || !decimals) return;

        writeContract({
            abi: tokenAbi,
            address: tokenAddress,
            functionName: "burn",
            args: [parseUnits(amount, decimals)],
        });
    }

    return (
        <div className="rounded border p-4 space-y-3 w-[320px]">
            <h3 className="font-semibold text-center">Burn</h3>

            <input
                className="w-full rounded border px-2 py-1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={onBurn}
                disabled={!isValid || isPending}
                className="w-full rounded border px-4 py-2 disabled:opacity-50"
            >
                {isPending ? "Burning…" : "Burn"}
            </button>
        </div>
    );
}

