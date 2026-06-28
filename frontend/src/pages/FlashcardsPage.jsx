import { useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import { CATEGORY_OPTIONS } from "../components/Categorytag.jsx";

export default function FlashcardsPage() {
  const [category, setCategory] = useState("DBMS");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateFlashcards = async () => {
    setLoading(true);
    setFlipped(null);
    try {
      const res = await api.get(`/study-guide/${category}`);
      setFlashcards(res.data);
      setHasGenerated(true);
    } catch (error) {
      console.error(error);
      alert("Couldn't load flashcards. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PageHeader title="Flashcards" description="Generate a set, then click a card to flip it.">
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
        <Button onClick={generateFlashcards} disabled={loading}>
          {loading && <Spinner size={14} />}
          {loading ? "Generating..." : "Generate flashcards"}
        </Button>
      </PageHeader>

      {!hasGenerated && !loading && (
        <EmptyState
          icon="🗂️"
          title="No flashcards yet"
          description={`Pick a subject and generate a set to start quizzing yourself on ${category}.`}
        />
      )}

      {hasGenerated && flashcards.length === 0 && (
        <EmptyState
          icon="🗂️"
          title="Nothing here yet"
          description={`There's no ${category} material to turn into flashcards. Try uploading some notes first.`}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {flashcards.map((card) => {
          const isFlipped = flipped === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setFlipped(isFlipped ? null : card.id)}
              className="text-left [perspective:1000px] h-44"
              aria-label={isFlipped ? "Show question" : "Show answer"}
            >
              <div
                className={`relative w-full h-full flip-card-inner ${isFlipped ? "flipped" : ""}`}
              >
                {/* Front: Question */}
                <div className="flip-card-face absolute inset-0 bg-white rounded-xl border border-border shadow-card p-5 flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider text-accent/70 uppercase mb-2">
                    Question
                  </span>
                  <p className="font-serif text-ink font-medium leading-snug overflow-y-auto">
                    {card.title}
                  </p>
                  <span className="text-ink/35 text-xs mt-auto pt-2">Click to flip</span>
                </div>

                {/* Back: Answer */}
                <div className="flip-card-face back absolute inset-0 bg-accent rounded-xl shadow-card p-5 flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider text-white/70 uppercase mb-2">
                    Answer
                  </span>
                  <p className="text-white text-sm leading-relaxed overflow-y-auto">
                    {card.content}
                  </p>
                  <span className="text-white/50 text-xs mt-auto pt-2">Click to flip back</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}