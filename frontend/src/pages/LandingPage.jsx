
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Interactive Study Guide Builder</h1>

      <p>Upload notes and create interactive study guides.</p>

      <Link to="/dashboard">Get Started</Link>
    </div>
  );
}