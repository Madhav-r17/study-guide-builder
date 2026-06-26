import { useState } from "react";

export default function AIStudyGuidePage() {
 pdf-docx-upload-download
  const [file, setFile] = useState(null);
  const [outputType, setOutputType] = useState("pdf");
  const [loading, setLoading] = useState(false);

  const generateGuideFile = async () => {
    if (!file) {
      alert("Please select a PDF or DOCX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputType", outputType);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DBMS");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
 main

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/generate-guide-file",
        {
          method: "POST",
          body: formData,
        }
      );

pdf-docx-upload-download
      if (!response.ok) {
        alert("Failed to generate file");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        outputType === "docx"
          ? "study-guide.docx"
          : "study-guide.pdf";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
=======
      const data = await response.json();
      setOutputText(data.guide);
main
    } catch (error) {
      console.error(error);
      alert("Error generating file");
    } finally {
      setLoading(false);
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
      <h1>AI Study Guide File Generator</h1>

      <p>Upload a PDF or DOCX file and download the generated study guide.</p>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
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

      <select
        value={outputType}
        onChange={(e) => setOutputType(e.target.value)}
      >
        <option value="pdf">Download as PDF</option>
        <option value="docx">Download as DOCX</option>
      </select>

      <br /><br />

      <button onClick={generateGuideFile} disabled={loading}>
        {loading ? "Generating..." : "Generate Study Guide File"}
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