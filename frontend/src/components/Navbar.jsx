import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "15px",
        borderBottom: "1px solid #444",
        display: "flex",
        gap: "20px",
        justifyContent: "center"
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/notes">Notes</Link>
      <Link to="/study-guide">Study Guide</Link>
      <Link to="/flashcards">Flashcards</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}