import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import CategoryTag, { categoryColor } from "../components/Categorytag.jsx";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingStats(false));

    api
      .get("/recent-notes")
      .then((res) => setRecentNotes(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingNotes(false));
  }, []);

  const totalNotes = stats.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <PageHeader title="Dashboard" description="A quick look at what you've saved." />

      <Card className="mb-6">
        <p className="text-sm text-ink/55 mb-1">Total notes</p>
        {loadingStats ? (
          <Spinner size={20} className="text-ink/40" />
        ) : (
          <p className="font-mono text-4xl font-medium text-ink">{totalNotes}</p>
        )}
      </Card>

      {loadingStats ? (
        <div className="flex items-center gap-2 text-ink/50 text-sm py-6 justify-center">
          <Spinner size={16} />
          Loading subjects...
        </div>
      ) : stats.length === 0 ? (
        <EmptyState icon="📊" title="No notes yet" description="Stats will show up once you've saved something." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((item) => (
            <Card key={item.category} accent={categoryColor(item.category)}>
              <p className="text-sm text-ink/55">{item.category || "Uncategorized"}</p>
              <p className="font-mono text-2xl font-medium text-ink mt-1">{item.count}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="h-px bg-border my-8" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold text-ink">Recent notes</h2>
        <Link to="/notes" className="text-sm text-accent hover:text-accent-dark font-medium">
          View all
        </Link>
      </div>

      {loadingNotes ? (
        <div className="flex items-center gap-2 text-ink/50 text-sm py-6 justify-center">
          <Spinner size={16} />
          Loading notes...
        </div>
      ) : recentNotes.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No recent notes"
          description="Upload your first note to see it here."
        />
      ) : (
        <div className="space-y-3">
          {recentNotes.map((note) => (
            <Card key={note.id} className="flex items-center justify-between">
              <span className="font-medium text-ink text-sm">{note.title}</span>
              <CategoryTag category={note.category} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}