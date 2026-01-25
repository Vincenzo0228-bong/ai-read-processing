## Sample Messages

For each of the following messages, you can assign the name and contact channel to your choosing.

### Message 1

“Hi, I’m looking to get weekly cleaning for a 3-bedroom apartment in downtown. What would pricing look like?”

output: 
{
  "message": "“Hi, I’m looking to get weekly cleaning for a 3-bedroom apartment in downtown. What would pricing look like?”",
  "intent": {
    "category": "sales_new",
    "rationale": "Customer is asking about pricing for a cleaning service.",
    "confidence": 0.98
  },
  "extraction": {
    "confidence": 0.95,
    "extracted_fields": {
      "urgency": "medium",
      "language": "en",
      "location": "downtown",
      "timeline": "now",
      "confidence": 0.95,
      "budget_range": "500-2000",
      "customer_name": "Alice",
      "contact_channel": "webchat",
      "service_interest": "weekly cleaning"
    }
  },
  "routing": {
    "queue": "sales",
    "priority": "p1",
    "explanation": "Customer is interested in a new service.",
    "sla_minutes": 60,
    "required_followups": [
      "Send quote"
    ],
    "recommended_next_action": "Send pricing details"
  }
}
---

### Message 2

“Do you guys have availability this Friday for an urgent plumbing issue? Need someone ASAP.”

output: 
{
  "message": "“Do you guys have availability this Friday for an urgent plumbing issue? Need someone ASAP.”",
  "intent": {
    "category": "support",
    "rationale": "Urgent request for plumbing support.",
    "confidence": 0.99
  },
  "extraction": {
    "confidence": 0.97,
    "extracted_fields": {
      "urgency": "high",
      "language": "en",
      "location": "unknown",
      "timeline": "now",
      "confidence": 0.97,
      "budget_range": "unknown",
      "customer_name": "Bob",
      "contact_channel": "webchat",
      "service_interest": "plumbing"
    }
  },
  "routing": {
    "queue": "support",
    "priority": "p0",
    "explanation": "High urgency support request.",
    "sla_minutes": 15,
    "required_followups": [
      "Confirm appointment"
    ],
    "recommended_next_action": "Dispatch plumber ASAP"
  }
}
---

### Message 3

“Hey, I already have a monthly cleaning booked, but I want to add deep cleaning for next month. How much extra would that be?”

output: 
{
  "message": "“Hey, I already have a monthly cleaning booked, but I want to add deep cleaning for next month. How much extra would that be?”",
  "intent": {
    "category": "sales_existing",
    "rationale": "Existing customer wants to add a service.",
    "confidence": 0.96
  },
  "extraction": {
    "confidence": 0.93,
    "extracted_fields": {
      "urgency": "low",
      "language": "en",
      "location": "unknown",
      "timeline": ">1m",
      "confidence": 0.93,
      "budget_range": "500-2000",
      "customer_name": "Carol",
      "contact_channel": "webchat",
      "service_interest": "deep cleaning"
    }
  },
  "routing": {
    "queue": "sales",
    "priority": "p2",
    "explanation": "Existing customer add-on.",
    "sla_minutes": 1440,
    "required_followups": [
      "Confirm schedule"
    ],
    "recommended_next_action": "Schedule deep cleaning"
  }
}
---

### Message 4

“I’m a current customer. Can you reschedule my booking from Monday to Wednesday next week?”

output: 
{
  "message": "“I’m a current customer. Can you reschedule my booking from Monday to Wednesday next week?”",
  "intent": {
    "category": "sales_existing",
    "rationale": "Customer wants to reschedule.",
    "confidence": 0.95
  },
  "extraction": {
    "confidence": 0.92,
    "extracted_fields": {
      "urgency": "medium",
      "language": "en",
      "location": "unknown",
      "timeline": "<1w",
      "confidence": 0.92,
      "budget_range": "unknown",
      "customer_name": "David",
      "contact_channel": "webchat",
      "service_interest": "reschedule"
    }
  },
  "routing": {
    "queue": "sales",
    "priority": "p1",
    "explanation": "Customer reschedule request.",
    "sla_minutes": 120,
    "required_followups": [
      "Send confirmation"
    ],
    "recommended_next_action": "Reschedule booking"
  }
}
---

### Message 5

“The technician never showed up today and no one called me. This is really frustrating.”

output: 
{
  "message": "“The technician never showed up today and no one called me. This is really frustrating.”",
  "intent": {
    "category": "support",
    "rationale": "Service issue reported.",
    "confidence": 0.97
  },
  "extraction": {
    "confidence": 0.94,
    "extracted_fields": {
      "urgency": "high",
      "language": "en",
      "location": "unknown",
      "timeline": "now",
      "confidence": 0.94,
      "budget_range": "unknown",
      "customer_name": "Eve",
      "contact_channel": "webchat",
      "service_interest": "service issue"
    }
  },
  "routing": {
    "queue": "support",
    "priority": "p0",
    "explanation": "Missed appointment.",
    "sla_minutes": 30,
    "required_followups": [
      "Apologize",
      "Reschedule"
    ],
    "recommended_next_action": "Contact customer"
  }
}
---

