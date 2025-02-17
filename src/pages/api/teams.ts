import { NextApiRequest, NextApiResponse } from "next";
import { readTeams, writeTeams } from "@/utils/jsonDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const teams = await readTeams();
      res.status(200).json(teams);
    } catch {
      res.status(500).json({ error: "Failed to read teams" });
    }
  } else if (req.method === "POST") {
    try {
      const teams = req.body;
      await writeTeams(teams);
      res.status(200).json({ message: "Teams updated successfully" });
    } catch {
      res.status(500).json({ error: "Failed to write teams" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}