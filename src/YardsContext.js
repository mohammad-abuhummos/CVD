import React, { createContext, useContext, useState, useEffect } from "react";

const YardsContext = createContext();

export function YardsProvider({ children }) {
  const [yards, setYards] = useState(() => {
    const saved = localStorage.getItem("yards");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("yards", JSON.stringify(yards));
  }, [yards]);

  return (
    <YardsContext.Provider value={{ yards, setYards }}>
      {children}
    </YardsContext.Provider>
  );
}

export function useYards() {
  return useContext(YardsContext);
}
