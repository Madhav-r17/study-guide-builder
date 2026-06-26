const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const upload = multer({ dest: "uploads/" });
const app = express();
const { generateStudyGuide,} = require("./services/gemini");
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get("/api/study-guide/:category", (req, res) => {
  const { category } = req.params;

  const sql =
    "SELECT * FROM notes WHERE category = ? ORDER BY created_at DESC";

  db.query(sql, [category], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch study guide"
      });
    }

    res.json(results);
  });
});
app.get("/api/stats", (req, res) => {
  const sql = `
    SELECT category, COUNT(*) as count
    FROM notes
    GROUP BY category
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch stats"
      });
    }

    res.json(results);
  });
});
app.post('/api/notes', (req, res) => {
  const { title, content, category } = req.body;

  const sql =
    'INSERT INTO notes (title, content, category) VALUES (?, ?, ?)';

  db.query(sql, [title, content, category], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: 'Failed to save note'
      });
    }

    res.status(201).json({
      message: 'Note saved successfully',
      id: result.insertId
    });
  });
});
app.get("/api/notes", (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch notes"
      });
    }

    res.json(results);
  });
});
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM notes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to delete note"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  });
});
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const sql =
    "UPDATE notes SET title = ?, content = ? WHERE id = ?";

  db.query(sql, [title, content, id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update note"
      });
    }

    res.json({
      message: "Note updated successfully"
    });
  });
});
app.get("/api/recent-notes", (req, res) => {
  const sql =
    "SELECT * FROM notes ORDER BY created_at DESC LIMIT 5";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch recent notes"
      });
    }

    res.json(results);
  });
});
app.post("/api/generate-guide-file", upload.single("file"), async (req, res) => {
  try {
    let extractedText = "";

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname.toLowerCase();
    const outputType = req.body.outputType || "pdf";

    if (originalName.endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (originalName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "Only PDF and DOCX files are supported",
      });
    }

    fs.unlinkSync(filePath);

    const guide = await generateStudyGuide(extractedText);

    if (outputType === "docx") {
      const doc = new Document({
        sections: [
          {
            children: guide.split("\n").map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun(line),
                  ],
                })
            ),
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=study-guide.docx"
      );

      return res.send(buffer);
    }

    const pdfDoc = new PDFDocument();
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=study-guide.pdf"
      );

      res.send(pdfBuffer);
    });

    pdfDoc.fontSize(18).text("Generated Study Guide", {
      align: "center",
    });

    pdfDoc.moveDown();

    pdfDoc.fontSize(12).text(guide, {
      align: "left",
    });

    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate guide from file",
    });
  }
});
module.exports = app;