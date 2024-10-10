const axios = require('axios');

// Infobip API details
const infobipConfig = {
  url: 'https://lq3drr.api.infobip.com/sms/2/text/advanced',
  headers: {
    'Authorization': 'App 590cec2efbdf7475ead7fc59cb28864f-689f957e-f691-40ec-8b86-bf51ecc34cfb',
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
