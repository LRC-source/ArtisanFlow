const https = require('https');
const data = JSON.stringify({ prompt: 'GET_MODELS_DEBUG' });

const options = {
  hostname: 'artisanflow.lrcholisticmarketing.online',
  path: '/api/gemini',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log('statusCode:', res.statusCode);
  let result = '';
  res.on('data', d => { result += d; });
  res.on('end', () => { console.log('Response:', result); });
});

req.on('error', error => { console.error('Error:', error); });
req.write(data);
req.end();
