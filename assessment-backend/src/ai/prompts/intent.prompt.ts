export const intentPrompt = (message: string) => `
Classify the intent of the following message.

Message:
"${message}"

Respond ONLY in JSON with:
{
  "category": one of [sales_new, sales_existing, support, spam, unknown],
  "confidence": number between 0 and 1,
  "rationale": short explanation
}
`;
