import dotEnv from "dotenv";

dotEnv.config();

export default {
  open_ai_api_key: process.env.OPEN_AI_API_KEY,
  google_ai_api_key: process.env.GOOGLE_AI_API_KEY,
};
