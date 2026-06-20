import { useState } from "react";
import api from "../services/api";

export default function StudyGuidePage() {
  const [category, setCategory] = useState("DBMS");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const generateGuide = async () => {
    try {
      const res = await api.get(`/study-guide/${category}`);
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const filteredNotes = notes.filter((note) =>
  note.title
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto"
      }}
    >
      <h1>📚 {category} Study Guide</h1>

      <div style={{ marginBottom: "20px" }}>
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
      </div>
<input
  type="text"
  placeholder="Search topics..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  style={{
    marginLeft: "10px"
  }}
/>
      {filteredNotes.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px"
          }}
        >
          <h2>📖 {note.title}</h2>
          <hr />
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}