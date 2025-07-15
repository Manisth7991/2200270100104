const express = require('express');
const router = express.Router();
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

module.exports = router;
