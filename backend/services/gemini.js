const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
async function generateStudyGuide(text) {
const prompt = `
You are a senior professor preparing notes for an engineering university examination.

Transform the study material into high-quality revision notes.

Formatting Rules:

- Use Markdown.
- Use headings.
- Use subheadings.
- Use bullet lists.
- Bold important terms.
- Explain difficult concepts simply.
- Keep technical accuracy.
- Remove unnecessary sentences.
- Never copy the paragraph directly.
- Rewrite everything.

After every major topic add:

⭐ Exam Tip:
(one important point)

At the end include:

📌 Quick Revision
• ...
• ...
• ...

📖 Frequently Asked Questions

1.
2.
3.

Study Material:

${text}`
;
;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = {
  generateStudyGuide,
};