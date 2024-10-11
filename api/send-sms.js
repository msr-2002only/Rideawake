const axios = require('axios');

// Infobip API details
const infobipConfig = {
  url: 'https://8kkyre.api.infobip.com/sms/2/text/advanced',
  headers: {
    'Authorization': 'App b480aa0dff964aac84db110bea7931dd-357dab0d-d33d-4eeb-bdb0-be03754f83e8',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Exported handler for Vercel serverless function
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); // Only allow POST
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" in request body.' });
  }

  // Hardcoded destination number
  const toNumber = '+94701288850'; // This is now hardcoded instead of being passed from the frontend

  const postData = {
    "messages": [
      {
        "destinations": [{ "to": toNumber }], // Using the hardcoded number here
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
