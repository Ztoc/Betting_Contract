"use client";

import { useAccount, useReadContract } from "wagmi";
import BettingContract from "./lib/BettingContract.json";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const data = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "owner",
  });
  const { address } = useAccount();

  if (address) {
    if (address == data.data) {
      router.push("/bet/admin");
    } else {
      router.push("/bet/user");
    }
  }

  return (
    <>
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
    </>
  );
}
