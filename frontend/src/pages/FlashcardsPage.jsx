import { useState } from "react";
import api from "../services/api";

export default function FlashcardsPage() {
  const [category, setCategory] = useState("DBMS");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState(null);

  const generateFlashcards = async () => {
    try {
      const res = await api.get(
        `/study-guide/${category}`
      );

      setFlashcards(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Flashcards</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="DBMS">DBMS</option>
        <option value="OS">OS</option>
        <option value="DSA">DSA</option>
        <option value="SE">Software Engineering</option>
      </select>

      <button
        onClick={generateFlashcards}
        style={{ marginLeft: "10px" }}
      >
        Generate Flashcards
      </button>

      <hr />

      {flashcards.map((card) => (
        <div
          key={card.id}
          onClick={() =>
            setFlipped(
              flipped === card.id
                ? null
                : card.id
            )
          }
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            cursor: "pointer"
          }}
        >
          {flipped === card.id ? (
            <>
              <h3>Answer</h3>
              <p>{card.content}</p>
            </>
          ) : (
            <>
              <h3>Question</h3>
              <p>{card.title}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}