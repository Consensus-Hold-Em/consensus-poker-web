"use client";
import { User } from "lucide-react";
import Image from "next/image";

import Backdesign from "@/public/assets/cards/backdesign_14.png";
import { Button } from "@/components/ui/button";
import { useZkLogin } from "@mysten/enoki/react";
import { useBalance } from "@/contexts/BalanceContext";
import { SignInBanner } from "@/components/home/SignInBanner";
export default function Home() {
  const { address } = useZkLogin();
  const { balance, handleRefreshBalance } = useBalance();
  console.log({address, balance, handleRefreshBalance});

  if (!address) {
    return <SignInBanner />;
  }

  
  return (
    <div className="flex flex-col justify-start items-center pt-[100px]">
    <div 
      className="relative w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full bg-blue-500 dark:bg-[#6366f1] shadow-lg flex items-center justify-center border-8 border-brown-500 border-opacity-50"
      // style={{
      //   backgroundImage: `url('/public/assets/backgrounds/blue_1136x640.png')`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
      >
      {Array.from({length: 4}, (_, i) => i + 1).map((number, index, arr) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            transform: `rotate(${(index * (360/arr.length)) - 90}deg) translate(260px)`,
            transformOrigin: 'center',
          }}
        >
          
          <div className="flex items-center gap-2">
            <User className="h-20 w-20" style={{ transform: `rotate(${(-index * (360/arr.length)) + 90}deg)` }} />
            <div className="flex items-center" style={{ transform: `rotate(${(-index * (360/arr.length)) + 90}deg)` }}>
              {/* <div className="bg-red-600 w-10 h-14 rounded" ></div>
              <div className="bg-red-600 w-10 h-14 rounded" ></div> */}
              <Image src={Backdesign} alt="backdesign" className="w-10 h-16"/>
              <Image src={Backdesign} alt="backdesign" className="w-10 h-16"/>
            </div>
          </div>
          </div>
      ))}

    </div>
    <div className="absolute bottom-12 flex items-center justify-center gap-2 z-20">
        <Button>Check</Button>
        <Button>Call</Button>
        <Button>Raise</Button>
        <Button>Fold</Button>
    </div>
  </div>
  );
}
