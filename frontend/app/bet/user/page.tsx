"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";

import { ethers } from "ethers";
import BettingContract from "../../lib/BettingContract.json";
import { useAccount, useBalance, useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const UserPage = () => {
  const { toast } = useToast();
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const [amount, setAmount] = useState(1);

  const { data: bettingOpen, refetch: refetchBettingStatus } = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "bettingOpen",
  });
  const [selectedNumber, setSelectedNumber] = useState(0);

  const { data: betters, refetch: refetchBetters }: any = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "betters",
  });

  const handleBet = () => {
    if (selectedNumber === 0) {
      toast({ title: "Warning!", description: "You need to select number", variant: "destructive", duration: 1000 });
    }
    if (balance && amount >= parseFloat(ethers.formatEther(balance?.value))) {
      toast({ title: "Warning!", description: "You don't have enough ether", variant: "destructive", duration: 1000 });
    }

    console.log(ethers.parseEther(amount.toString()));
    writeContract({
      address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
      abi: BettingContract.abi,
      functionName: "bet",
      args: [selectedNumber],
      value: ethers.parseEther(amount.toString()),
    });
  };

  return (
    <div className="flex-1 pt-10 relative">
      <h2 className="text-center text-5xl text-red-900">Select Number</h2>
      <div className="grid grid-cols-5 grid-rows-2 w-2/3 lg:w-1/2 mx-auto gap-4 mt-10">
        {numbers.map((id, index) => {
          return (
            <Card
              className={`cursor-pointer hover:scale-125 hover:bg-green-100 transition-all duration-500 ${
                selectedNumber === id ? "bg-red-300 hover:bg-red-300" : ""
              }`}
              key={index}
              onClick={() => {
                setSelectedNumber(id);
              }}
            >
              <CardContent className="p-5">
                <div className="flex justify-center items-center h-20 flex-col gap-y-4">
                  <h2 className="text-4xl text-center m-0">{id}</h2>
                  <p> 0 Eth</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-center mt-20">
        <div className="flex flex-col items-center gap-y-4">
          <div className="flex gap-x-5 items-center">
            <label htmlFor="" className="text-4xl">
              Amount to Bet:
            </label>
            <input
              type="number"
              step={0.001}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="border border-black text-3xl text-center w-[200px] p-2 rounded-xl"
            />
          </div>
          <Button className="text-2xl p-5 w-1/2 bg-gray-800" onClick={handleBet}>
            Place Bet
          </Button>
        </div>
      </div>
      <div className="absolute top-10 right-10 z-0">
        <Card className="p-5 bg-[#ffff0050]">
          <CardTitle>Current Status</CardTitle>
          <div className="flex items-center mt-2">
            <label htmlFor="">{`Status:`} &nbsp;</label>
            <div className={`w-3 h-3 rounded-full  ${bettingOpen ? "bg-green-400" : "bg-red-400"}`}></div> &nbsp;{" "}
            {bettingOpen ? "Betting started" : "Not started"}
          </div>
          <div className="flex items-center">
            <label htmlFor="">{`Participants:`} &nbsp;</label>
            {betters?.length || "0"}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
