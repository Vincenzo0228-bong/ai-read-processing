import axios from 'axios';

export class AIClient {
  async complete(prompt: string): Promise<string> {
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
