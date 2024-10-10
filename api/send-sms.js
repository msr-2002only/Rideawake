const axios = require('axios');

// Infobip API details
const infobipConfig = {
  url: 'https://2mm12p.api.infobip.com/sms/2/text/advanced',
  headers: {
    'Authorization': 'App 904f04df27a1a862d670c735e436a66b-3eaaa649-e363-44cd-85e7-4959784abb73',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Exported handler for Vercel serverless function
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); // Only allow POST
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing "to" or "message" in request body.' });
  }

  const postData = {
    "messages": [
      {
        "destinations": [{ "to": to }],
        "from": "447491163443",
        "text": message
      }
    ]
  };

  try {
    const response = await axios.post(infobipConfig.url, postData, {
      headers: infobipConfig.headers
    });

    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      error: 'Failed to send SMS.',
      details: error.response ? error.response.data : error.message
    });
  }
};
