import { Link } from "react-router-dom";
import { BookOpen, Upload, FileText, Layers, LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { to: "/upload", label: "Upload Notes", icon: Upload, desc: "Add new material" },
  { to: "/notes", label: "View Notes", icon: FileText, desc: "Browse everything saved" },
  { to: "/study-guide", label: "Study Guide", icon: BookOpen, desc: "Read by subject" },
  { to: "/flashcards", label: "Flashcards", icon: Layers, desc: "Quiz yourself" },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Track your progress" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl text-center">
        <span className="inline-block font-mono text-xs tracking-wider text-accent uppercase mb-4">
          Built for exam season
        </span>
        <h1 className="font-serif text-5xl font-semibold text-ink tracking-tight leading-tight">
          Turn your notes into
          <br />
          something worth studying
        </h1>
        <p className="text-ink/60 text-lg mt-5 max-w-md mx-auto">
          Upload your material, generate clean study guides, and quiz
          yourself with flashcards — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-14 max-w-3xl w-full">
        {NAV_ITEMS.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-150 p-5 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center mb-3 shadow-sm group-hover:bg-accent-dark transition-colors duration-150">
              <Icon size={19} strokeWidth={2} />
            </div>
            <p className="font-serif font-semibold text-ink">{label}</p>
            <p className="text-ink/55 text-sm mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}