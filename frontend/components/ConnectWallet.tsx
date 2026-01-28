"use client";

import { useAccount, useConnect } from "wagmi";

export function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();

    if (isConnected) return <p>Connected: {address}</p>;

    return (
        <>
            {connectors.map((connector) => (
                <button key={connector.uid} onClick={() => connect({ connector })}>
                    Connect Wallet
                </button>
            ))}
        </>
    );
}
