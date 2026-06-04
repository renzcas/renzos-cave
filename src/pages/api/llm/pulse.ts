// src/pages/api/llm/pulse.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await fetch("http://localhost:5004/pulse").then(r => r.json())
    res.status(200).json(result)
  } catch (err) {
    console.error("LLM pulse error:", err)
    res.status(500).json({ error: "LLM_Organism pulse failed" })
  }
}
