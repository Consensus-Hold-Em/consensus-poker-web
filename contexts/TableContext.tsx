import { createContext, useContext, useEffect, useState } from "react";

interface TableContextProps {
  currentTable: any;
  setCurrentTable: (table: any) => void;
  players: any;
  setPlayers: (players: string[]) => void;
  game: any;
  setGame: (game: any) => void;
}

import { getKeypair } from "@/lib/keypair/getKeyPair";

export const TableContext = createContext<TableContextProps>({
  currentTable: null,
  setCurrentTable: () => {},
  players: [
    { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
    { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
    { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
  ],
  setPlayers: () => {},
  game: null,
  setGame: () => {},
});

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTable, setCurrentTable] = useState(() => {
    return sessionStorage.getItem('currentTable') || null;
  });

  const [players, setPlayers] = useState(() => {
    const storedPlayers = sessionStorage.getItem('players');
    return storedPlayers ? JSON.parse(storedPlayers) : [
        { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER1_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
        { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER2_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
        { publicKey: getKeypair(process.env.NEXT_PUBLIC_PLAYER3_SECRET_KEY!).getPublicKey().toSuiPublicKey() },
    ];
  });

  const [game, setGame] = useState(() => {
    const storedGame = sessionStorage.getItem('game');
    return storedGame ? JSON.parse(storedGame) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('currentTable', currentTable);
  }, [currentTable]);

  useEffect(() => {
    sessionStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    sessionStorage.setItem('game', JSON.stringify(game));
  }, [game]);

  return (
    <TableContext.Provider value={{ currentTable, setCurrentTable, players, setPlayers, game, setGame }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  return context;
};
