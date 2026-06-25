import { useState } from "react";

export default function AIStudyGuidePage() {
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

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/generate-guide-file",
        {
          method: "POST",
          body: formData,
        }
      );

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
    } catch (error) {
      console.error(error);
      alert("Error generating file");
    } finally {
      setLoading(false);
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
      </button>
    </div>
  );
}