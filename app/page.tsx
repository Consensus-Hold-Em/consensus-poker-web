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
<<<<<<< HEAD

export default function Home() {
  const { address } = useZkLogin();

=======
import { getKeypair } from "@/lib/keypair/getKeyPair";
import { joinTable } from "@/lib/actions/joinTable";
import { newHand } from "@/lib/actions/newHand";
import { startHand } from "@/lib/actions/startHand";
export default function Home() {
  const { address } = useZkLogin();

  const { balance, handleRefreshBalance } = useBalance();

  const [streamText, setStreamText] = useState('');
  
>>>>>>> 9a1f93a (implementing on chain methods)
  if (!address) {
    return <SignInBanner />;
  }

  if (!address) {
    return <SignInBanner />;
  }
  // Sui client hook
  const { suiClient } = useSui();
<<<<<<< HEAD
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
=======
  const {currentTable, setCurrentTable, players, setPlayers, game, setGame} = useTable();
  
  return (
    <div className="h-full flex flex-col justify-evenly items-center">
       <div className="absolute top-[80px] left-2 rounded-lg bg-white p-2 text-xs">
          {currentTable && currentTable !== "null" &&
        
          
          <h2>Table ID: <br/>{currentTable}</h2>
          }
      </div>
      
      
    <div 
      className="flex flex-col relative gap-4"
      >
        { (!currentTable || currentTable === "null") &&
          <Button onClick={() => {
            createTable({suiClient}).then((tableId) => {
              setCurrentTable(tableId);
              setStreamText("Table created successfully. Table ID: " + tableId);
            });
          }}>Create Table</Button>

        }

      <div className="flex items-center gap-4">
        <User className="h-20 w-20"/>
        
        <div className="flex items-center gap-1" >
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
        </div>
        {
          currentTable && currentTable !== "null" && <div className="rounded-lg bg-white p-2 text-xs">
            <span className="font-semibold">Player 1: </span>
            {players?.[0]?.publicKey}</div>
        }
        
      </div>
      <div className="flex items-center gap-4">
        <User className="h-20 w-20"/>
        
        <div className="flex items-center gap-1" >
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
        </div>
        {
          currentTable && currentTable !== "null" && <div className="rounded-lg bg-white p-2 text-xs">
            <span className="font-semibold">Player 2: </span>
            {players?.[1]?.publicKey}</div>
          
      
        }
        {
          !players?.[1]?.joined ? <Button onClick={() => {
            joinTable({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!}).then( (res) => {console.log('res', res)}).catch((err) => {alert(err)});
            const newPlayers = [...players];
            newPlayers[1].joined = true
            setPlayers(newPlayers);
            setStreamText("Player 2 joined the table. ");
          }}>
            Join Table
          </Button> : <div>Player 2 in Table</div>
        }
        
      </div>
      <div className="flex items-center gap-4">
        <User className="h-20 w-20"/>
        
        <div className="flex items-center gap-1" >
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
        </div>
        {
          currentTable && currentTable !== "null" && 
          <>
          <div className="rounded-lg bg-white p-2 text-xs">
            <span className="font-semibold">Player 3: </span>
            {players?.[2]?.publicKey}
            </div>
            {
          !players?.[2]?.joined ? <Button onClick={() => {
            joinTable({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!}).then( (res) => {console.log('res', res)}).catch((err) => {alert(err)});
            const newPlayers = [...players];
            newPlayers[2].joined = true
            setPlayers(newPlayers);
            setStreamText("Player 3 joined the table. ");
          }}>
            Join Table
          </Button> : <div>Player 3 in Table</div>
        }
            
          </>
        }

        
        
      </div>

      {currentTable && currentTable !== "null" && !game?.started && <Button
        onClick={async () => {
          newHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!}).then((player1SeedKey) => {
            let newPlayers = [...players];
            newPlayers[0].seedKey = player1SeedKey;
            setPlayers(newPlayers);
            setStreamText("Player 1 New Hand Initiated.");
            newHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!}).then((player2SeedKey) => {
              let newPlayers = [...players];
              newPlayers[1].seedKey = player2SeedKey;
              setPlayers(newPlayers);
              setStreamText("Player 2 New Hand Initiated.");
              newHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!}).then((player3SeedKey) => {
                let newPlayers = [...players];
                newPlayers[2].seedKey = player3SeedKey;
                setPlayers(newPlayers);
                setStreamText("Player 3 New Hand Initiated.");
                console.log("new hand 3")
                startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players[0].seedKey}).then(async () => {
                  await new Promise(resolve => setTimeout(resolve, 4000));
                  setStreamText("Player 1 Start Hand Initiated.");
                  console.log("start hand 1")
                  startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players[1].seedKey}).then(async () => {
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    setStreamText("Player 2 Start Hand Initiated.");
                    console.log("start hand 2")
                    startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players[2].seedKey}).then(async () => {
                      await new Promise(resolve => setTimeout(resolve, 4000));
                      setStreamText("Player 3 Start Hand Initiated.");
                      console.log("start hand 3")

                      setGame({...game, started: true});
                    });
                  });
                
                })   

              });
            });
          
          })
        }}
      
      >Start Game</Button>}


      {
        game?.started && !game?.shuffle && <Button onClick={() => {

          startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players[0].seedKey}).then(async () => {
            await new Promise(resolve => setTimeout(resolve, 4000));
            setStreamText("Player 1 Start Hand Initiated.");
            console.log("start hand 1")
            startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players[1].seedKey}).then(async () => {
              await new Promise(resolve => setTimeout(resolve, 4000));
              setStreamText("Player 2 Start Hand Initiated.");
              console.log("start hand 2")
              startHand({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players[2].seedKey}).then(async () => {
                await new Promise(resolve => setTimeout(resolve, 4000));
                setStreamText("Player 3 Start Hand Initiated.");
                console.log("start hand 3")

                setGame({...game, started: true});
              });
            });
          
          })  
          
        }}>Shuffle and Decrypt</Button>
      }

      



    </div>

    
    
    <CustomTerminal streamText={streamText} />
  </div>
>>>>>>> 9a1f93a (implementing on chain methods)
  );
}
