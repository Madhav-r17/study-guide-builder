import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { CATEGORY_OPTIONS } from "../components/Categorytag.jsx";
import { Sparkles, Upload, FileDown } from "lucide-react";

export default function AIStudyGuidePage() {
  const [file, setFile] = useState(null);
  const [outputType, setOutputType] = useState("pdf");
  const [loadingText, setLoadingText] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DBMS");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);

  const generateGuide = async () => {
    if (!inputText.trim()) {
      alert("Paste some study material first.");
      return;
    }

    setLoadingText(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, category }),
      });

      if (!response.ok) {
        alert("Couldn't generate the guide. Try again.");
        return;
      }

      const data = await response.json();
      setOutputText(data.guide);
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating the guide.");
    } finally {
      setLoadingText(false);
    }
  };

  const generateGuideFile = async () => {
    if (!file) {
      alert("Choose a PDF or DOCX file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("outputType", outputType);

    setLoadingFile(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-guide-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Couldn't generate the file. Try again.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputType === "docx" ? "study-guide.docx" : "study-guide.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating the file.");
    } finally {
      setLoadingFile(false);
    }
  };

  const saveGuide = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: outputText, category }),
      });

      const data = await response.json();
      setSaveStatus({ type: "success", message: data.message || "Saved." });
      setTitle("");
      setCategory("DBMS");
      setInputText("");
      setOutputText("");
    } catch (error) {
      console.error(error);
      setSaveStatus({ type: "error", message: "Couldn't save this guide. Try again." });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <PageHeader
        title="AI study guide"
        description="Paste material to generate a guide, or upload a file to download one directly."
      />

      {/* Generate from pasted text */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-accent" />
          <h2 className="font-serif font-semibold text-ink">Generate from text</h2>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Study guide title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setCategory(opt)}
                className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                  category === opt
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-ink/70 border-border hover:border-accent/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <textarea
            rows={6}
            placeholder="Paste your study material here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
          />

          <div className="flex justify-end">
            <Button onClick={generateGuide} disabled={loadingText}>
              {loadingText && <Spinner size={14} />}
              {loadingText ? "Generating..." : "Generate guide"}
            </Button>
          </div>

          {outputText && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm font-medium text-ink/70 mb-1.5">Generated guide</p>
                <textarea
                  rows={8}
                  value={outputText}
                  readOnly
                  className="w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm leading-relaxed resize-none"
                />
              </div>

              {saveStatus && (
                <p className={`text-sm ${saveStatus.type === "error" ? "text-warn" : "text-cat-os"}`}>
                  {saveStatus.message}
                </p>
              )}

              <div className="flex justify-end">
                <Button onClick={saveGuide} disabled={!outputText}>
                  Save study guide
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Generate from file */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Upload size={16} className="text-accent" />
          <h2 className="font-serif font-semibold text-ink">Generate from a file</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border px-4 py-6 text-sm text-ink/60 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-colors">
            <Upload size={16} />
            {file ? file.name : "Choose a PDF or DOCX file"}
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-3">
            <select
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            >
              <option value="pdf">Download as PDF</option>
              <option value="docx">Download as DOCX</option>
            </select>

            <Button onClick={generateGuideFile} disabled={loadingFile} className="ml-auto">
              {loadingFile ? <Spinner size={14} /> : <FileDown size={14} />}
              {loadingFile ? "Generating..." : "Generate file"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}