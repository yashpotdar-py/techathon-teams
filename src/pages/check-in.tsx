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

  const findTeam = async () => {
    if (teamNumber !== null) {
      try {
        const response = await fetch(`/api/handleCell?teamNumber=${teamNumber}`);
        const data = await response.json();
        if (data.success) {
          setTeam(data.team);
        } else {
          alert("Team not found");
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      }
    }
  };

  const updateTeamState = async (newState: "active" | "inactive") => {
    if (team) {
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
            teamState: newState,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert(`Team ${newState === "active" ? "activated" : "deactivated"} successfully`);
          setTeam({ ...team, teamState: newState });
        } else {
          alert(`Failed to ${newState === "active" ? "activate" : "deactivate"} team`);
        }
      } catch (error) {
        console.error(`Failed to ${newState === "active" ? "activate" : "deactivate"} team:`, error);
      }
    }
  };

  return (
    <div>
        <div className="heading-container">
      <h1 className="heading">Check-In Team</h1>
        </div>
      <div>
        <label>
          Team Number:
          <input
            type="number"
            value={teamNumber ?? ""}
            onChange={(e) => setTeamNumber(Number(e.target.value))}
          />
        </label>
        <button onClick={findTeam}>Find Team</button>
      </div>
      {team && (
        <div>
          <h2>Team Details</h2>
          <form>
            <div>
              <label>
                Team Number:
                <input type="text" value={team.teamNumber} readOnly />
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
            <button type="button" onClick={() => updateTeamState("active")}>
              Activate Team
            </button>
            <button type="button" onClick={() => updateTeamState("inactive")}>
              Deactivate Team
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckIn;