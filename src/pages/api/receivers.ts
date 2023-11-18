import type { NextApiRequest, NextApiResponse } from "next";
import json from "@/data/receivers.json";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  res.status(200).json(json);
}
