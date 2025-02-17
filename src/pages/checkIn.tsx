import { useState } from "react";
import "@/app/globals.css";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

const CheckIn = () => {
  const [teamNumber, setTeamNumber] = useState<number | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // added success state

  const handleFindTeam = async () => {
    if (teamNumber === null) {
      setError("Please enter a team number.");
      return;
    }

    try {
      const response = await fetch("/api/teams");
      const teams: Team[] = await response.json();
      const foundTeam = teams.find((t: Team) => t.teamNumber === teamNumber);
      if (!foundTeam) {
        throw new Error("Team not found.");
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

  const handleCheckInTeam = async () => {
    if (team === null) {
      setError("No team selected.");
      return;
    }

    try {
      const response = await fetch("/api/handleCell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamNumber: team.teamNumber,
          teamName: team.teamName,
          problemStatement: team.problemStatement,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setError(null);
        setSuccess("Team checked in successfully!"); // set success message
        setTimeout(() => setSuccess(null), 1000); // clear after 1s
      } else {
        throw new Error(result.message || "Failed to check in team.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container"  style={{marginTop: "20rem"}}>
      <h1>Check In <span className="highlight">Team</span></h1>
      <div>
        <label>
          Team Number:
          <input
            type="number"
            value={teamNumber ?? ""}
            onChange={(e) => setTeamNumber(Number(e.target.value))}
            style={{ backgroundColor: "black" }}
          />
        </label>
        <button onClick={handleFindTeam}>Find Team</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>} {/* render success message */}
      {team && (
        <div className="team-details">
          <h2>Team Details</h2>
          <form>
            <div>
              <label>
                Team Number:
                <input type="number" value={team.teamNumber} readOnly />
              </label>
            </div>
            <div>
              <label>
                Team Name:
                <input type="text" value={team.teamName} readOnly />
              </label>
            </div>
            <div>
              <label>
                Problem Statement:
                <input type="text" value={team.problemStatement} readOnly />
              </label>
            </div>
            <div>
              <label>
                Team State:
                <input type="text" value={team.teamState} readOnly />
              </label>
            </div>
            <button type="button" onClick={handleCheckInTeam}>
              Check In Team
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckIn;