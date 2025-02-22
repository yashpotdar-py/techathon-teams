// timer.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Set the target date and time (February 23, 2025, 12:00 PM IST)
    const targetDate = new Date("2025-02-23T12:00:00+05:30");
    const currentTime = Date.now();
    const timeLeft = Math.max(targetDate.getTime() - currentTime, 0);

    return res.status(200).json({ timeLeft });
  } else if (req.method === "GET") {
    // Set the target date and time (February 23, 2025, 12:00 PM IST)
    const targetDate = new Date("2025-02-23T12:00:00+05:30");
    const currentTime = Date.now();
    const timeLeft = Math.max(targetDate.getTime() - currentTime, 0);

    return res.status(200).json({ timeLeft });
  } else if (req.method === "PUT") {
    // Reset logic (if needed)
    return res.status(200).json({ message: "Timer reset successfully" });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
