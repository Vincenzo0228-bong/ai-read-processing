import axios from 'axios';

export class AIClient {
  async complete(prompt: string): Promise<string> {
    // Use mock if NODE_ENV is development or MOCK_AI is set
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_AI === 'true') {
      // Debug: log the prompt to help diagnose mock matching
      console.log('[AIClient MOCK] Prompt:', prompt);
      // Routing mock: match before intent to avoid false positives
      if (/decide\s+routing/i.test(prompt) || (prompt.toLowerCase().includes('context') && prompt.toLowerCase().includes('routing'))) {
        // Return a valid routing schema response
        return JSON.stringify({
          queue: 'sales',
          priority: 'p1',
          sla_minutes: 30,
          recommended_next_action: 'Mock follow up with customer',
          explanation: 'Mock explanation for routing',
          required_followups: ['Mock followup 1', 'Mock followup 2'],
        });
      }
      // Intent mock: only match if prompt is for intent classification
      if (prompt.toLowerCase().includes('classify the intent')) {
        return JSON.stringify({
          category: 'sales_new',
          rationale: 'Mock rationale for testing',
          confidence: 1,
        });
      }
      // Extraction mock
      if (prompt.toLowerCase().includes('extract')) {
        return JSON.stringify({
          extracted_fields: {
            contact_channel: 'webchat',
            urgency: 'medium',
            timeline: 'now',
            budget_range: '500-2000',
            confidence: 0.95,
            customer_name: 'Mock Customer',
            service_interest: 'Mock Service',
            location: 'Mock Location',
            language: 'en',
          },
          confidence: 0.95,
        });
      }
      return JSON.stringify({ mock: true });
    }
    // Real API call for production
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You output ONLY valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    return response.data.choices[0].message.content;
  }
}
