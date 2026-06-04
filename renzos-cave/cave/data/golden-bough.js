export const goldenBough = {
  branches: [
    {
      name: "Power",
      nodes: [
        {
          id: "power_1",
          name: "Pulse Strength",
          description: "Increase organ output by 10%",
          requires: [],
          effect: "+10% output"
        },
        {
          id: "power_2",
          name: "Overcharge",
          description: "Double output for 5 seconds",
          requires: ["power_1"],
          effect: "Burst output"
        }
      ]
    },
    {
      name: "Night",
      nodes: [
        {
          id: "night_1",
          name: "Shadow Veil",
          description: "Reduce corruption intake",
          requires: [],
          effect: "-15% corruption"
        }
      ]
    }
  ]
};
