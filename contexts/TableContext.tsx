import { createContext, useContext, useEffect, useState } from "react";

interface TableContextProps {
  currentTable: any;
  setCurrentTable: (table: any) => void;
}

export const TableContext = createContext<TableContextProps>({
  currentTable: null,
  setCurrentTable: () => {},
});

export const TableProvider = ({ children }) => {
  const [currentTable, setCurrentTable] = useState(() => {
    return sessionStorage.getItem('currentTable') || null;
  });

  useEffect(() => {
    sessionStorage.setItem('currentTable', currentTable);
  }, [currentTable]);

  return (
    <TableContext.Provider value={{ currentTable, setCurrentTable }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  return context;
};
