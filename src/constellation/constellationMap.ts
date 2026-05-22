export const constellationNodes = [
  {
    id: "infoengine",
    label: "Symbolic Mind",
    x: 0.25,
    y: 0.35,
    color: "#66ccff",
  },
  {
    id: "infophyzx",
    label: "Body (InfoPhyzx)",
    x: 0.45,
    y: 0.65,
    color: "#33ff99",
  },
  {
    id: "llm_organism",
    label: "Narrative Mind",
    x: 0.65,
    y: 0.25,
    color: "#ff66cc",
  },
]

export const constellationEdges = [
  ["infoengine", "llm_organism"],
  ["infophyzx", "infoengine"],
  ["infophyzx", "llm_organism"],
]
