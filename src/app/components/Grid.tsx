"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
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
  const [cellSize, setCellSize] = useState(200); // Initial MIN_CELL_SIZE
  const MIN_CELL_SIZE = 200;
  const router = useRouter();

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
  
  // Calculate cell size based on viewport
  // Handle window resize
  useEffect(() => {
    const calculateCellSize = () => {
      if (typeof window === 'undefined') return MIN_CELL_SIZE;
      
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const minDimension = Math.min(viewportWidth, viewportHeight);
      const maxCells = Math.max(gridSize, 4); // Ensure minimum grid spacing
      return Math.max(
        MIN_CELL_SIZE,
        Math.floor((minDimension * 0.8) / maxCells)
      );
    };

    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [teams.length, gridSize]); // Recalculate when teams change

  const fontSize = cellSize * 0.15;

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

  // Add this function to count teams per domain
  const getTeamCountsByDomain = () => {
    const counts: { [key: string]: number } = {};
    Object.keys(baseColors).forEach(domain => {
      counts[domain] = activeTeams.filter(team => 
        team.problemStatement.startsWith(domain)
      ).length;
    });
    return counts;
  };

  const handleTimerStart = async () => {
    // Reset the timer first with PUT request
    await fetch('/api/timer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        resetKey: 'techathon123'
      })
    });

    // Then start the timer with POST request
    await fetch('/api/timer', {
      method: 'POST'
    });
    
    router.push('/timer');
  };

  return (
    <div className="grid-page" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem' }}>
      {activeTeams.length === 0 ? (
        <div className="no-teams-message">
          <p>No active teams available.</p>
        </div>
      ) : (
        <div
          className="grid-container"
          style={{
            "--cell-size": `${cellSize}px`,
            "--grid-size": gridSize,
            "--font-size": `${fontSize}px`,
          } as React.CSSProperties}
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
      
      <div className="counters" style={{ 
        fontSize: '7rem', 
        padding: '1rem 2rem',
        height: 'fit-content',
        position: 'sticky',
        top: '2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        minWidth: '250px'
      }}>
        <div className="total-counter" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '1rem' }}>
          Total Active Teams: <span className="highlight" style={{color: 'rgb(255, 88, 116)'}}>{activeTeams.length}</span>
        </div>
        <div className="domain-counters" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(getTeamCountsByDomain()).map(([domain, count]) => (
            <div 
              key={domain} 
              className="domain-counter"
              style={{ 
                color: baseColors[domain][0],
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              <span>{domain}:</span> <span className="highlight">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        className="start-timer-btn"
        onClick={handleTimerStart}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 2rem',
          fontSize: '2rem',
          backgroundColor: 'var(--secondary)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        Start Timer
      </button>
    </div>
  );
};

export default Grid;
