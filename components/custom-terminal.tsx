"use client";
import ReactTerminal from 'react-terminal-component';
import {
  EmulatorState, OutputFactory, CommandMapping,
  EnvironmentVariables, FileSystem, History,
  Outputs, defaultCommandMapping
} from 'javascript-terminal';
import { use, useContext, useState, useEffect } from 'react';
import { useTable } from '@/contexts/TableContext';
import { Button } from './ui/button';

export const CustomTerminal = ({streamText}) => {

  const {currentTable} = useTable();

  const defaultState = EmulatorState.createEmpty();
  const defaultOutputs = defaultState.getOutputs();

  const newOutputs = Outputs.addRecord(
    defaultOutputs, OutputFactory.makeTextOutput('Welcome to Homeless Holdem! Interact with the game using the terminal below.')
  );
  const emulatorState = defaultState.setOutputs(newOutputs);

  const [terminalState, setTerminalState] = useState(emulatorState);
  const [autoTypeText, setAutoTypeText] = useState(''); // state to hold the auto type text

  // function to simulate typing
  const simulateTyping = (text: string, delay = 50) => {
    setAutoTypeText(''); // clear the text within the emulator
    text += ' '
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setAutoTypeText((prevText) => prevText + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, delay);
  };

  // simulate typing on component mount
  useEffect(() => {
    simulateTyping(streamText);
  }, [streamText]);

  
    return (
        <div className="bottom-0 w-full h-[220px]">
        {/* <div className="flex flex-row gap-2 items-center bg-white p-2 rounded-t-lg">
          <div className="text-lg">Actions: </div>
          {
            !currentTable &&  <>
              <Button>find tables</Button>
              <Button>create table</Button>
            </>
          }
      
        </div> */}
      <ReactTerminal
        emulatorState={emulatorState}
        inputStr={autoTypeText} // use the auto type text as input
        onInputChange={(inputStr: string) => console.log('inputStr', inputStr)}
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
    )
}