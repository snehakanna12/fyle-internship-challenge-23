// server.js

const express = require('express');
const axios = require('axios');
const qs = require('qs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your GitHub OAuth App credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Authorization code not provided.');
    return;
  }

  try {
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }, {
      headers: {
        Accept: 'application/json',
      },
    });

    const accessToken = data.access_token;

    // Redirect back to the frontend with the access token
    res.redirect(`http://localhost:3000/?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error exchanging code for access token:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});