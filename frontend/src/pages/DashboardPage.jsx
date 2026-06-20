import { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalNotes = stats.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Dashboard</h1>

      <h2>Total Notes: {totalNotes}</h2>

      <hr />

{stats.map((item) => (
  <div
    key={item.category}
    style={{
      border: "1px solid #444",
      padding: "15px",
      margin: "10px",
      borderRadius: "10px"
    }}
  >
    <h3>
      {item.category || "Uncategorized"}: {item.count}
    </h3>
  </div>
))}
    </div>
  );
}