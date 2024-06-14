"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import BettingContract from "../../lib/BettingContract.json";
import { useToast } from "@/components/ui/use-toast";

const Adminpage = () => {
  const { toast } = useToast();
  const [winning, setWinning] = useState(0);
  const { writeContract } = useWriteContract();
  const { data: bettingOpen, refetch: bettingStatusRefetch } = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "bettingOpen",
  });

  const { data: betters, refetch: refetchBetters }: any = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "betters",
  });
  const { data: amounts, refetch: refetchAmounts }: any = useReadContract({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    functionName: "totalBetAmount",
  });

  useWatchContractEvent({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    eventName: "BetPlaced",
    onLogs(logs) {
      refetchBetters();
      refetchAmounts();
    },
  });
  useWatchContractEvent({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    eventName: "bettingEnded",
    onLogs(logs: any) {
      console.log(logs);
      bettingStatusRefetch();
      setWinning(logs[0].args.winnngNumber);
      toast({
        title: "Betting Ended",
        description: "Winning Number is " + logs[0]?.args?.winningNumber,
        duration: 1000,
        variant: "default",
      });
    },
  });

  useWatchContractEvent({
    address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
    abi: BettingContract.abi,
    eventName: "BettingStarted",
    onLogs(logs) {
      bettingStatusRefetch();
      toast({
        title: "Btting infeo",
        description: "Betting Started",
        duration: 1000,
        variant: "default",
      });
    },
  });

  const startBetting = () => {
    if (bettingOpen) {
      toast({
        title: "Betting Infomation",
        description: "Betting is already started",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }
    writeContract({
      address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
      abi: BettingContract.abi,
      functionName: "startBetting",
    });
  };
  const endBetting = () => {
    if (!bettingOpen) {
      toast({
        title: "Betting Infomation",
        description: "Betting isn't started yet!",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }
    writeContract({
      address: "0x714BC266E77ccC6506bFCE9D92bb1974Fa98E624",
      abi: BettingContract.abi,
      functionName: "endBetting",
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-center p-10 gap-x-6">
        <Button variant={"destructive"} onClick={startBetting}>
          Start Betting
        </Button>
        <Button onClick={endBetting}>End Betting</Button>
      </div>
      <div className="w-1/2 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Betting Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-x-4">
                <label>Status:</label>
                {bettingOpen ? <p className="text-green-800">Started</p> : <p className=" text-orange-800">Ended</p>}
              </div>
              <div className="flex gap-x-4">
                <label>Total Betters:</label>
                {betters?.length || "0"}
              </div>
              <div className="flex gap-x-4">
                <label>Total Amounts:</label>
                {amounts || "0"}
              </div>
              {winning > 0 && (
                <div className="flex gap-x-4">
                  <label>Winning Number:</label>
                  {winning || "0"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Adminpage;
