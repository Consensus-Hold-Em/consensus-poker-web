"use client";
import { User } from "lucide-react";
import Image from "next/image";

import Backdesign from "@/public/assets/cards/backdesign_14.png";
import { Button } from "@/components/ui/button";
import { useZkLogin } from "@mysten/enoki/react";
import { useBalance } from "@/contexts/BalanceContext";
import { SignInBanner } from "@/components/home/SignInBanner";
import { Terminal } from "@/components/terminal";
import ReactTerminal from 'react-terminal-component';
import {
  EmulatorState, OutputFactory, CommandMapping,
  EnvironmentVariables, FileSystem, History,
  Outputs, defaultCommandMapping
} from 'javascript-terminal';
import { useRef, useState } from "react";
export default function Home() {
  const { address } = useZkLogin();
  const { balance, handleRefreshBalance } = useBalance();
  console.log({address, balance, handleRefreshBalance});

  if (!address) {
    return <SignInBanner />;
  }

  
  const { address } = useZkLogin();
  const terminalRef = useRef(null);
  
  console.log("address", address)
  const { balance, handleRefreshBalance } = useBalance();
  console.log({address, balance, handleRefreshBalance});

  if (!address) {
    return <SignInBanner />;
  }

  const defaultState = EmulatorState.createEmpty();
  const defaultOutputs = defaultState.getOutputs();

  const newOutputs = Outputs.addRecord(
    defaultOutputs, OutputFactory.makeTextOutput('Welcome to Homeless Holdem! Interact with the game using the terminal below.')
  );
  const emulatorState = defaultState.setOutputs(newOutputs);

  const [terminalState, setTerminalState] = useState(emulatorState);


  return (
    <div className="h-full flex flex-col justify-evenly items-center">
    <div 
      className="flex flex-col relative w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[2097750] dark:bg-[#6366f1] shadow-lg flex items-center justify-center border-8 border-brown-500 border-opacity-50"
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
            transform: `rotate(${(index * (180/arr.length)) - 160}deg) translate(180px)`,
            transformOrigin: 'center',
          }}
        >
          
          <div className="flex items-center gap-2">
            <User className="h-20 w-20" style={{ transform: `rotate(${(-index * (180/arr.length)) + 160}deg)` }} />
            
            <div className="flex items-center gap-1" style={{ transform: `rotate(${(-index * (180/arr.length)) + 160}deg)` }}>
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
              <Image src={Backdesign} alt="backdesign" className="w-12 h-16"/>
            </div>
          </div>
          
          </div>
      ))}

    </div>
    <div className="bottom-0 w-full h-[220px]">
    {/* <Terminal /> */}
      <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-t-lg">
        <div className="text-lg">Actions: </div>
        <Button>FIND GAME</Button>
        <Button>DEAL</Button>
        <Button>CHECK</Button>
        <Button>CALL</Button>
        <Button>RAISE</Button>
        <Button>FOLD</Button>
        <Button>ALL-IN</Button>
        <Button>HELP</Button>
      </div>
    <ReactTerminal
      emulatorState={emulatorState}
      inputStr={"inputsr"}
      onInputChange={(inputStr: any) => console.log('inputStr', inputStr)}
      onStateChange={setTerminalState}
      autoFocus
      theme={{
        background: '#141313',
        promptSymbolColor: '#6effe6',
        commandColor: '#fcfcfc',
        outputColor: '#fcfcfc',
        errorOutputColor: '#ff89bd',
        fontSize: '1.1rem',
        spacing: '1%',
        fontFamily: 'monospace',
        width: '100%',
        height: '220px'
      }}
    />
    </div>
  </div>
  );
}
