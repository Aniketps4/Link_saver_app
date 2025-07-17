
// /link-saver-app/server/routes/bookmarks.js
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../db/database');
const router = express.Router();

const SECRET_KEY = 'your-secret-key';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/', authenticate, async (req, res) => {
  const { url } = req.body;
  try {
    // Fetch title and favicon
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('title').text() || 'No title';
    const favicon = $('link[rel="icon"]').attr('href') || '/favicon.ico';
    const faviconUrl = favicon.startsWith('http') ? favicon : new URL(favicon, url).href;

    // Fetch summary from Jina AI
    let summary = 'Summary temporarily unavailable.';
    try {
      const encodedUrl = encodeURIComponent(url); // Encode the full URL
      const apiResponse = await axios.get(`https://r.jina.ai/${encodedUrl}`); // Corrected API URL
      console.log('Jina AI response:', apiResponse.data); // Debug log
      summary = apiResponse.data.slice(0, 200); // Trim to 200 chars
    } catch (apiError) {
      console.error('Jina AI API error:', apiError.message);
    }

    db.run(
      `INSERT INTO bookmarks (userId, url, title, favicon, summary) VALUES (?, ?, ?, ?, ?)`,
      [req.userId, url, title, faviconUrl, summary],
      (err) => {
        if (err) return res.status(400).json({ error: 'Failed to save bookmark' });
        res.status(201).json({ message: 'Bookmark saved' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticate, (req, res) => {
  db.all(`SELECT * FROM bookmarks WHERE userId = ?`, [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

router.delete('/:id', authenticate, (req, res) => {
  db.run(`DELETE FROM bookmarks WHERE id = ? AND userId = ?`, [req.params.id, req.userId], (err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ message: 'Bookmark deleted' });
  });
});

module.exports = router;