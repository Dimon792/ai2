export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { targetUrl, apiKey, payload, method } = req.body;
    if (!targetUrl || !apiKey) {
      return res.status(400).json({ error: 'Missing targetUrl or apiKey' });
    }

    const fetchOptions = {
      method: method || (payload ? 'POST' : 'GET'),
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
    };
    if (payload) fetchOptions.body = JSON.stringify(payload);

    const apiResponse = await fetch(targetUrl, fetchOptions);
    const text = await apiResponse.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
      }
