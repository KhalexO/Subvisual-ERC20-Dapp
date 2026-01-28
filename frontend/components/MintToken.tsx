"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { tokenAbi, tokenAddress } from "@/lib/contracts";
import { useState } from "react";

export function MintToken() {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");

    const { address } = useAccount();

    const { data: owner } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "owner",
    });

    const { data: decimals } = useReadContract({
        abi: tokenAbi,
        address: tokenAddress,
        functionName: "decimals",
    });

    const { writeContract, isPending } = useWriteContract();

    if (!address || !owner) return null;

    const isOwner =
        address.toLowerCase() === owner.toLowerCase();

    if (!isOwner) return null;

    const isValid =
        isAddress(to) &&
        amount !== "" &&
        Number(amount) > 0 &&
        decimals !== undefined;

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

            {!isAddress(to) && to !== "" && (
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


