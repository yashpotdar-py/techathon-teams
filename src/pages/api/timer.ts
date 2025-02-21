let globalStartTime: number | null = null;
const RESET_KEY = "techathon123"; // Replace with a long, random string

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    globalStartTime = Date.now();
    return res.status(200).json({ startTime: globalStartTime });
  } else if (req.method === "GET") {
    if (!globalStartTime) {
      return res.status(400).json({ error: "Timer not started" });
    }
    const currentTime = Date.now();
    const elapsedTime = currentTime - globalStartTime;
    const timeLeft = Math.max(24 * 60 * 60 * 1000 - elapsedTime, 0); // 24 hours in ms

    return res.status(200).json({ timeLeft });
  } else if (req.method === "PUT") {
    const { resetKey } = req.body;
    
    // Verify reset key
    if (resetKey !== RESET_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    globalStartTime = Date.now();
    return res.status(200).json({ message: "Timer reset successfully" });
  }
}
