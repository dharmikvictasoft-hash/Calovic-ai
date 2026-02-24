const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());


if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});


const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const PROMPT = `
You are a nutrition analysis API.

CRITICAL RULES:
- Respond ONLY with valid JSON
- No markdown
- No explanations
- No comments
- No trailing commas

Return EXACTLY this schema:

{
  "foods": [
    {
      "name": "string",
      "estimated_weight_grams": number,
      "calories": number
    }
  ],
  "total_calories": number
}

If unsure, return empty foods array and total_calories = 0.
`;

const FOOD_IMAGE_VALIDATION_PROMPT = `
You are an image validator for a food-calorie API.

Task:
- Decide if the uploaded image is a real food/meal photo.
- Reject screenshots, app UI, chat windows, documents, text-only images, memes, and non-food photos.

Respond ONLY with valid JSON:
{
  "is_food_image": boolean,
  "reason": "short string"
}
`;

function extractJSON(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");

  return match[0];
}

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const fixed = text.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(fixed);
  }
}

async function validateFoodImage(imageBase64, mimeType) {
  const validationResult = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: FOOD_IMAGE_VALIDATION_PROMPT },
          {
            inlineData: {
              data: imageBase64,
              mimeType,
            },
          },
        ],
      },
    ],
  });

  const rawValidation = validationResult.response.text();
  const validationJSON = extractJSON(rawValidation);
  const parsedValidation = safeJSONParse(validationJSON);

  return {
    isFoodImage: Boolean(parsedValidation?.is_food_image),
    reason:
      typeof parsedValidation?.reason === "string"
        ? parsedValidation.reason
        : "Uploaded image is not a food photo.",
  };
}

function removeTempFile(path) {
  if (!path) return;
  if (fs.existsSync(path)) fs.unlinkSync(path);
}

function requireFoodImage(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      error: "Please add food image before analyzing.",
      code: "IMAGE_REQUIRED",
    });
  }

  return next();
}

app.post("/analyze-food", upload.single("image"), requireFoodImage, async (req, res) => {
  try {
    const imageBase64 = fs.readFileSync(req.file.path, "base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    const validation = await validateFoodImage(imageBase64, mimeType);
    if (!validation.isFoodImage) {
      return res.status(400).json({
        error: "Please upload a clear food image (screenshots are not allowed).",
        code: "INVALID_FOOD_IMAGE",
        detail: validation.reason,
      });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                data: imageBase64,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const rawText = result.response.text();

    let parsed;
    try {
      const jsonText = extractJSON(rawText);
      parsed = safeJSONParse(jsonText);
    } catch (err) {
      console.error("❌ JSON parse failed");

      return res.json({
        foods: [],
        total_calories: 0,
        warning: "Invalid model response",
      });
    }

    if (!Array.isArray(parsed.foods)) parsed.foods = [];

    const totalCalories = parsed.foods.reduce(
      (sum, f) => sum + Number(f.calories || 0),
      0
    );

    res.json({
      foods: parsed.foods,
      total_calories: Math.round(totalCalories),
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  } finally {
    removeTempFile(req.file?.path);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "Image size is too large. Max allowed size is 10MB.",
        code: "IMAGE_TOO_LARGE",
      });
    }

    return res.status(400).json({
      error: "Invalid image upload request.",
      code: "UPLOAD_ERROR",
    });
  }

  return next(err);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
