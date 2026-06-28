import { useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { CATEGORY_OPTIONS } from "../components/Categorytag.jsx";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const isValid = title.trim() && content.trim() && category;

  const saveNote = async () => {
    if (!isValid) {
      setStatus({ type: "error", message: "Add a title, some content, and pick a subject before saving." });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const response = await api.post("/notes", { title, content, category });
      setStatus({ type: "success", message: response.data.message || "Note saved." });
      setTitle("");
      setContent("");
      setCategory("");
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Couldn't save this note. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <PageHeader
        title="Upload notes"
        description="Add raw material here — you can generate a study guide or flashcards from it later."
      />

      <Card className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="note-title">
            Title
          </label>
          <input
            id="note-title"
            type="text"
            placeholder="e.g. Normalization forms"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1.5">Subject</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setCategory(opt)}
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                  category === opt
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-ink/70 border-border hover:border-accent/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1.5" htmlFor="note-content">
            Content
          </label>
          <textarea
            id="note-content"
            rows={8}
            placeholder="Paste or write your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
          />
        </div>

        {status && (
          <p className={`text-sm ${status.type === "error" ? "text-warn" : "text-cat-os"}`}>
            {status.message}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={saveNote} disabled={saving}>
            {saving && <Spinner size={14} />}
            {saving ? "Saving..." : "Save note"}
          </Button>
        </div>
      </Card>
    </div>
  );
}