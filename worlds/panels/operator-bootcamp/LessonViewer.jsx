import React from "react";

export default function LessonViewer({ day, lessons }) {
  const lesson = lessons.find(l => l.day === day);

  return (
    <div>
      <h2>Lesson — Day {day}</h2>
      <p>{lesson?.content || "No lesson found."}</p>
    </div>
  );
}
