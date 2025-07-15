const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const { shortenUrl } = require('../controllers/urlController');
const Url = require('../models/url');

// Route 1: Shorten a URL (POST)
router.post('/shorturls', shortenUrl);

// Route 2: Redirect to the original URL (GET)
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Check for expiry
    const now = new Date();
    if (urlData.expiresAt < now) {
      return res.status(410).json({ message: 'Short URL has expired' });
    }

    // Redirect to the original long URL
    res.redirect(urlData.longUrl);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Route 3: Register to evaluation-service (POST)
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(
      'https://20.244.56.144/evaluation-service/register',
      {
        email: "manisth2210130@akgec.ac.in",
        name: "Manisth Singh",
        mobileNo: "6393136745",
        githubUsername: "Manisth7991",
        rollno: "2200270100104",
        accesscode: "uuMbyY"
      },
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false // allow self-signed cert
        })
      }
    );

    // Return email, name, rollno from response
    const { email, name, rollno } = response.data;
    res.status(200).json({ email, name, rollno });

  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
