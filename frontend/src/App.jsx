import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react"; 
import Game from "./pages/Game";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

export default function App() {
  console.log("Clerk Publishable Key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}
