// timer.tsx
"use client";

import { useEffect, useState } from "react";
import "@/app/globals.css";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateTimer = async () => {
      const response = await fetch("/api/timer");
      if (response.ok) {
        const data = await response.json();
        setTimeLeft(formatTime(data.timeLeft));
      }
    };

    // Update timer every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <div className="timerContainer fade-in">
        <div className="timerDisplay">
          Time Left: <span className="highlight">
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}
