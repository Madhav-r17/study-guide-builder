import { useState } from "react";

export default function AIStudyGuidePage() {
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>🤖 AI Study Guide Generator</h1>

      <textarea
        rows="12"
        cols="80"
        placeholder="Paste your study material here..."
        value={inputText}
        onChange={(e) =>
          setInputText(e.target.value)
        }
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
    </div>
  );
}