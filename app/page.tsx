"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CircuitBoard, Spade } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/config/site";

import IconCloud from "@/components/magicui/icon-cloud";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import RetroGrid from "@/components/magicui/retro-grid";
import DotPattern from "@/components/magicui/dot-pattern";
import BlurIn from "@/components/magicui/blur-in";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
 
const slugs = [
  "bitcon",
  "ethereum",
  "sui",
  "litecoin",
  "solana",
  "linux",

];
 


<<<<<<< HEAD
import { CustomTerminal } from "@/components/custom-terminal";
import { useTable } from "@/contexts/TableContext";
import { useSui } from "@/hooks/useSui";
import { createTable } from "@/lib/actions/createTable";
import { getKeypair } from "@/lib/keypair/getKeyPair";
import { joinTable } from "@/lib/actions/joinTable";
import { newHand } from "@/lib/actions/newHand";
import { startHand } from "@/lib/actions/startHand";
import { shuffleAndDecrypt } from "@/lib/actions/shuffleAndDecrypt";
import { useBalance } from "@/contexts/BalanceContext";
import { useState } from "react";
import { FindPlayerCard } from "@/protocol/player";
import { revealFlop, showCards, showFlop } from "@/lib/actions/revealCards";
import { cardMapper } from "@/helpers/cards";
export default function Home() {
  const { address } = useZkLogin();

  const { balance, handleRefreshBalance } = useBalance();

  const [streamText, setStreamText] = useState('');
  
  if (!address) {
    return <SignInBanner />;
  }

  if (!address) {
    return <SignInBanner />;
  }
  // Sui client hook
  const { suiClient } = useSui();
  const {currentTable, setCurrentTable, players, setPlayers, game, setGame} = useTable();
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [player1Status, setPlayer1Status] = useState('not joined');
  const [player2Status, setPlayer2Status] = useState('not joined');
  const [player3Status, setPlayer3Status] = useState('not joined');
=======

export default function Home() {
>>>>>>> demo

  const [duration, setDuration] = useState(2);
  return (
<<<<<<< HEAD
    <div className="h-full flex flex-col justify-evenly items-center">
       <div className="absolute top-[80px] left-2 rounded-lg bg-white p-2 text-xs">
          {currentTable && currentTable !== "null" &&
        
          
          <h2>Table ID: <br/>{currentTable}</h2>
          }
=======
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex relative items-center justify-center py-12 h-screen">
     
          {/* <DotPattern
            className={cn(
              "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]",
            )}
          /> */}
          <div className="flex flex-col justify-center lg:justify-start items-center gap-4 text-center">
            <img src="/assets/cards_graphic.webp" 
              className="rounded-2xl"
              width={"40%"}
            />
              <BlurIn
                word={siteSettings?.name}
                className="text-lg font-bold text-black dark:text-white"
              />

              <AnimatedGradientText>
                  ♠️<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                  <span
                    className={cn(
                      `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                    )}
                  >
                   {siteSettings?.tagline}
                  </span>
                  <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedGradientText>

                {/* <IconCloud iconSlugs={slugs} /> */}
               
                <GradualSpacing
                  className="font-display text-center text-md"
                  text={siteSettings?.description}
                />

          <div className="hidden md:flex w-full px-8 max-w-[400px] m-12">
            <Slider defaultValue={[duration]} max={10} step={.5} onValueChange={(value) => {
              setDuration(value[0])
            }}
            />
        </div>
           
          </div>

         
         
>>>>>>> demo
      </div>
      <div className="hidden relative bg-muted lg:block group">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={.8}
          duration={duration}
          repeatDelay={duration / 10}
          className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0  skew-y-24 p-4",
          )}
        />
       

    
      
<<<<<<< HEAD
      
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
          {
            players?.[0]?.cards?.card1 ?
              <img src={"/assets/cards/" + cardMapper[players?.[0]?.cards?.card1] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
          {
            players?.[0]?.cards?.card2 ?
              <img src={"/assets/cards/" + cardMapper[players?.[0]?.cards?.card2] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
        
        </div>
        {
          currentTable && currentTable !== "null" && <div className="rounded-lg bg-white p-2 text-xs">
            <span className="font-semibold">Player 1: </span>
            {players?.[0]?.publicKey}</div>
        }
        {
          game?.shuffled && !players[0].revealedCards && <Button onClick={() => {
            console.log('show cards', {suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players?.[0].seedKey})
            showCards({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players?.[0].seedKey}).then( (cards) => {
              let newPlayers = [...players];
              newPlayers[0].cards = cards;
              newPlayers[0].revealedCards = true;
              setPlayers(newPlayers);
              console.log('cards player 1', cards);
            }).catch((err) => {alert(err)});
            setStreamText("Player 1 cards revealed. ");
          }}>
            Reveal Cards
          </Button> 
        }
        
      </div>
      <div className="flex items-center gap-4">
        <User className="h-20 w-20"/>
        
        <div className="flex items-center gap-1" >
          {
            players?.[1]?.cards?.card1 ?
              <img src={"/assets/cards/" + cardMapper[players?.[1]?.cards?.card1] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
          {
            players?.[1]?.cards?.card2 ?
              <img src={"/assets/cards/" + cardMapper[players?.[1]?.cards?.card2] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
        
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
         {
          game?.shuffled && !players[1].revealedCards && <Button onClick={() => {
            console.log('show cards', {suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players?.[1].seedKey})
            showCards({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players?.[1].seedKey}).then( (cards) => {
              let newPlayers = [...players];
              newPlayers[1].cards = cards;
              newPlayers[1].revealedCards = true;
              setPlayers(newPlayers);
              console.log('cards player 2', cards);
            }).catch((err) => {alert(err)});
            setStreamText("Player 2 cards revealed. ");
          }}>
            Reveal Cards
          </Button> 
        }
        
      </div>
      <div className="flex items-center gap-4">
        <User className="h-20 w-20"/>
        
        <div className="flex items-center gap-1" >
        {
            players?.[2]?.cards?.card1 ?
              <img src={"/assets/cards/" + cardMapper[players?.[2]?.cards?.card1] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
          {
            players?.[2]?.cards?.card2 ?
              <img src={"/assets/cards/" + cardMapper[players?.[2]?.cards?.card2] + ".png"} alt="backdesign" className="w-12 h-16"/> :
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
          }
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
            
            setStreamText("Player 2 joined the table. ");
          }}>
            Join Table
          </Button> : <div>Player 3 in Table</div>
        }



      {
          game?.shuffled && !players[2].revealedCards && <Button onClick={() => {
            console.log('show cards', {suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players?.[2].seedKey})
            showCards({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players?.[2].seedKey}).then( (cards) => {
              let newPlayers = [...players];
              newPlayers[2].cards = cards;
              newPlayers[2].revealedCards = true;
              setPlayers(newPlayers);
              console.log('cards player 3', cards);
            }).catch((err) => {alert(err)});
            setStreamText("Player 3 cards revealed. ");
          }}>
            Reveal Cards
          </Button> 
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
        game?.started && !game?.shuffled && <Button onClick={() => {

          shuffleAndDecrypt({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players[0].seedKey}).then(async () => {
            await new Promise(resolve => setTimeout(resolve, 4000));
            setStreamText("Player 2 Shuffle Success.");
            console.log("shuffle hand 1")
            shuffleAndDecrypt({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players[1].seedKey}).then(async () => {
              await new Promise(resolve => setTimeout(resolve, 4000));
              setStreamText("Player 2 Shuffle Success.");
              console.log("shuffle hand 2")
              shuffleAndDecrypt({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players[2].seedKey}).then(async () => {
                await new Promise(resolve => setTimeout(resolve, 4000));
                setStreamText("Player 3 Shuffle Success.");
                // FindPlayerCard()
                console.log("shuffle hand 3")
                setGame({...game, shuffled: true});
              });
            });
          
          })  
          
        }}>Shuffle and Decrypt</Button>
      }

=======
      </div>
>>>>>>> demo
    </div>

    {
      game?.started && game?.shuffled &&

      <div className="flex flex-row items-center gap-4 my-6">

        { <Button onClick={() => {

          revealFlop({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!, playerSeedKey: players[0].seedKey}).then(async () => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            setStreamText("Player 1 Reveal Flop Success.");
            console.log("reveal flop 1")
            revealFlop({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!, playerSeedKey: players[1].seedKey}).then(async () => {
              await new Promise(resolve => setTimeout(resolve, 3000));
              setStreamText("Player 2 Reveal Flop Success.");
              console.log("reveal flop 2")
              revealFlop({suiClient, cardTableId: currentTable, playerKey: process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!, playerSeedKey: players[2].seedKey}).then(async () => {
                await new Promise(resolve => setTimeout(resolve, 3000));
                setStreamText("Player 3 Reveal Flop Success.");
                console.log("reveal flop 3")

                showFlop({suiClient, cardTableId: currentTable}).then(async (flopCard) => {

                  console.log("flopCard", flopCard);
                  setGame({...game, shuffled: true, flopRevealed: true, flopCard: flopCard});




                });
              });
            });
          })  

        }}>
          Show Flop
        </Button>
        }

        <Button>
          Show Turn
        </Button>

        <Button>
          Show River
        </Button>
      
      </div>
    }

    
    
    <CustomTerminal streamText={streamText} />
  </div>
  );
}
