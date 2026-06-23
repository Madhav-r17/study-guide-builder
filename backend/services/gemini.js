const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
async function generateStudyGuide(text) {
  const prompt = `
Convert the following study material into concise exam-oriented notes.

Requirements:
- Use headings
- Use bullet points
- Highlight important concepts
- Keep it easy to revise

Study Material:

${text}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = {
  generateStudyGuide,
};