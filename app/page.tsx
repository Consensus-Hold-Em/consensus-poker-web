"use client";
import { User } from "lucide-react";
import Image from "next/image";

import Backdesign from "@/public/assets/cards/backdesign_14.png";
import { Button } from "@/components/ui/button";
import { useZkLogin } from "@mysten/enoki/react";
import { SignInBanner } from "@/components/home/SignInBanner";

import { CustomTerminal } from "@/components/custom-terminal";
import { useTable } from "@/contexts/TableContext";
import { useSui } from "@/hooks/useSui";
import { createTable } from "@/lib/actions/createTable";

export default function Home() {
  const { address } = useZkLogin();

  if (!address) {
    return <SignInBanner />;
  }

  if (!address) {
    return <SignInBanner />;
  }
  // Sui client hook
  const { suiClient } = useSui();
  //table hook
  const { currentTable, setCurrentTable } = useTable();

  return (
    <div className="h-full flex flex-col justify-evenly items-center">
      {/* Create table button */}
      {!currentTable || currentTable === "null" ? (
        <Button
          onClick={() => {
            createTable({ suiClient })
              .then((tableId) => {
                setCurrentTable(tableId);
              })
              .catch((err) => alert(err));
          }}
        >
          Create Table
        </Button>
      ) : (
        <h2>{currentTable}</h2>
      )}

      {/* Circle Container for poker table */}
      <div className="flex flex-col relative w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[2097750] dark:bg-[#6366f1] shadow-lg flex items-center justify-center border-8 border-brown-500 border-opacity-50">
        {Array.from({ length: 4 }, (_, i) => i + 1).map(
          (number, index, arr) => (
            <div
              key={index}
              style={{
                position: "absolute",
                transform: `rotate(${
                  index * (180 / arr.length) - 160
                }deg) translate(180px)`,
                transformOrigin: "center",
              }}
            >
              {/* User icon */}
              <div className="flex items-center gap-2">
                <User
                  className="h-20 w-20"
                  style={{
                    transform: `rotate(${
                      -index * (180 / arr.length) + 160
                    }deg)`,
                  }}
                />

                <div
                  className="flex items-center gap-1"
                  style={{
                    transform: `rotate(${
                      -index * (180 / arr.length) + 160
                    }deg)`,
                  }}
                >
                  {/* Back side cards */}
                  <Image
                    src={Backdesign}
                    alt="backdesign"
                    className="w-12 h-16"
                  />
                  <Image
                    src={Backdesign}
                    alt="backdesign"
                    className="w-12 h-16"
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
      
      {/* React terminal component */}
      <CustomTerminal />
    </div>
  );
}
