import dotEnv from "dotenv";
dotEnv.config();

export default {
  open_ai_api_key: process.env.OPEN_AI_API_KEY,
  gemini_api_key: process.env.GEMINI_API_KEY,
};
