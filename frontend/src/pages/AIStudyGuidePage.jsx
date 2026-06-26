import { useState } from "react";

export default function AIStudyGuidePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DBMS");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const generateGuide = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-guide",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
          }),
        }
      );

      const data = await response.json();
      setOutputText(data.guide);
    } catch (error) {
      console.error(error);
      alert("Failed to generate guide");
    }
  };

  const saveGuide = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content: outputText,
            category,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      // Clear the form after saving
      setTitle("");
      setCategory("DBMS");
      setInputText("");
      setOutputText("");

    } catch (error) {
      console.error(error);
      alert("Failed to save study guide");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🤖 AI Study Guide Generator</h1>

      <input
        type="text"
        placeholder="Study Guide Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="DBMS">DBMS</option>
        <option value="OS">OS</option>
        <option value="DSA">DSA</option>
        <option value="SE">Software Engineering</option>
      </select>

      <br /><br />

      <textarea
        rows="12"
        cols="80"
        placeholder="Paste your study material here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <br /><br />

      <button onClick={generateGuide}>
        Generate Study Guide
      </button>

      <br /><br />

      <textarea
        rows="12"
        cols="80"
        value={outputText}
        readOnly
        placeholder="Generated study guide will appear here..."
      />

      <br /><br />

      <button
        onClick={saveGuide}
        disabled={!outputText}
      >
        💾 Save Study Guide
      </button>
    </div>
  );
}