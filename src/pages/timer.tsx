// src/app/timer/page.tsx
"use client";

import { useEffect, useState } from "react";
import "@/app/globals.css";

export default function Timer() {
  const [showIntro, setShowIntro] = useState(true);
  const [timeLeft, setTimeLeft] = useState("24:00:00"); // Default full time
  const [resetKey, setResetKey] = useState("");

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // Animate intro text then show timer
    setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    const startTimer = async () => {
      const response = await fetch("/api/timer", {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to start timer");
        return;
      }
    };

    const updateTimer = async () => {
      const response = await fetch("/api/timer");
      if (response.ok) {
        const data = await response.json();
        setTimeLeft(formatTime(data.timeLeft));
      }
    };

    startTimer();

    // Update timer every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Add keyboard listener for reset sequence
    const handleKeyPress = (e: KeyboardEvent) => {
      setResetKey((prev) => {
        const newKey = prev + e.key;
        // Only keep last 5 characters to avoid memory issues
        return newKey.slice(-5);
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Check for reset sequence
  useEffect(() => {
    const resetTimer = async () => {
      try {
        const res = await fetch("/api/timer", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetKey: "techathon123", // Same as server key
          }),
        });

        if (res.ok) {
          setResetKey("");
          // Force immediate timer update
          const timerRes = await fetch("/api/timer");
          const data = await timerRes.json();
          setTimeLeft(formatTime(data.timeLeft));
        }
      } catch {
        console.error("Failed to reset timer");
      }
    };

    // Check if reset sequence matches (example: pressing 'reset')
    if (resetKey === "reset") {
      resetTimer();
    }
  }, [resetKey]);

  return (
    <div className="container">
      {showIntro ? (
        <div className="introContainer">
          <div className="introText animate-reveal">
            Let the <span className="highlight pulse">games</span> begin
          </div>
        </div>
      ) : (
        <div className="timerContainer fade-in">
          <div className="timerDisplay">
            Time <span className="highlight">Left</span> {timeLeft}
          </div>
        </div>
      )}
    </div>
  );
}
