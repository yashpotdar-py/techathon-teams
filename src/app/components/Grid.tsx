"use client";

import { useState, useEffect, useRef } from "react";
import Cell from "./Cell";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

const Grid = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const MIN_CELL_SIZE = 100; // Define the minimum cell size

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

  return (
    <div className="grid-page">
      <div className="counter">
        Active Teams: <span className="highlight">{activeTeams.length}</span>
      </div>
      <div
        className="grid-container"
        style={
          {
            "--cell-size": `${cellSize}px`,
            "--grid-size": gridSize,
          } as React.CSSProperties
        }
      >
        {activeTeams.map((team, index) => (
          <Cell
            key={team.teamNumber}
            team={team}
            toggleTeamState={toggleTeamState}
            style={{
              gridRowStart: spiralPositions[index][1] + Math.ceil(gridSize / 2),
              gridColumnStart:
                spiralPositions[index][0] + Math.ceil(gridSize / 2),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Grid;
