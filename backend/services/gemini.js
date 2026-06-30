const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function generateStudyGuide(text) {
  const prompt = `You are a senior professor preparing notes for an engineering university examination.

Transform the study material into high-quality revision notes using MARKDOWN syntax exactly as specified below. Do not deviate from this syntax, since the output is parsed programmatically.

Formatting Rules (use exact markdown syntax):
- "# " for the main title (one per document)
- "## " for major topic headings
- "### " for subheadings
- "* " for bullet points (always a single space after the asterisk)
- "1. ", "2. ", etc. for numbered lists
- "**text**" to bold important terms
- Explain difficult concepts simply, in your own words
- Keep technical accuracy
- Remove unnecessary sentences
- Never copy the paragraph directly — rewrite everything

After every major topic, add a line starting with exactly "⭐ Exam Tip:" followed by one important point on the next line.

At the end, include:

⭐ Exam Tip sections are not required here.

📌 Quick Revision
* point one
* point two
* point three

📖 Frequently Asked Questions
1. Question one?
2. Question two?
3. Question three?

Do not use any bullet character other than "*" or "-". Do not use "•".

Study Material:
${text}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini generateStudyGuide error:", error);
    throw error;
  }
}

module.exports = {
  generateStudyGuide,
};