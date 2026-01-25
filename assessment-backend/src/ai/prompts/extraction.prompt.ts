export const extractionPrompt = (
  message: string,
  category: string,
) => `
Extract structured data from this message.

Message:
"${message}"

Category:
"${category}"

Respond ONLY in JSON following the defined schema.
`;
