import React, { useState } from "react"
import InfoEnginePanel from "../panels/InfoEngine"
import InfoPhyzxPanel from "../panels/InfoPhyzx"
import LLMOrganism from "../panels/LLMOrganism"
import "../styles/glow.css"

export default function Cockpit() {
  const [activeTab, setActiveTab] = useState("infoengine")

  return (
    <div className="cockpit-container">
      <div className="cockpit-tabs">
        <button
          className={`tab ${activeTab === "infoengine" ? "active" : ""}`}
          onClick={() => setActiveTab("infoengine")}
        >
          Symbolic Mind
        </button>

        <button
          className={`tab ${activeTab === "infophyzx" ? "active" : ""}`}
          onClick={() => setActiveTab("infophyzx")}
        >
          Body (InfoPhyzx)
        </button>

        <button
          className={`tab ${activeTab === "llm_organism" ? "active" : ""}`}
          onClick={() => setActiveTab("llm_organism")}
        >
          Narrative Mind
        </button>
      </div>

      <div className="cockpit-panel">
        {activeTab === "infoengine" && <InfoEnginePanel />}
        {activeTab === "infophyzx" && <InfoPhyzxPanel />}
        {activeTab === "llm_organism" && <LLMOrganism />}
      </div>
    </div>
  )
}
