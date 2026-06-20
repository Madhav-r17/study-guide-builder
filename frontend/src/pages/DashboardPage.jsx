import { useEffect } from "react";
import api from "../services/api";

export default function DashboardPage() {
  useEffect(() => {
    api.get("/health")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>Dashboard</h1>;
}