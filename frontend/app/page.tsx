import { ConnectWallet } from "@/components/ConnectWallet";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TokenInfo } from "@/components/TokenInfo";
import { ApproveToken } from "@/components/ApproveToken";
import { TransferFromToken } from "@/components/TransferFromToken";
import { TransferToken } from "@/components/TransferToken";
import { MintToken } from "@/components/MintToken";
import { BurnToken } from "@/components/BurnToken";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">
        Subvisual ERC20 dApp
      </h1>

      <p className="text-zinc-600">
        Connect your wallet to interact with the token
      </p>

      <ClientOnly>
        <ConnectWallet />
        <NetworkInfo />
        <TokenInfo />

        <div className="flex flex-wrap gap-6 justify-center">
          <ApproveToken />
          <TransferFromToken />
          <TransferToken />
          <MintToken />
          <BurnToken />
        </div>
      </ClientOnly>
    </main>
  );
}












