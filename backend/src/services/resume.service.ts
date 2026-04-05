import pdf from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts text from a PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing error:", error);
    throw new Error("Failed to parse PDF resume.");
  }
}

/**
 * Extracts text from a Word (docx) buffer
 */
export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX Parsing error:", error);
    throw new Error("Failed to parse DOCX resume.");
  }
}

/**
 * Orchestrator: extracts text based on file type
 */
export async function extractResumeText(buffer: Buffer, originalName: string): Promise<string> {
  if (originalName.toLowerCase().endsWith(".pdf")) {
    return extractTextFromPDF(buffer);
  } else if (originalName.toLowerCase().endsWith(".docx") || originalName.toLowerCase().endsWith(".doc")) {
    return extractTextFromDocx(buffer);
  }
  throw new Error("Unsupported file format.");
}

export function validateResumeFile(file: { mimetype: string; size: number; originalname: string }): { valid: boolean; error?: string } {
  if (file.size > 5 * 1024 * 1024) return { valid: false, error: "File size exceeds 5MB limit" };
  if (!file.originalname.match(/\.(pdf|docx?)$/i)) return { valid: false, error: "Only PDF and DOCX files are allowed" };
  return { valid: true };
}
