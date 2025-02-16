import { NextApiRequest, NextApiResponse } from "next";
import { readTeams, writeTeams } from "@/utils/jsonDb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { teamNumber, teamName, problemStatement } = req.body;
    if (
      typeof teamNumber === "number" &&
      teamNumber >= 1 &&
      teamNumber <= 320 &&
      typeof teamName === "string" &&
      typeof problemStatement === "string"
    ) {
      const teams = await readTeams();
      type Team = {
        teamNumber: number;
        teamName: string;
        problemStatement: string;
        teamState: string;
      };
      const existingTeamIndex = teams.findIndex(
        (team: Team) => team.teamNumber === teamNumber
      );
      if (existingTeamIndex === -1) {
        teams.push({
          teamNumber,
          teamName,
          problemStatement,
          teamState: "active",
        });
      } else {
        teams[existingTeamIndex] = {
          teamNumber,
          teamName,
          problemStatement,
          teamState: "active",
        };
      }
      await writeTeams(teams);
      const activeTeams = teams.filter(
        (team: Team) => team.teamState === "active"
      );
      res.status(200).json({ success: true, activeTeams });
    } else {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  } else if (req.method === "DELETE") {
    const { teamNumber } = req.body;
    if (
      typeof teamNumber === "number" &&
      teamNumber >= 1 &&
      teamNumber <= 320
    ) {
      const teams = await readTeams();
      type Team = {
        teamNumber: number;
        teamName: string;
        problemStatement: string;
        teamState: string;
      };
      const teamIndex = teams.findIndex(
        (team: Team) => team.teamNumber === teamNumber
      );
      if (teamIndex !== -1) {
        teams[teamIndex].teamState = "inactive";
        await writeTeams(teams);
      }
      const activeTeams = teams.filter(
        (team: Team) => team.teamState === "active"
      );
      res.status(200).json({ success: true, activeTeams });
    } else {
      res.status(400).json({ success: false, message: "Invalid team number" });
    }
  } else if (req.method === "GET") {
    const teams = await readTeams();
    type Team = {
      teamNumber: number;
      teamName: string;
      problemStatement: string;
      teamState: string;
    };
    const activeTeams = teams.filter(
      (team: Team) => team.teamState === "active"
    );
    res.status(200).json({ activeTeams });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
