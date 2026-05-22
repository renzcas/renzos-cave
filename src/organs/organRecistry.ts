// --- IMPORT ORGANS ---
import { InfoEngineOrgan } from "../../InfoEngine/organ/InfoEngineOrgan"
import { InfoPhyzxOrgan } from "../../InfoPhyzx/organ/InfoPhyzxOrgan"
import { LLMOrganism } from "../../LLM_Organism/organ/LLMOrganism"

// --- ORGAN REGISTRY ---
export const organRegistry = {
  infoengine: {
    id: "infoengine",
    label: "Symbolic Mind",
    organ: InfoEngineOrgan,
    color: "#66ccff",
    endpoint: "/api/infoengine/pulse",
  },

  infophyzx: {
    id: "infophyzx",
    label: "Body (InfoPhyzx)",
    organ: InfoPhyzxOrgan,
    color: "#33ff99",
    endpoint: "/api/infophyzx/pulse",
  },

  llm_organism: {
    id: "llm_organism",
    label: "Narrative Mind",
    organ: LLMOrganism,
    color: "#ff66cc",
    endpoint: "/api/llm/pulse",
  }
}

