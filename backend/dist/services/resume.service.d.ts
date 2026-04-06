/**
 * Extracts text from a PDF buffer
 */
export declare function extractTextFromPDF(buffer: Buffer): Promise<string>;
/**
 * Extracts text from a Word (docx) buffer
 */
export declare function extractTextFromDocx(buffer: Buffer): Promise<string>;
/**
 * Orchestrator: extracts text based on file type
 */
export declare function extractResumeText(buffer: Buffer, originalName: string): Promise<string>;
export declare function validateResumeFile(file: {
    mimetype: string;
    size: number;
    originalname: string;
}): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=resume.service.d.ts.map