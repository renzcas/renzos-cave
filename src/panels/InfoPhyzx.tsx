import React from "react"
import { InfoPhyzxOrgan } from "../../InfoPhyzx/organ/InfoPhyzxOrgan"

export function InfoPhyzxPanel({ organ }: { organ: InfoPhyzxOrgan }) {
  const state = organ.getState()

  return (
    <div style={{ padding: 16, color: "#eee", fontFamily: "monospace" }}>
      <h2 style={{ color: "#9cf" }}>InfoPhyzx</h2>
      <div>Energy: {state.energy.toFixed(3)}</div>
      <div>Entropy: {state.entropy.toFixed(3)}</div>
      <div>Updated: {new Date(state.updated).toLocaleTimeString()}</div>
    </div>
  )
}
