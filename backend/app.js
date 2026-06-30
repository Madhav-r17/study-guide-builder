const PDFDocument = require("pdfkit");
const FONT_REGULAR = "./fonts/NotoSans-Regular.ttf";
const FONT_BOLD    = "./fonts/NotoSans-Bold.ttf";
const FONT_PATH = "./fonts/NotoSans-Regular.ttf"; 
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

// ─── PDF Generation ───────────────────────────────────────────────
const FONT_REGULAR = "./fonts/NotoSans-Regular.ttf";
const FONT_BOLD    = "./fonts/NotoSans-Bold.ttf";      // download this too
const PAGE_MARGIN  = 50;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2;        // A4 width

const doc = new PDFDocument({ margin: PAGE_MARGIN, font: FONT_REGULAR });
const chunks = [];

doc.on("data", (chunk) => chunks.push(chunk));
doc.on("end", () => {
  const pdfBuffer = Buffer.concat(chunks);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=study-guide.pdf");
  res.send(pdfBuffer);
});

// ── helper: render a line with inline **bold** spans ──────────────
// Renders a line with **bold** spans by manually positioning each word.
// Avoids pdfkit's continued+font-switch wrapping bug entirely.
function renderInline(doc, text, fontSize, color = "#1a1a1a", startX = null) {
  const x0 = startX !== null ? startX : doc.x;
  const maxWidth = doc.page.width - doc.page.margins.right - x0;
  const lineHeight = fontSize * 1.4;

  // tokenize into {text, bold} words, preserving spaces
  const tokens = [];
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  segments.forEach((seg) => {
    if (!seg) return;
    const isBold = seg.startsWith("**") && seg.endsWith("**");
    const clean = isBold ? seg.slice(2, -2) : seg;
    clean.split(/(\s+)/).forEach((w) => {
      if (w) tokens.push({ text: w, bold: isBold });
    });
  });

  let cx = x0;
  let cy = doc.y;

  tokens.forEach((tok) => {
    doc.font(tok.bold ? FONT_BOLD : FONT_REGULAR).fontSize(fontSize).fillColor(color);
    const w = doc.widthOfString(tok.text);

    // wrap to next line if this word doesn't fit (skip wrap on bare whitespace)
    if (cx + w > x0 + maxWidth && tok.text.trim() !== "") {
      cx = x0;
      cy += lineHeight;
    }

    doc.text(tok.text, cx, cy, { lineBreak: false });
    cx += w;
  });

  doc.x = x0;
  doc.y = cy + lineHeight;
}

// ── markdown renderer ─────────────────────────────────────────────
const lines = guide.split("\n");
let i = 0;

while (i < lines.length) {
  const raw = lines[i];
  const line = raw.trim();

  // blank line → small gap
  if (!line) {
    doc.moveDown(0.3);
    i++;
    continue;
  }

  // H1  #
  if (/^# /.test(line)) {
    doc.moveDown(0.5);
    doc.font(FONT_BOLD).fontSize(20).fillColor("#1a1a1a");
    doc.text(line.replace(/^# /, ""), { width: CONTENT_WIDTH });
    doc.moveDown(0.4);
    // underline rule
    const y = doc.y;
    doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_MARGIN + CONTENT_WIDTH, y)
       .strokeColor("#cccccc").lineWidth(1).stroke();
    doc.moveDown(0.4);
    i++;
    continue;
  }

  // H2  ##
  if (/^## /.test(line)) {
    doc.moveDown(0.6);
    doc.font(FONT_BOLD).fontSize(16).fillColor("#2c2c2c");
    doc.text(line.replace(/^## /, ""), { width: CONTENT_WIDTH });
    doc.moveDown(0.3);
    i++;
    continue;
  }

  // H3  ###
  if (/^### /.test(line)) {
    doc.moveDown(0.4);
    doc.font(FONT_BOLD).fontSize(13).fillColor("#3a3a3a");
    doc.text(line.replace(/^### /, ""), { width: CONTENT_WIDTH });
    doc.moveDown(0.2);
    i++;
    continue;
  }

  // horizontal rule  ---
  if (/^---+$/.test(line)) {
    doc.moveDown(0.4);
    const y = doc.y;
    doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_MARGIN + CONTENT_WIDTH, y)
       .strokeColor("#dddddd").lineWidth(0.5).stroke();
    doc.moveDown(0.4);
    i++;
    continue;
  }

  // ⭐ Exam Tip  or  📌 Quick Revision  or  📖 FAQ  (emoji lines)
 if (/^[⭐📌📖]/.test(line)) {
  doc.moveDown(0.5);
  const cleanLine = line.replace(/[⭐📌📖]/g, "").trim();
  const icon = line[0];

  doc.font(FONT_BOLD).fontSize(11);
  const textHeight = doc.heightOfString(icon + " " + cleanLine, {
    width: CONTENT_WIDTH - 12,
  });
  const boxHeight = textHeight + 8;
  const boxY = doc.y;

  doc.rect(PAGE_MARGIN, boxY, CONTENT_WIDTH, boxHeight).fill("#fff8e1");
  doc.fillColor("#b8860b");
  doc.text(icon + " " + cleanLine, PAGE_MARGIN + 6, boxY + 4, {
    width: CONTENT_WIDTH - 12,
  });

  doc.y = boxY + boxHeight;
  doc.moveDown(0.4);
  i++;
  continue;
}
// bullet  * or -  (top level)
if (/^[\*\-] /.test(line)) {
  const text = line.replace(/^[\*\-] /, "");
  const bulletX = PAGE_MARGIN + 8;
  doc.font(FONT_REGULAR).fontSize(10).fillColor("#1a1a1a");
  doc.text("•", bulletX, doc.y, { lineBreak: false });
  renderInline(doc, text, 10, "#1a1a1a", bulletX + 12);
  doc.moveDown(0.1);
  i++;
  continue;
}

// sub-bullet
if (/^ {2,}[\*\-] /.test(raw)) {
  const text = raw.replace(/^ +[\*\-] /, "");
  const bulletX = PAGE_MARGIN + 22;
  doc.font(FONT_REGULAR).fontSize(10).fillColor("#444444");
  doc.text("◦", bulletX, doc.y, { lineBreak: false });
  renderInline(doc, text, 10, "#444444", bulletX + 12);
  doc.moveDown(0.1);
  i++;
  continue;
}

// numbered list
if (/^\d+\. /.test(line)) {
  const num  = line.match(/^(\d+)\./)[1];
  const text = line.replace(/^\d+\. /, "");
  const bulletX = PAGE_MARGIN + 8;
  doc.font(FONT_BOLD).fontSize(10).fillColor("#1a1a1a");
  doc.text(num + ".", bulletX, doc.y, { lineBreak: false });
  renderInline(doc, text, 10, "#1a1a1a", bulletX + 20);
  doc.moveDown(0.15);
  i++;
  continue;
}
  // normal paragraph
// normal paragraph
renderInline(doc, line, 10, "#1a1a1a", PAGE_MARGIN);
doc.moveDown(0.2);
i++;
}

doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate guide from file",
    });
  }
});
app.post("/api/generate-guide", async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "No text provided" });
    }

    const guide = await generateStudyGuide(text);

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate guide" });
  }
});
module.exports = app;