const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GROK_API_KEY=(.*)/)[1].trim();
process.env.GROK_API_KEY = key;
fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + key,
  },
  body: JSON.stringify({
    model: 'openai/gpt-oss-120b',
    messages: [
      { role: 'system', content: 'You are a helpful assistant. Output JSON only. Format: {"reply": "string with newlines and quotes"}' },
      { role: 'user', content: 'Hello' }
    ],
    response_format: { type: 'json_object' }
  })
}).then(r => r.json()).then(console.log).catch(console.error);
