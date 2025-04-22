import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/[<>{}]/g, "").trim();
};

// Validation for student input
const validateStudentInput = (req, res, next) => {
  const { class10, class12, stream, goal, exam, examscore, budget } = req.body;

  const requiredFields = { class10, class12, stream, goal };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ error: `${key} is required.` });
    }
  }

  const numericFields = { class10, class12, examscore, budget };
  for (const [key, value] of Object.entries(numericFields)) {
    if (value && (isNaN(value) || Number(value) < 0)) {
      return res.status(400).json({ error: `${key} must be a valid positive number.` });
    }
  }

  if ((Number(class10) > 100 || Number(class12) > 100) && class10 && class12) {
    return res.status(400).json({ error: "Class 10 and Class 12 percentages cannot exceed 100." });
  }

  if (exam && !["None", "JEE", "NEET", ""].includes(exam)) {
    return res.status(400).json({ error: "Invalid exam type." });
  }

  if (exam && exam !== "None" && !examscore) {
    return res.status(400).json({ error: "Exam score is required for selected competitive exam." });
  }

  next();
};

// Validation for upskill input
const validateUpskillInput = (req, res, next) => {
  const { currentSkills, desiredSkill, experienceLevel, budget } = req.body;

  const requiredFields = { currentSkills, desiredSkill, experienceLevel };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ error: `${key} is required.` });
    }
  }

  if (budget && (isNaN(budget) || Number(budget) < 0)) {
    return res.status(400).json({ error: "Budget must be a valid positive number." });
  }

  if (!["Beginner", "Intermediate", "Advanced", ""].includes(experienceLevel)) {
    return res.status(400).json({ error: "Invalid experience level. Use Beginner, Intermediate, or Advanced." });
  }

  next();
};

