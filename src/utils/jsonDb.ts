import { promises as fs } from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "public", "db", "teams.json");

export async function readTeams() {
  try {
    const data = await fs.readFile(dbFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File not found, return an empty array
      return [];
    }
    throw error;
  }
}

interface Team {
  teamNumber: number;
  teamName: string;
  problemStatement: string;
  teamState: "active" | "inactive";
}
export async function writeTeams(teams: Team[]) {
  await fs.writeFile(dbFilePath, JSON.stringify(teams, null, 2), "utf-8");
}