import type { NextApiRequest, NextApiResponse } from "next";
import json from "@/data/regions.json";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  res.status(200).json(json);
}
