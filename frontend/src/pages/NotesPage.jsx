import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import CategoryTag, { categoryColor } from "../components/CategoryTag.jsx";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

const FILTERS = ["All", "DBMS", "OS", "DSA", "SE"];

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    api
      .get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const deleteNote = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
      alert("Couldn't delete this note. Try again.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const updateNote = async (id) => {
    setSavingEdit(true);
    try {
      await api.put(`/notes/${id}`, { title: editTitle, content: editContent });
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, title: editTitle, content: editContent } : note
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Couldn't save your changes. Try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredNotes =
    filter === "All" ? notes : notes.filter((note) => note.category === filter);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PageHeader title="All notes" description="Everything you've saved, in one place." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink/70 border-border hover:border-ink/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-ink/50 text-sm py-10 justify-center">
          <Spinner size={16} />
          Loading notes...
        </div>
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon="📭"
          title={filter === "All" ? "No notes yet" : `No ${filter} notes yet`}
          description="Upload some material and it'll show up here."
        />
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} accent={categoryColor(note.category)}>
              {editingId === note.id ? (
                <div className="space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => updateNote(note.id)} disabled={savingEdit}>
                      {savingEdit && <Spinner size={14} />}
                      {savingEdit ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg font-semibold text-ink">{note.title}</h3>
                    <CategoryTag category={note.category} />
                  </div>
                  <p className="text-ink/70 text-sm mt-2.5 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>

                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                    {confirmDeleteId === note.id ? (
                      <>
                        <span className="text-sm text-ink/55 self-center mr-1">Delete this note?</span>
                        <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteNote(note.id)}
                          disabled={deletingId === note.id}
                        >
                          {deletingId === note.id && <Spinner size={14} />}
                          {deletingId === note.id ? "Deleting..." : "Confirm"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingId(note.id);
                            setEditTitle(note.title);
                            setEditContent(note.content);
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => setConfirmDeleteId(note.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}