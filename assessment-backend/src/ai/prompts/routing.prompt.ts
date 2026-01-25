export const routingPrompt = (context: any) => `
Given the following structured context, decide routing.

Context:
${JSON.stringify(context, null, 2)}

Respond ONLY in JSON using the routing schema.
`;
