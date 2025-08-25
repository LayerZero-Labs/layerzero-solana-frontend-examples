"use client";
import { useState, useEffect } from "react";
import { SolanaConnect } from "../components/SolanaConnect";
import SolanaToEvmCard from "@/components/SolanaToEvmCard";


export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts (client-side)
    document.title = "LayerZero Frontend Example"; // Set page title
  }, []);

  if (!isClient) return null; // Prevent rendering mismatched content

  return (
    <div className="py-5 px-20">
      <SolanaConnect />
      <SolanaToEvmCard />
    </div>
  );
}
