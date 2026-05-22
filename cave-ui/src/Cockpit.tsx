import React, { useState, useEffect } from "react";
import "./Cockpit.css";

// XP system
import {
  loadProgress,
  completeLesson,
  awardXP,
} from "./course/xp";

// Course data
import { tracks } from "./course/tracks";

export default function Cockpit() {
  const [progress, setProgress] = useState(loadProgress());
  const [activeTrack, setActiveTrack] = useState("operator_bootcamp");
  const [activeModule, setActiveModule] = useState(0);

  // Handle lesson completion
  function handleCompleteLesson(lessonId: string) {
    const updated = completeLesson(progress, lessonId);
    setProgress(updated);
  }

  // Handle XP awards (labs, challenges)
  function giveXP(amount: number) {
    const updated = awardXP(progress, amount);
    setProgress(updated);
  }

  const track = tracks.find(t => t.id === activeTrack);

  return (
    <div className="cockpit-container">
      {/* HEADER */}
      <header className="cockpit-header">
        <h1>Cave Cockpit</h1>
        <div className="xp-box">
          <span>XP: {progress.xp}</span>
          <span>Level: {progress.level}</span>
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(progress.xp % 500) / 5}%` }}
        />
      </div>

      {/* TRACK SELECTOR */}
      <div className="track-selector">
        {tracks.map(t => (
          <button
            key={t.id}
            className={t.id === activeTrack ? "active" : ""}
            onClick={() => setActiveTrack(t.id)}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* MODULE LIST */}
      <div className="module-list">
        {track?.modules.map((module, index) => (
          <div
            key={index}
            className={`module-card ${index === activeModule ? "active" : ""}`}
            onClick={() => setActiveModule(index)}
          >
            <h3>{module.title}</h3>
            <p>{module.lessons.length} lessons</p>
          </div>
        ))}
      </div>

      {/* LESSON VIEWER */}
      <div className="lesson-viewer">
        <h2>{track?.modules[activeModule].title}</h2>

        {track?.modules[activeModule].lessons.map((lesson, index) => {
          const lessonId = `${activeTrack}-m${activeModule}-l${index}`;
          const completed = progress.completedLessons.includes(lessonId);

          return (
            <div key={index} className="lesson-card">
              <h4>{lesson}</h4>

              <button
                disabled={completed}
                onClick={() => handleCompleteLesson(lessonId)}
              >
                {completed ? "Completed ✓" : "Mark Complete (+50 XP)"}
              </button>
            </div>
          );
        })}
      </div>

      {/* XP ACTION BUTTONS */}
      <div className="xp-actions">
        <button onClick={() => giveXP(75)}>Complete Lab (+75 XP)</button>
        <button onClick={() => giveXP(100)}>Complete Challenge (+100 XP)</button>
      </div>
    </div>
  );
}
