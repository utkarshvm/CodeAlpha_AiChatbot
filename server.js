
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const GROQ_API_KEY = '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'; // paste your key here

app.post('/chat', async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model:  'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          { role: 'system', content: 'You are a helpful FAQ chatbot. Answer clearly in plain text under 100 words.' },
          ...messages
        ]
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));

    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: 'No answer received. Check your API key.' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ reply: 'Server error: ' + error.message });
  }
});

app.listen(3000, () => {
  console.log('Chatbot running at http://localhost:3000');
});
