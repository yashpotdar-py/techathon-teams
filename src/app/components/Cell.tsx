"use client";

import { useState, useEffect } from "react";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

const Cell = () => {
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

  return (
    <div className="cell-container">
      {teams.map((team) => (
        <div key={team.teamNumber} className={`cell ${team.teamState}`}>
          <div className="team-name">{team.teamName}</div>
          <div className="team-number">#{team.teamNumber}</div>
          <div className="problem-statement">{team.problemStatement}</div>
        </div>
      ))}
    </div>
  );
};

export default Cell;
