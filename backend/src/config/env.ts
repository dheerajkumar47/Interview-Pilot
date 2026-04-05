import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const env = {
  PORT: parseInt(process.env.PORT || "5000"),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};
