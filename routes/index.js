const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res) => {
    try {
        const bookCount = await pool.query('SELECT COUNT(*) FROM books');
        const genreCount = await pool.query('SELECT COUNT(*) FROM genres');
        const publisherCount = await pool.query('SELECT COUNT(*) FROM publishers');
        res.render('index', {
            bookCount: bookCount.rows[0].count,
            genreCount: genreCount.rows[0].count,
            publisherCount: publisherCount.rows[0].count
        });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;
