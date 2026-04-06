"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPDF = extractTextFromPDF;
exports.extractTextFromDocx = extractTextFromDocx;
exports.extractResumeText = extractResumeText;
exports.validateResumeFile = validateResumeFile;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
/**
 * Extracts text from a PDF buffer
 */
async function extractTextFromPDF(buffer) {
    try {
        const data = await (0, pdf_parse_1.default)(buffer);
        return data.text;
    }
    catch (error) {
        console.error("PDF Parsing error:", error);
        throw new Error("Failed to parse PDF resume.");
    }
}
/**
 * Extracts text from a Word (docx) buffer
 */
async function extractTextFromDocx(buffer) {
    try {
        const result = await mammoth_1.default.extractRawText({ buffer });
        return result.value;
    }
    catch (error) {
        console.error("DOCX Parsing error:", error);
        throw new Error("Failed to parse DOCX resume.");
    }
}
/**
 * Orchestrator: extracts text based on file type
 */
async function extractResumeText(buffer, originalName) {
    if (originalName.toLowerCase().endsWith(".pdf")) {
        return extractTextFromPDF(buffer);
    }
    else if (originalName.toLowerCase().endsWith(".docx") || originalName.toLowerCase().endsWith(".doc")) {
        return extractTextFromDocx(buffer);
    }
    throw new Error("Unsupported file format.");
}
function validateResumeFile(file) {
    if (file.size > 5 * 1024 * 1024)
        return { valid: false, error: "File size exceeds 5MB limit" };
    if (!file.originalname.match(/\.(pdf|docx?)$/i))
        return { valid: false, error: "Only PDF and DOCX files are allowed" };
    return { valid: true };
}
//# sourceMappingURL=resume.service.js.map