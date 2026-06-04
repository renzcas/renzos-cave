import React from "react";
export default function XPTracker({ xp }) {
  return (
    <div>
      <h2>XP Tracker</h2>
      <p>Total XP: {xp.xp}</p>
      <p>Rank: {xp.rank}</p>
      <p>Streak: {xp.streak}</p>
    </div>
  );
}