// Route for student career recommendations
app.post("/api/recommend", validateStudentInput, async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const {
      class10,
      class12,
      exam,
      examscore,
      stream,
      interests,
      location,
      clgtype,
      budget,
      goal,
      extra,
    } = req.body;

    const sanitizedData = {
      class10: sanitizeInput(class10),
      class12: sanitizeInput(class12),
      exam: sanitizeInput(exam),
      examscore: sanitizeInput(examscore),
      stream: sanitizeInput(stream),
      interests: sanitizeInput(interests),
      location: sanitizeInput(location),
      clgtype: sanitizeInput(clgtype),
      budget: sanitizeInput(budget),
      goal: sanitizeInput(goal),
      extra: sanitizeInput(extra),
    };

    const prompt = `
A student has the following details:
- Class 10 Marks: ${sanitizedData.class10}%
- Class 12 Marks: ${sanitizedData.class12}%
- Competitive Exam: ${sanitizedData.exam || "None"}
- Exam Score: ${sanitizedData.examscore || "N/A"}
- Stream: ${sanitizedData.stream}
- Interests: ${sanitizedData.interests || "None"}
- Preferred Location: ${sanitizedData.location || "Any"}
- College Type: ${sanitizedData.clgtype || "Any"}
- Budget: ₹${sanitizedData.budget || "Not specified"}
- Career Goal: ${sanitizedData.goal}
- Additional Notes: ${sanitizedData.extra || "None"}

Suggest 3 suitable college options for the student. For each college, include:
- Name
- Location
- Total Fees
- Key Specialties
- Why it suits the student
- Scholarships (if any)
- Official website link

Respond with valid JSON (no markdown, no extra text) like:
[
  {
    "name": "College 1",
    "location": "City, State",
    "fees": "₹X,XX,XXX",
    "specialties": "Key features",
    "why_suitable": "Brief explanation",
    "scholarships": "Briefly",
    "link": "https://college1.edu"
  },
  ...
]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let text;
    try {
      const result = await model.generateContent(prompt);
      text = await result.response.text();
    } catch (err) {
      console.error("❌ Gemini API call failed:", err.message);
      return res.status(500).json({ error: "Failed to fetch recommendations from AI service." });
    }

    console.log("Raw Gemini response:", text);

    let cleanedText = text
      .replace(/```json|```/g, "")
      .replace(/^\s*[\r\n]+|[\r\n]+\s*$/g, "")
      .trim();

    const jsonMatch = cleanedText.match(/\[.*\]/s);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    } else {
      console.error("❌ No JSON found in response:", cleanedText);
      return res.status(500).json({ error: "Invalid AI response format." });
    }

    try {
      const parsed = JSON.parse(cleanedText);
      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array.");
      }
      res.json({ recommendations: parsed });
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", err.message, "Cleaned response:", cleanedText);
      res.status(500).json({
        error: "Failed to process recommendations due to invalid AI response format.",
      });
    }
  } catch (err) {
    console.error("❌ Error in /api/recommend:", err.message, err.stack);
    res.status(500).json({
      error: `An error occurred: ${err.message}. Please try again.`,
    });
  }
});

// Route for upskilling recommendations
app.post("/api/upskill", validateUpskillInput, async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const {
      currentSkills,
      desiredSkill,
      experienceLevel,
      industryPreference,
      budget,
      learningFormat,
      extra,
    } = req.body;

    const sanitizedData = {
      currentSkills: sanitizeInput(currentSkills),
      desiredSkill: sanitizeInput(desiredSkill),
      experienceLevel: sanitizeInput(experienceLevel),
      industryPreference: sanitizeInput(industryPreference),
      budget: sanitizeInput(budget),
      learningFormat: sanitizeInput(learningFormat),
      extra: sanitizeInput(extra),
    };

    const prompt = `
An employee or skill holder has the following details:
- Current Skills: ${sanitizedData.currentSkills}
- Desired Skill: ${sanitizedData.desiredSkill}
- Experience Level: ${sanitizedData.experienceLevel}
- Industry Preference: ${sanitizedData.industryPreference || "Any"}
- Budget: ₹${sanitizedData.budget || "Not specified"}
- Learning Format: ${sanitizedData.learningFormat || "Any"}
- Additional Notes: ${sanitizedData.extra || "None"}

Suggest 3 upskilling recommendations for the desired skill that a person could pursue the data should not be example data. For each recommendation, include:
- Skill: The desired skill
- Upskilling Strategy: How to enhance the skill
- Industries: Industries where the skill is in demand
- Course Name: A relevant course name
- Course Link: A link to the course

Respond with valid JSON (no markdown, no extra text) like:
[
  {
    "skill": "Desired Skill",
    "upskillingStrategy": "Strategy to enhance the skill",
    "industries": "Industries using the skill",
    "courseName": "Course name",
    "courseLink": "https://course-link.com"
  },
  ...
]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let text;
    try {
      const result = await model.generateContent(prompt);
      text = await result.response.text();
    } catch (err) {
      console.error("❌ Gemini API call failed:", err.message);
      return res.status(500).json({ error: "Failed to fetch upskilling recommendations from AI service." });
    }

    console.log("Raw Gemini response:", text);

    let cleanedText = text
      .replace(/```json|```/g, "")
      .replace(/^\s*[\r\n]+|[\r\n]+\s*$/g, "")
      .trim();

    const jsonMatch = cleanedText.match(/\[.*\]/s);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    } else {
      console.error("❌ No JSON found in response:", cleanedText);
      return res.status(500).json({ error: "Invalid AI response format." });
    }

    try {
      const parsed = JSON.parse(cleanedText);
      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array.");
      }
      res.json({ recommendations: parsed });
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", err.message, "Cleaned response:", cleanedText);
      res.status(500).json({ error: "Failed to process upskilling recommendations due to invalid AI response format." });
    }
  } catch (err) {
    console.error("❌ Error in /api/upskill:", err.message, err.stack);
    res.status(500).json({ error: `An error occurred: ${err.message}. Please try again.` });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});