import { useState } from "react";
import "@/app/globals.css";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

const TeamStatus = () => {
  const [teamNumber, setTeamNumber] = useState<number | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindTeam = async () => {
    if (teamNumber === null) {
      setError("Please enter a team number.");
      return;
    }

    try {
      const response = await fetch("/api/handleCell");
      const data = await response.json();
      const foundTeam = data.activeTeams.find((t: Team) => t.teamNumber === teamNumber);
      if (!foundTeam) {
        throw new Error("Please check in with the registration desk first.");
      }
      setTeam(foundTeam);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setTeam(null);
    }
  };

  return (
    <div className="container" style={{marginTop: "20rem"}}>
      <h1>Team Status</h1>
      <div className="input-group">
        <label>
          Team Number:
          <input
            type="number"
            value={teamNumber ?? ""}
            onChange={(e) => setTeamNumber(Number(e.target.value))}
            className="input-field"
          />
        </label>
        <button onClick={handleFindTeam} className="find-button">Find Team</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {team && (
        <div className="team-details">
          <h2>Team Details</h2>
          <div className="detail-item">
            <label>Team Number:</label>
            <input type="number" value={team.teamNumber} readOnly className="detail-input" />
          </div>
          <div className="detail-item">
            <label>Team Name:</label>
            <input type="text" value={team.teamName} readOnly className="detail-input" />
          </div>
          <div className="detail-item">
            <label>Problem Statement:</label>
            <input type="text" value={team.problemStatement} readOnly className="detail-input" />
          </div>
          <div className="detail-item">
            <label>Team State:</label>
            <input type="text" value={team.teamState} readOnly className="detail-input" />
          </div>
          {team.teamState === "active" ? (
            <p className="status-message active">Welcome to Techathon 2.0!</p>
          ) : (
            <p className="status-message inactive">Please check in with the registration desk.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamStatus;