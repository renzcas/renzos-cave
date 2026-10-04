import React from "react";

export default function LabViewer({ day, labs }) {
  const lab = labs.find(l => l.day === day);

  return (
    <div>
      <h2>Lab — Day {day}</h2>
      <p>{lab?.lab || "No lab found."}</p>
    </div>
  );
}
