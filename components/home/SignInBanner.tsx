import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useEnokiFlow } from "@mysten/enoki/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const SignInBanner = () => {
  const enokiFlow = useEnokiFlow();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    const protocol = window.location.protocol;
    const host = window.location.host;
    const redirectUrl = `${protocol}//${host}/auth`;
    console.log({
      redirectUrl,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    });
    enokiFlow
      .createAuthorizationURL({
        provider: "google",
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirectUrl,
        network: "testnet",
        extraParams: {
          scope: ["openid", "email", "profile"],
        },
      })
      .then((url) => {
        setIsLoading(false);
        router.push(url);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        toast.error("Failed to redirect to Google Sign In. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="bg-white flex flex-col p-[60px] max-w-[480px] mx-auto rounded-[24px] items-center space-y-[60px]">
       
        <div className="flex flex-col space-y-[30px] items-center">
          <div className="flex flex-col space-y-[20px] items-center">
            <div className="font-[700] text-[20px] text-center">
            Trustless Hold-em
            </div>
            <div className="text-center text-opacity-90 text-[16px] text-[#4F4F4F]">
              Fair, decentralized, trustless poker which does not rely on a centralized house or oracle.
            </div>
          </div>
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="h-[64px] text-dark flex gap-4 bg-[inherit] rounded-[10px] border-[1px] border-[#CCCCCC] hover:bg-gray-100"
          >
            <Image
              src="/general/google.svg"
              alt="Google"
              width={32}
              height={32}
            /> 
            <div className="text-lg">Google Login</div>
          </Button>
        </div>
      </div>
    </div>
  );
};
