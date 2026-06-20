import { useEffect, useState } from "react";
import api from "../services/api";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete note");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Notes</h1>

      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button
            onClick={() => deleteNote(note.id)}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer"
            }}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}