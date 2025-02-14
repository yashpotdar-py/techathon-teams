import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/utils/connectDb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await connectToDatabase();
  const collection = db.collection("team-grid");

  if (req.method === "POST") {
    const { teamNumber, teamName, problemStatement } = req.body;
    if (
      typeof teamNumber === "number" &&
      teamNumber >= 1 &&
      teamNumber <= 320 &&
      typeof teamName === "string" &&
      typeof problemStatement === "string"
    ) {
      const existingTeam = await collection.findOne({ teamNumber });
      if (!existingTeam) {
        await collection.insertOne({
          teamNumber,
          teamName,
          problemStatement,
          teamState: "active",
        });
      } else {
        await collection.updateOne(
          { teamNumber },
          {
            $set: {
              teamName,
              problemStatement,
              teamState: "active",
            },
          }
        );
      }
      const activeTeams = await collection
        .find({ teamState: "active" })
        .toArray();
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
      await collection.updateOne(
        { teamNumber },
        { $set: { teamState: "inactive" } }
      );
      const activeTeams = await collection
        .find({ teamState: "active" })
        .toArray();
      res.status(200).json({ success: true, activeTeams });
    } else {
      res.status(400).json({ success: false, message: "Invalid team number" });
    }
  } else if (req.method === "GET") {
    const activeTeams = await collection
      .find({ teamState: "active" })
      .toArray();
    res.status(200).json({ activeTeams });
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
