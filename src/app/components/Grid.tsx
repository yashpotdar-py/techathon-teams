"use client";

import { useState, useEffect } from "react";
import Cell from "./Cell";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

const Grid = () => {
  const [teams, setTeams] = useState<Team[]>([]);

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
    const intervalId = setInterval(fetchTeams, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const toggleTeamState = (teamNumber: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.teamNumber === teamNumber
          ? {
              ...team,
              teamState: team.teamState === "active" ? "inactive" : "active",
            }
          : team
      )
    );
  };

  const activeTeams = teams.filter((team) => team.teamState === "active");
  const gridSize = Math.ceil(Math.sqrt(activeTeams.length)); // Calculate grid size
  const cellSize = Math.max(50, 500 / gridSize); // Adjust cell size based on the grid size

  // Function to generate spiral positions
  const generateSpiralPositions = (n: number) => {
    const positions = Array.from({ length: n }, (_, i) => [0, 0]);
    let x = 0, y = 0, dx = 0, dy = -1;
    for (let i = 0; i < n; i++) {
      if (-gridSize / 2 < x && x <= gridSize / 2 && -gridSize / 2 < y && y <= gridSize / 2) {
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
    <div
      className="grid-container"
      style={{
        "--cell-size": `${cellSize}px`,
        "--grid-size": gridSize,
      } as React.CSSProperties}
    >
      {activeTeams.map((team, index) => (
        <Cell
          key={team.teamNumber}
          team={team}
          toggleTeamState={toggleTeamState}
          style={{
            gridRowStart: spiralPositions[index][1] + Math.ceil(gridSize / 2),
            gridColumnStart: spiralPositions[index][0] + Math.ceil(gridSize / 2),
          }}
        />
      ))}
    </div>
  );
};

export default Grid;
