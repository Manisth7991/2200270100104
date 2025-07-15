const Url = require('../models/url');
const generateShortCode = require('../utils/generateShortCode');

exports.shortenUrl = async (req, res) => {
  try {
    let { url, shortcode, validity } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Missing 'url' field" });
    }

    // Basic URL format validation
    const urlRegex = /^(https?:\/\/)?([\w.-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;
    if (!urlRegex.test(url)) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    if (shortcode) {
      shortcode = shortcode.toLowerCase(); // Normalize
      const existing = await Url.findOne({ shortCode: shortcode });
      if (existing) {
        return res.status(409).json({ message: 'Shortcode already exists' });
      }
    } else {
      shortcode = generateShortCode();
    }

    const validMinutes = parseInt(validity, 10) || 30;
    const now = new Date();
    const expiryDate = new Date(now.getTime() + validMinutes * 60000);

    const newUrl = new Url({
      longUrl: url,
      shortCode: shortcode,
      createdAt: now,
      expiresAt: expiryDate
    });

    await newUrl.save();

    res.status(201).json({
      shortLink: `https://${req.headers.host}/${shortcode}`,
      expiry: expiryDate.toISOString()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
