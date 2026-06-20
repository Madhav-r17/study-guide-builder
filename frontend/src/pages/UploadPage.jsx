import { useState } from "react";
import api from "../services/api";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const saveNote = async () => {
    try {
      const response = await api.post("/notes", {
        title,
        content,
        category,
      });

      alert(response.data.message);

      setTitle("");
      setContent("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Failed to save note");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Notes</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="DBMS">DBMS</option>
        <option value="OS">OS</option>
        <option value="DSA">DSA</option>
        <option value="SE">Software Engineering</option>
      </select>

      <br /><br />

      <textarea
        rows="8"
        cols="50"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={saveNote}>
        Save Note
      </button>
    </div>
  );
}