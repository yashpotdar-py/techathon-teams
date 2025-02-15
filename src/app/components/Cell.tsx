"use client";

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}

interface CellProps {
  team: Team;
  toggleTeamState: (teamNumber: number) => void;
  style?: React.CSSProperties;
}

const Cell = ({ team, toggleTeamState, style }: CellProps) => {
  const formatNumber = (num: number) => {
    return `#${num.toString().padStart(3, "0")}`;
  };

  return (
    <div
      className={`cell ${team.teamState}`}
      style={style}
      onClick={() => toggleTeamState(team.teamNumber)}
    >
      <div className="team-number">{formatNumber(team.teamNumber)}</div>
      <div className="team-name">{team.teamName}</div>
      <div className="problem-statement">{team.problemStatement}</div>
    </div>
  );
};

export default Cell;
