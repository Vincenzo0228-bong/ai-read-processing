import axios from 'axios';

export class AIClient {
  async complete(prompt: string): Promise<string> {
    // Use mock if NODE_ENV is development or MOCK_AI is set
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.MOCK_AI === 'true'
    ) {
      // Debug: log the prompt to help diagnose mock matching
      console.log('[AIClient MOCK] Prompt:', prompt);
      // --- Enhanced mock logic for sample messages ---
      // Sample messages for matching
      const samples = [
        {
          text: 'weekly cleaning for a 3-bedroom apartment',
          intent: {
            category: 'sales_new',

            rationale: 'Customer is asking about pricing for a cleaning service.',

            confidence: 0.98,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'medium',
              timeline: 'now',
              budget_range: '500-2000',
              confidence: 0.95,
              customer_name: 'Alice',
              service_interest: 'weekly cleaning',
              location: 'downtown',
              language: 'en',
            },
            confidence: 0.95,
          },
          routing: {
            queue: 'sales',
            priority: 'p1',
            sla_minutes: 60,
            recommended_next_action: 'Send pricing details',
            explanation: 'Customer is interested in a new service.',
            required_followups: ['Send quote'],
          },
        },
        {
          text: 'urgent plumbing issue',
          intent: {
            category: 'support',
            rationale: 'Urgent request for plumbing support.',
            confidence: 0.99,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'high',
              timeline: 'now',
              budget_range: 'unknown',
              confidence: 0.97,
              customer_name: 'Bob',
              service_interest: 'plumbing',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.97,
          },
          routing: {
            queue: 'support',
            priority: 'p0',
            sla_minutes: 15,
            recommended_next_action: 'Dispatch plumber ASAP',
            explanation: 'High urgency support request.',
            required_followups: ['Confirm appointment'],
          },
        },
        {
          text: 'add deep cleaning for next month',
          intent: {
            category: 'sales_existing',
            rationale: 'Existing customer wants to add a service.',
            confidence: 0.96,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'email',
              urgency: 'low',
              timeline: '>1m',
              budget_range: '500-2000',
              confidence: 0.93,
              customer_name: 'Carol',
              service_interest: 'deep cleaning',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.93,
          },
          routing: {
            queue: 'sales',
            priority: 'p2',
            sla_minutes: 1440,
            recommended_next_action: 'Schedule deep cleaning',
            explanation: 'Existing customer add-on.',
            required_followups: ['Confirm schedule'],
          },
        },
        {
          text: 'reschedule my booking',
          intent: {
            category: 'sales_existing',
            rationale: 'Customer wants to reschedule.',
            confidence: 0.95,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'medium',
              timeline: '<1w',
              budget_range: 'unknown',
              confidence: 0.92,
              customer_name: 'David',
              service_interest: 'reschedule',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.92,
          },
          routing: {
            queue: 'sales',
            priority: 'p1',
            sla_minutes: 120,
            recommended_next_action: 'Reschedule booking',
            explanation: 'Customer reschedule request.',
            required_followups: ['Send confirmation'],
          },
        },
        {
          text: 'technician never showed up',
          intent: {
            category: 'support',
            rationale: 'Service issue reported.',
            confidence: 0.97,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'high',
              timeline: 'now',
              budget_range: 'unknown',
              confidence: 0.94,
              customer_name: 'Eve',
              service_interest: 'service issue',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.94,
          },
          routing: {
            queue: 'support',
            priority: 'p0',
            sla_minutes: 30,
            recommended_next_action: 'Contact customer',
            explanation: 'Missed appointment.',
            required_followups: ['Apologize', 'Reschedule'],
          },
        },
        {
          text: 'charged twice for my last service',
          intent: {
            category: 'support',
            rationale: 'Billing issue.',
            confidence: 0.96,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'email',
              urgency: 'medium',
              timeline: 'unknown',
              budget_range: 'unknown',
              confidence: 0.93,
              customer_name: 'Frank',
              service_interest: 'billing',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.93,
          },
          routing: {
            queue: 'support',
            priority: 'p1',
            sla_minutes: 240,
            recommended_next_action: 'Investigate billing',
            explanation: 'Customer billing complaint.',
            required_followups: ['Issue refund'],
          },
        },
        {
          text: 'Boost your website traffic',
          intent: {
            category: 'spam',
            rationale: 'Promotional spam.',
            confidence: 0.99,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'email',
              urgency: 'low',
              timeline: 'unknown',
              budget_range: 'unknown',
              confidence: 0.9,
              customer_name: 'Spammer',
              service_interest: 'spam',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.9,
          },
          routing: {
            queue: 'ignore',
            priority: 'p2',
            sla_minutes: 0,
            recommended_next_action: 'Ignore message',
            explanation: 'Detected spam.',
            required_followups: [],
          },
        },
        {
          text: 'provide your bank details',
          intent: {
            category: 'spam',
            rationale: 'Phishing attempt.',
            confidence: 0.99,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'email',
              urgency: 'low',
              timeline: 'unknown',
              budget_range: 'unknown',
              confidence: 0.9,
              customer_name: 'Scammer',
              service_interest: 'phishing',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.9,
          },
          routing: {
            queue: 'ignore',
            priority: 'p2',
            sla_minutes: 0,
            recommended_next_action: 'Ignore message',
            explanation: 'Detected phishing.',
            required_followups: [],
          },
        },
        {
          text: 'question about your services',
          intent: {
            category: 'unknown',
            rationale: 'Insufficient information.',
            confidence: 0.7,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'unknown',
              timeline: 'unknown',
              budget_range: 'unknown',
              confidence: 0.7,
              customer_name: 'Grace',
              service_interest: 'unknown',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.7,
          },
          routing: {
            queue: 'needs_clarification',
            priority: 'p2',
            sla_minutes: 1440,
            recommended_next_action: 'Request more info',
            explanation: 'Message unclear.',
            required_followups: ['Ask for details'],
          },
        },
        {
          text: 'Is this something you handle',
          intent: {
            category: 'unknown',
            rationale: 'Unclear request.',
            confidence: 0.6,
          },
          extraction: {
            extracted_fields: {
              contact_channel: 'webchat',
              urgency: 'unknown',
              timeline: 'unknown',
              budget_range: 'unknown',
              confidence: 0.6,
              customer_name: 'Henry',
              service_interest: 'unknown',
              location: 'unknown',
              language: 'en',
            },
            confidence: 0.6,
          },
          routing: {
            queue: 'needs_clarification',
            priority: 'p2',
            sla_minutes: 1440,
            recommended_next_action: 'Request more info',
            explanation: 'Message unclear.',
            required_followups: ['Ask for details'],
          },
        },
      ];

      // Helper to match sample message
      function matchSample(text: string) {
        return samples.find((s) =>
          text.toLowerCase().includes(s.text.toLowerCase()),
        );
      }

      // Routing mock
      if (
        /decide\s+routing/i.test(prompt) ||
        (prompt.toLowerCase().includes('context') &&
          prompt.toLowerCase().includes('routing'))
      ) {
        const match = matchSample(prompt);
        return JSON.stringify(match ? match.routing : samples[0].routing);
      }
      // Intent mock
      if (prompt.toLowerCase().includes('classify the intent')) {
        const match = matchSample(prompt);
        return JSON.stringify(match ? match.intent : samples[0].intent);
      }
      // Extraction mock
      if (prompt.toLowerCase().includes('extract')) {
        const match = matchSample(prompt);
        return JSON.stringify(match ? match.extraction : samples[0].extraction);
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
