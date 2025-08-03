// App.jsx
import "./config/connection";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LearnBlockProvider, useLearnBlock } from "@/context/LearnBlockContext";
import Content from "./pages/Content"; // Root route component
import Admin from "./pages/Admin"; // Use Admin from components, not ./pages/Admin
import "./App.css";

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isTrustee, isConnected, isUserRegistered } = useLearnBlock();

  if (!isConnected || !isUserRegistered || !isTrustee) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <LearnBlockProvider>

        <Routes>
          <Route path="/" element={<Content />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
        </Routes>

    </LearnBlockProvider>
  );
}

export default App;