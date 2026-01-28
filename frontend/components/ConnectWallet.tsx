"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-zinc-600">Connected as</p>
                <p className="font-mono text-sm">{address}</p>

                <div className="flex gap-2">
                    <button
                        onClick={() => disconnect()}
                        className="rounded border px-3 py-1 text-sm hover:bg-zinc-50"
                    >
                        Disconnect
                    </button>

                    <button
                        onClick={() => {
                            disconnect();
                            setTimeout(() => {
                                connect({ connector: connectors[0] });
                            }, 100);
                        }}
                        className="rounded border px-3 py-1 text-sm hover:bg-zinc-50"
                    >
                        Change account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect({ connector: connectors[0] })}
            className="rounded border px-4 py-2"
        >
            Connect Wallet
        </button>
    );
}






