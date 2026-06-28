import { useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { CATEGORY_OPTIONS, categoryColor } from "../components/Categorytag.jsx";
import { Search } from "lucide-react";

export default function StudyGuidePage() {
  const [category, setCategory] = useState("DBMS");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateGuide = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/study-guide/${category}`);
      setNotes(res.data);
      setHasGenerated(true);
    } catch (error) {
      console.error(error);
      alert("Couldn't load the study guide. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PageHeader title={`${category} study guide`} description="Generate a guide, then search within it.">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Button onClick={generateGuide} disabled={loading}>
          {loading && <Spinner size={14} />}
          {loading ? "Generating..." : "Generate guide"}
        </Button>
      </PageHeader>

      {hasGenerated && notes.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={16} />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      )}

      {!hasGenerated && !loading && (
        <EmptyState
          icon="📚"
          title="No guide generated yet"
          description={`Pick a subject and generate a guide to see ${category} topics here.`}
        />
      )}

      {hasGenerated && filteredNotes.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No matching topics"
          description="Try a different search term."
        />
      )}

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} accent={categoryColor(category)}>
            <h2 className="font-serif text-lg font-semibold text-ink">{note.title}</h2>
            <div className="h-px bg-border my-3" />
            <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}