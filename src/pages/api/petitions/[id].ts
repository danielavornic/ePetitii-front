import type { NextApiRequest, NextApiResponse } from "next";
import json from "@/data/petitions.json";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "GET") {
    const { id } = req.query;

    const product = json.find((p) => p.id === Number(id));

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