### Message 6

“I was charged twice for my last service. Can someone look into this?”

output: 
{
  "message": "“I was charged twice for my last service. Can someone look into this?”",
  "intent": {
    "category": "support",
    "rationale": "Billing issue.",
    "confidence": 0.96
  },
  "extraction": {
    "confidence": 0.93,
    "extracted_fields": {
      "urgency": "medium",
      "language": "en",
      "location": "unknown",
      "timeline": "unknown",
      "confidence": 0.93,
      "budget_range": "unknown",
      "customer_name": "Frank",
      "contact_channel": "webchat",
      "service_interest": "billing"
    }
  },
  "routing": {
    "queue": "support",
    "priority": "p1",
    "explanation": "Customer billing complaint.",
    "sla_minutes": 240,
    "required_followups": [
      "Issue refund"
    ],
    "recommended_next_action": "Investigate billing"
  }
}
---

### Message 7

“🚀 Boost your website traffic 10x instantly! Click here to learn more!!!”

output: 
{
  "message": "“🚀 Boost your website traffic 10x instantly! Click here to learn more!!!”",
  "intent": {
    "category": "spam",
    "rationale": "Promotional spam.",
    "confidence": 0.99
  },
  "extraction": {
    "confidence": 0.9,
    "extracted_fields": {
      "urgency": "low",
      "language": "en",
      "location": "unknown",
      "timeline": "unknown",
      "confidence": 0.9,
      "budget_range": "unknown",
      "customer_name": "Spammer",
      "contact_channel": "webchat",
      "service_interest": "spam"
    }
  },
  "routing": {
    "queue": "ignore",
    "priority": "p2",
    "explanation": "Detected spam.",
    "sla_minutes": 0,
    "required_followups": [],
    "recommended_next_action": "Ignore message"
  }
}
---

### Message 8

“Dear sir, kindly provide your bank details so we can process your refund.”

output: 
{
  "message": "“Dear sir, kindly provide your bank details so we can process your refund.”",
  "intent": {
    "category": "spam",
    "rationale": "Phishing attempt.",
    "confidence": 0.99
  },
  "extraction": {
    "confidence": 0.9,
    "extracted_fields": {
      "urgency": "low",
      "language": "en",
      "location": "unknown",
      "timeline": "unknown",
      "confidence": 0.9,
      "budget_range": "unknown",
      "customer_name": "Scammer",
      "contact_channel": "webchat",
      "service_interest": "phishing"
    }
  },
  "routing": {
    "queue": "ignore",
    "priority": "p2",
    "explanation": "Detected phishing.",
    "sla_minutes": 0,
    "required_followups": [],
    "recommended_next_action": "Ignore message"
  }
}
---

### Message 9

“Hi, I have a question about your services.”

output: 
{
  "message": "“Hi, I have a question about your services.”",
  "intent": {
    "category": "unknown",
    "rationale": "Insufficient information.",
    "confidence": 0.7
  },
  "extraction": {
    "confidence": 0.7,
    "extracted_fields": {
      "urgency": "low",
      "language": "en",
      "location": "unknown",
      "timeline": "unknown",
      "confidence": 0.7,
      "budget_range": "unknown",
      "customer_name": "Grace",
      "contact_channel": "webchat",
      "service_interest": "unknown"
    }
  },
  "routing": {
    "queue": "needs_clarification",
    "priority": "p2",
    "explanation": "Message unclear.",
    "sla_minutes": 1440,
    "required_followups": [
      "Ask for details"
    ],
    "recommended_next_action": "Request more info"
  }
}
---

### Message 10

“Is this something you handle?”

output: 
{
  "message": "“Is this something you handle?”",
  "intent": {
    "category": "unknown",
    "rationale": "Unclear request.",
    "confidence": 0.6
  },
  "extraction": {
    "confidence": 0.6,
    "extracted_fields": {
      "urgency": "low",
      "language": "en",
      "location": "unknown",
      "timeline": "unknown",
      "confidence": 0.6,
      "budget_range": "unknown",
      "customer_name": "Henry",
      "contact_channel": "webchat",
      "service_interest": "unknown"
    }
  },
  "routing": {
    "queue": "needs_clarification",
    "priority": "p2",
    "explanation": "Message unclear.",
    "sla_minutes": 1440,
    "required_followups": [
      "Ask for details"
    ],
    "recommended_next_action": "Request more info"
  }
}