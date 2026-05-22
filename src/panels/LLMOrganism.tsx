// src/panels/LLMOrganism.tsx
import React, { useState } from "react"

export default function LLMOrganism() {
  const [output, setOutput] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function pulse() {
    setLoading(true)
    try {
      const res = await fetch("/api/llm/pulse")
      const data = await res.json()
      setOutput(JSON.stringify(data, null, 2))
    } catch (e) {
      setOutput("Error pulsing LLM_Organism")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel organ-panel organ-llm">
      <div className="panel-header">
        <h2>Narrative Mind (LLM_Organism)</h2>
        <button onClick={pulse} disabled={loading}>
          {loading ? "Pulsing..." : "Pulse"}
        </button>
      </div>
      <pre className="panel-output">{output}</pre>
    </div>
  )
}
