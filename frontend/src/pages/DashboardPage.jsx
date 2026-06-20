import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  
  const [stats, setStats] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    api.get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
    api.get("/recent-notes")
      .then((res) => setRecentNotes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalNotes = stats.reduce(
    (sum, item) => sum + item.count,
    0
  );

 return (
  <div style={{ padding: "30px" }}>
    <h1>📊 Dashboard</h1>

    <div
      style={{
        border: "2px solid #333",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}
    >
      <h2>Total Notes: {totalNotes}</h2>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px"
      }}
    >
      {stats.map((item) => (
        <div
          key={item.category}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            boxShadow:
              "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <h3>
            {item.category || "Uncategorized"}
          </h3>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold"
            }}
          >
            {item.count}
          </p>
        </div>
      ))}
    </div>
    <hr style={{ margin: "30px 0" }} />

<h2>Recent Notes</h2>

{recentNotes.map((note) => (
  <div
    key={note.id}
    style={{
      border: "1px solid #ddd",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}
  >
    <strong>{note.title}</strong>
    <p>{note.category}</p>
  </div>
))}
  </div>
  
);
}