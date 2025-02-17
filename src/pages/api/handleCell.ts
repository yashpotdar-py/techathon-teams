import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/connectDb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectToDatabase();
  const collection = db.collection("team-grid");

  if (req.method === "GET") {
    const { teamNumber } = req.query;
    if (typeof teamNumber === "string") {
      const team = await collection.findOne({ teamNumber: parseInt(teamNumber, 10) });
      if (team) {
        res.status(200).json({ success: true, team });
      } else {
        res.status(404).json({ success: false, message: "Team not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid team number" });
    }
  } else if (req.method === "POST") {
    const { teamNumber, teamName, problemStatement, teamState } = req.body;
    if (
      typeof teamNumber === "number" &&
      teamNumber >= 1 &&
      teamNumber <= 320 &&
      typeof teamName === "string" &&
      typeof problemStatement === "string" &&
      (teamState === "active" || teamState === "inactive")
    ) {
      const existingTeam = await collection.findOne({ teamNumber });
      if (!existingTeam) {
        await collection.insertOne({
          teamNumber,
          teamName,
          problemStatement,
          teamState,
        });
      } else {
        await collection.updateOne(
          { teamNumber },
          {
            $set: {
              teamName,
              problemStatement,
              teamState,
            },
          }
        );
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid data" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
