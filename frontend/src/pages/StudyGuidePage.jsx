import { useState } from "react";
import api from "../services/api";

export default function StudyGuidePage() {
  const [category, setCategory] = useState("DBMS");
  const [notes, setNotes] = useState([]);

  const generateGuide = async () => {
    try {
      const res = await api.get(
        `/study-guide/${category}`
      );

      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Study Guide Generator</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="DBMS">DBMS</option>
        <option value="OS">OS</option>
        <option value="DSA">DSA</option>
        <option value="SE">Software Engineering</option>
      </select>

      <button
        onClick={generateGuide}
        style={{ marginLeft: "10px" }}
      >
        Generate Guide
      </button>

      <hr />

      {notes.map((note) => (
        <details key={note.id}>
          <summary>
            {note.title}
          </summary>

          <p>{note.content}</p>
        </details>
      ))}
    </div>
  );
}