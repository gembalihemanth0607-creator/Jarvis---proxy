const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

app.get('/', (req, res) => res.json({status: 'Jarvis online'}));

app.post('/api/chat', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({error: 'No API key'});
  try {
    const {default: fetch} = await import('node-fetch');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Jarvis proxy running'));
