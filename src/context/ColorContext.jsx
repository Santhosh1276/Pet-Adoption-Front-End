/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react";

// Create Context
const ColorContext = createContext();

// Context Provider Component
export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    primary: "#3498db",  
    secondary: "#F1F8E9", 
    tertiary: "#2E7D32",  
  });

  return (
    <ColorContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorContext.Provider>
  );
};

// Custom Hook to use Color Context
export const useColor = () => useContext(ColorContext);
