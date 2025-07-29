import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import  { LearnBlockProvider } from "./context/learnBlockContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <LearnBlockProvider>
      <App />
    </LearnBlockProvider>
   
    </BrowserRouter>
  </StrictMode>
);
