import { useEffect, useState } from "react";
import api from "../services/api";

export default function NotesPage() {
const [notes, setNotes] = useState([]);
const [filter, setFilter] = useState("All");

const [editingId, setEditingId] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [editContent, setEditContent] = useState("");

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

const updateNote = async (id) => {
try {
await api.put(`/notes/${id}`, {
title: editTitle,
content: editContent,
});


  setNotes(
    notes.map((note) =>
      note.id === id
        ? {
            ...note,
            title: editTitle,
            content: editContent,
          }
        : note
    )
  );

  setEditingId(null);
} catch (error) {
  console.error(error);
  alert("Failed to update note");
}


};

const filteredNotes =
filter === "All"
? notes
: notes.filter(
(note) => note.category === filter
);

return (
<div style={{ padding: "20px" }}> <h1>All Notes</h1>


  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="All">All</option>
    <option value="DBMS">DBMS</option>
    <option value="OS">OS</option>
    <option value="DSA">DSA</option>
    <option value="SE">Software Engineering</option>
  </select>

  <br /><br />

  {filteredNotes.map((note) => (
    <div key={note.id}>
      {editingId === note.id ? (
        <>
          <input
            value={editTitle}
            onChange={(e) =>
              setEditTitle(e.target.value)
            }
          />

          <br /><br />

          <textarea
            value={editContent}
            onChange={(e) =>
              setEditContent(e.target.value)
            }
          />

          <br /><br />

          <button
            onClick={() =>
              updateNote(note.id)
            }
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>

          <p>
            <strong>Category:</strong>{" "}
            {note.category}
          </p>

          <p>{note.content}</p>
        </>
      )}

<button
  onClick={() => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }}
  style={{
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: "10px"
  }}
>
  Edit
</button>

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
