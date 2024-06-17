"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

const Header = () => {
  const { address } = useAccount();
  const router = useRouter();
  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address]);

  return (
    <div className="h-20 border-b border-b-slate-500 p-5 flex items-center justify-end">
      <div>
        <ConnectButton />
      </div>{" "}
    </div>
  );
};

export default Header;
