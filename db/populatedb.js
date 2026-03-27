const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: '/var/run/postgresql',
    database: 'manga_inventory',
    user: process.env.DB_USER || 'hgengine',
});

async function main() {
    console.log('Connecting to database...');

    console.log('Dropping existing tables...');
    await pool.query(`DROP TABLE IF EXISTS books CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS genres CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS publishers CASCADE`);

    console.log('Creating tables...');
    await pool.query(`
        CREATE TABLE genres (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE publishers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            country VARCHAR(100)
        )
    `);

    await pool.query(`
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            type VARCHAR(10) NOT NULL CHECK (type IN ('book', 'manga')),
            volume INTEGER,
            price NUMERIC(10,2),
            stock INTEGER DEFAULT 0,
            description TEXT,
            genre_id INTEGER REFERENCES genres(id),
            publisher_id INTEGER REFERENCES publishers(id)
        )
    `);
    console.log('Tables created.');

    console.log('Inserting genres...');
    var genreNames = ['Action', 'Romance', 'Fantasy', 'Mystery', 'Horror', 'Sci-Fi', 'Slice of Life', 'Thriller'];
    var genreIds = {};
    for (var gname of genreNames) {
        var res = await pool.query('INSERT INTO genres (name) VALUES ($1) RETURNING id', [gname]);
        genreIds[gname] = res.rows[0].id;
    }
    console.log('Genres inserted:', Object.keys(genreIds).join(', '));

    console.log('Inserting publishers...');
    var publisherData = [
        ['Viz Media', 'Japan'],
        ['Penguin Books', 'UK'],
        ['Del Rey', 'USA'],
        ['Kodansha', 'Japan'],
        ['Dark Horse', 'USA'],
        ['Shueisha', 'Japan']
    ];
    var publisherIds = {};
    for (var [pname, pcountry] of publisherData) {
        var res = await pool.query(
            'INSERT INTO publishers (name, country) VALUES ($1, $2) RETURNING id', [pname, pcountry]
        );
        publisherIds[pname] = res.rows[0].id;
    }
    console.log('Publishers inserted:', Object.keys(publisherIds).join(', '));

    console.log('Inserting books and manga...');
    var books = [
        {
            title: 'Berserk', author: 'Kentaro Miura', type: 'manga', volume: 1,
            price: 14.99, stock: 5, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Dark Horse'],
            description: 'A dark fantasy manga following the mercenary Guts and his struggle against demonic forces.'
        },
        {
            title: 'Naruto', author: 'Masashi Kishimoto', type: 'manga', volume: 1,
            price: 9.99, stock: 12, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Viz Media'],
            description: 'A young ninja named Naruto Uzumaki seeks recognition and dreams of becoming the Hokage.'
        },
        {
            title: 'One Piece', author: 'Eiichiro Oda', type: 'manga', volume: 1,
            price: 9.99, stock: 18, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Viz Media'],
            description: 'Monkey D. Luffy sets sail to become the King of the Pirates and find the legendary treasure One Piece.'
        },
        {
            title: 'Attack on Titan', author: 'Hajime Isayama', type: 'manga', volume: 1,
            price: 10.99, stock: 9, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Kodansha'],
            description: 'Humanity fights for survival against giant humanoid creatures called Titans.'
        },
        {
            title: 'Vinland Saga', author: 'Makoto Yukimura', type: 'manga', volume: 1,
            price: 19.99, stock: 6, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Kodansha'],
            description: 'A young Viking warrior seeks revenge for his father\'s death in medieval Europe.'
        },
        {
            title: 'Chainsaw Man', author: 'Tatsuki Fujimoto', type: 'manga', volume: 1,
            price: 9.99, stock: 14, genre_id: genreIds['Action'],
            publisher_id: publisherIds['Viz Media'],
            description: 'Denji merges with his devil dog Pochita to become Chainsaw Man and work as a devil hunter.'
        },
        {
            title: 'Spy x Family', author: 'Tatsuya Endo', type: 'manga', volume: 1,
            price: 9.99, stock: 20, genre_id: genreIds['Slice of Life'],
            publisher_id: publisherIds['Viz Media'],
            description: 'A spy must build a fake family for a mission, not knowing his daughter is a telepath and his wife an assassin.'
        },
        {
            title: 'The Name of the Wind', author: 'Patrick Rothfuss', type: 'book', volume: null,
            price: 16.99, stock: 8, genre_id: genreIds['Fantasy'],
            publisher_id: publisherIds['Penguin Books'],
            description: 'The tale of Kvothe, a legendary wizard, told in his own words — a story of love, loss, and magic.'
        },
        {
            title: 'Dune', author: 'Frank Herbert', type: 'book', volume: null,
            price: 18.99, stock: 11, genre_id: genreIds['Sci-Fi'],
            publisher_id: publisherIds['Penguin Books'],
            description: 'A sweeping science-fiction epic set on the desert planet Arrakis, home of the precious spice melange.'
        },
        {
            title: 'The Hobbit', author: 'J.R.R. Tolkien', type: 'book', volume: null,
            price: 14.99, stock: 15, genre_id: genreIds['Fantasy'],
            publisher_id: publisherIds['Penguin Books'],
            description: 'Bilbo Baggins, a homebody hobbit, is swept into an epic quest to reclaim a dwarven homeland.'
        },
        {
            title: 'IT', author: 'Stephen King', type: 'book', volume: null,
            price: 19.99, stock: 7, genre_id: genreIds['Horror'],
            publisher_id: publisherIds['Penguin Books'],
            description: 'A group of childhood friends must confront an ancient evil shapeshifter haunting the town of Derry.'
        },
        {
            title: 'Neuromancer', author: 'William Gibson', type: 'book', volume: null,
            price: 15.99, stock: 4, genre_id: genreIds['Sci-Fi'],
            publisher_id: publisherIds['Del Rey'],
            description: 'A washed-up computer hacker is hired for one last job in a cyberpunk world where the line between reality and cyberspace blurs.'
        }
    ];

    for (var b of books) {
        await pool.query(
            `INSERT INTO books (title, author, type, volume, price, stock, description, genre_id, publisher_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [b.title, b.author, b.type, b.volume || null, b.price, b.stock, b.description, b.genre_id, b.publisher_id]
        );
        console.log('  Added:', b.title);
    }

    console.log('\nDatabase populated successfully!');
    await pool.end();
    process.exit(0);
}

main().catch(err => {
    console.error('Error populating database:', err);
    pool.end();
    process.exit(1);
});
