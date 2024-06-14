import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Define the initial state
const initialState = { selectedRange: "today" };

// Create the context
 export const  MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [ranges, setRanges] = useState(initialState);

  return (
    <MyContext.Provider value={{ ranges,setRanges}}>
      {children}
    </MyContext.Provider>
  );
};

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MyProvider>
      <App />
    </MyProvider>
  </BrowserRouter>
);
