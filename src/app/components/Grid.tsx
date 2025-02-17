"use client";

import { useState, useEffect, useRef } from "react";
import Cell from "./Cell";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

// Define base colors for each prefix
const baseColors: { [key: string]: string[] } = {
  AS: [
    "hsla(180, 100%, 75%, 0.9)",
    "hsla(180, 100%, 70%, 0.9)",
    "hsla(180, 100%, 65%, 0.9)",
    "hsla(180, 100%, 60%, 0.9)",
  ],
  DM: [
    "hsla(153, 100%, 80%, 0.9)",
    "hsla(153, 100%, 75%, 0.9)"
  ],
  EN: [
    "hsla(127, 100%, 75%, 0.9)",
    "hsla(127, 100%, 70%, 0.9)",
    "hsla(127, 100%, 65%, 0.9)",
    "hsla(127, 100%, 60%, 0.9)",
    "hsla(127, 100%, 55%, 0.9)"
  ],
  ET: [
    "hsla(100, 100%, 75%, 0.9)",
    "hsla(100, 100%, 70%, 0.9)",
    "hsla(100, 100%, 65%, 0.9)",
    "hsla(100, 100%, 60%, 0.9)"
  ],
  HC: [
    "hsla(73, 100%, 85%, 0.9)",
    "hsla(73, 100%, 80%, 0.9)",
    "hsla(73, 100%, 75%, 0.9)",
    "hsla(73, 100%, 70%, 0.9)",
    "hsla(73, 100%, 65%, 0.9)"
  ],
  SI: [
    "hsla(47, 100%, 80%, 0.9)"
  ],
  TS: [
    "hsla(20, 100%, 85%, 0.9)",
    "hsla(20, 100%, 80%, 0.9)",
    "hsla(20, 100%, 75%, 0.9)"
  ],
  
};

// Generate problem statement colors based on base colors
const problemStatementColors: { [key: string]: string } = {};
Object.keys(baseColors).forEach((prefix) => {
  baseColors[prefix].forEach((color, index) => {
    problemStatementColors[`${prefix}-${index + 1}`] = color;
  });
});

const Grid = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const MIN_CELL_SIZE = 150; // Define the minimum cell size

  // Load audio files
  const activateSound = useRef<HTMLAudioElement | null>(null);
  const inactivateSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    activateSound.current = new Audio("/public/audio/activate.ogg");
    inactivateSound.current = new Audio("/public/audio/inactivate.ogg");
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/handleCell");
        const data = await response.json();
        setTeams(data.activeTeams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
    const intervalId = setInterval(fetchTeams, 100);

    return () => clearInterval(intervalId);
  }, []);

  const toggleTeamState = (teamNumber: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.teamNumber === teamNumber) {
          const newState = team.teamState === "active" ? "inactive" : "active";
          if (newState === "active") {
            activateSound.current?.play();
          } else {
            inactivateSound.current?.play();
          }
          return {
            ...team,
            teamState: newState,
          };
        }
        return team;
      })
    );
  };

  const activeTeams = teams.filter((team) => team.teamState === "active");
  const gridSize = Math.ceil(Math.sqrt(activeTeams.length));
  const cellSize = Math.max(MIN_CELL_SIZE, 500 / gridSize);
  const fontSize = cellSize * 0.9; // Calculate font size based on cell size

  const generateSpiralPositions = (n: number) => {
    const positions = Array.from({ length: n }, () => [0, 0]);
    let x = 0,
      y = 0,
      dx = 0,
      dy = -1;
    for (let i = 0; i < n; i++) {
      if (
        -gridSize / 2 < x &&
        x <= gridSize / 2 &&
        -gridSize / 2 < y &&
        y <= gridSize / 2
      ) {
        positions[i] = [x, y];
      }
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        [dx, dy] = [-dy, dx];
      }
      x += dx;
      y += dy;
    }
    return positions;
  };

  const spiralPositions = generateSpiralPositions(activeTeams.length);

  useEffect(() => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      (cell as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }, [activeTeams]);

  return (
    <div className="grid-page">
      <div className="counter">
        Active Teams: <span className="highlight">{activeTeams.length}</span>
      </div>
      {activeTeams.length === 0 ? (
        <div className="no-teams-message">
          <p>No active teams available.</p>
          {/* Add any animation or additional content here */}
        </div>
      ) : (
        <div
          className="grid-container"
          style={
            {
              "--cell-size": `${cellSize}px`,
              "--grid-size": gridSize,
              "--font-size": `${fontSize}px`,
            } as React.CSSProperties
          }
        >
          {activeTeams.map((team, index) => (
            <Cell
              key={team.teamNumber}
              team={team}
              toggleTeamState={toggleTeamState}
              style={{
                gridRowStart:
                  spiralPositions[index][1] + Math.ceil(gridSize / 2) + 1,
                gridColumnStart:
                  spiralPositions[index][0] + Math.ceil(gridSize / 2) + 1,
                borderColor: problemStatementColors[team.problemStatement],
                backgroundColor: "#000",
                fontSize: `${fontSize}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
