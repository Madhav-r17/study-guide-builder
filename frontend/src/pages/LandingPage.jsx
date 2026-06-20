import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px"
      }}
    >
      <h1>📚 Study Guide Builder</h1>

      <p>
        Organize notes, generate study guides,
        and learn with flashcards.
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap"
        }}
      >
        <Link to="/upload">
          <button>Upload Notes</button>
        </Link>

        <Link to="/notes">
          <button>View Notes</button>
        </Link>

        <Link to="/study-guide">
          <button>Study Guide</button>
        </Link>

        <Link to="/flashcards">
          <button>Flashcards</button>
        </Link>

        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
      </div>
    </div>
  );
}