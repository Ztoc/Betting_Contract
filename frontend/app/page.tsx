"use client";

import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import "dotenv/config";

export default function Home() {
  const { address } = useAccount();
  useEffect(() => {
    console.log(process.env.DEPLOYER);
    if (address == process.env.DEPLOYER) {
      console.log("dd");
    }
  }, [address]);

  console.log(address);
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="h-20 border-b border-b-slate-500 p-5 flex items-center justify-end">
        <div>
          <ConnectButton />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className=" basis-2/3 flex flex-col items-center gap-y-5">
          <h1 className="text-6xl">Welcome to Betting</h1>
          <h3 className="text-3xl">
            Easy way to be <span className=" text-lime-900">Rich!</span>
          </h3>
        </div>
        <div className="basis-1/3">
          <h1 className="text-2xl text-green-500 mb-6">How to Play</h1>
          <ol type="A" className="flex flex-col gap-y-4 list-decimal">
            <li>Connect wallet to start bet</li>
            <li>Select number between 1 and 10</li>
            <li>Select Amount to bet</li>
            <li>See result when betting ends</li>
            <li>Withdraw if win</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
