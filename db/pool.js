const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: '/var/run/postgresql',
    database: 'manga_inventory',
    user: process.env.DB_USER || 'hgengine',
});

module.exports = pool;
