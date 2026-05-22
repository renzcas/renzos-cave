import React, { useState } from "react";
import LessonViewer from "./LessonViewer";
import LabViewer from "./LabViewer";
import ChallengeViewer from "./ChallengeViewer";
import XPTracker from "./XPTracker";
import SkillTree from "./SkillTree";
import CapstoneTracker from "./CapstoneTracker";
import { useBootcampData } from "./useBootcampData";

export default function OperatorBootcampPanel() {
  const { lessons, labs, challenges, xp, skillTrees } = useBootcampData();
  const [day, setDay] = useState(1);
  const [tab, setTab] = useState("lesson");

  return (
    <div className="bootcamp-panel">
      <aside className="sidebar">
        <h2>Operator Bootcamp</h2>

        <div className="day-selector">
          {[...Array(30)].map((_, i) => (
            <button key={i} onClick={() => setDay(i + 1)}>
              Day {i + 1}
            </button>
          ))}
        </div>

        <div className="tabs">
          <button onClick={() => setTab("lesson")}>Lesson</button>
          <button onClick={() => setTab("lab")}>Lab</button>
          <button onClick={() => setTab("challenge")}>Challenge</button>
          <button onClick={() => setTab("xp")}>XP</button>
          <button onClick={() => setTab("skills")}>Skills</button>
          <button onClick={() => setTab("capstone")}>Capstone</button>
        </div>
      </aside>

      <main className="content">
        {tab === "lesson" && <LessonViewer day={day} lessons={lessons} />}
        {tab === "lab" && <LabViewer day={day} labs={labs} />}
        {tab === "challenge" && (
          <ChallengeViewer day={day} challenges={challenges} />
        )}
        {tab === "xp" && <XPTracker xp={xp} />}
        {tab === "skills" && <SkillTree skillTrees={skillTrees} />}
        {tab === "capstone" && <CapstoneTracker />}
      </main>
    </div>
  );
}
