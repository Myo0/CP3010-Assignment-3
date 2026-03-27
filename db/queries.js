const pool = require('./pool');

async function getAllGenres() {
    const result = await pool.query('SELECT * FROM genres ORDER BY name');
    return result.rows;
}

async function getGenreById(id) {
    const genre = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
    const books = await pool.query(
        'SELECT * FROM books WHERE genre_id = $1 ORDER BY title',
        [id]
    );
    return { genre: genre.rows[0], books: books.rows };
}

async function createGenre(name) {
    const result = await pool.query(
        'INSERT INTO genres (name) VALUES ($1) RETURNING *',
        [name]
    );
    return result.rows[0];
}

async function updateGenre(id, name) {
    const result = await pool.query(
        'UPDATE genres SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
    );
    return result.rows[0];
}

async function getGenreBookCount(id) {
    const result = await pool.query(
        'SELECT COUNT(*) FROM books WHERE genre_id = $1',
        [id]
    );
    return parseInt(result.rows[0].count);
}

async function deleteGenre(id) {
    await pool.query('DELETE FROM genres WHERE id = $1', [id]);
}


async function getAllPublishers() {
    const result = await pool.query('SELECT * FROM publishers ORDER BY name');
    return result.rows;
}

async function getPublisherById(id) {
    const publisher = await pool.query('SELECT * FROM publishers WHERE id = $1', [id]);
    const books = await pool.query(
        'SELECT * FROM books WHERE publisher_id = $1 ORDER BY title',
        [id]
    );
    return { publisher: publisher.rows[0], books: books.rows };
}

async function createPublisher(name, country) {
    const result = await pool.query(
        'INSERT INTO publishers (name, country) VALUES ($1, $2) RETURNING *',
        [name, country]
    );
    return result.rows[0];
}

async function updatePublisher(id, name, country) {
    const result = await pool.query(
        'UPDATE publishers SET name = $1, country = $2 WHERE id = $3 RETURNING *',
        [name, country, id]
    );
    return result.rows[0];
}

async function getPublisherBookCount(id) {
    const result = await pool.query(
        'SELECT COUNT(*) FROM books WHERE publisher_id = $1',
        [id]
    );
    return parseInt(result.rows[0].count);
}

async function deletePublisher(id) {
    await pool.query('DELETE FROM publishers WHERE id = $1', [id]);
}


async function getAllBooks() {
    const result = await pool.query(
        `SELECT b.*, g.name as genre_name, p.name as publisher_name
         FROM books b
         LEFT JOIN genres g ON b.genre_id = g.id
         LEFT JOIN publishers p ON b.publisher_id = p.id
         ORDER BY b.title`
    );
    return result.rows;
}

async function getBookById(id) {
    const result = await pool.query(
        `SELECT b.*, g.name as genre_name, p.name as publisher_name
         FROM books b
         LEFT JOIN genres g ON b.genre_id = g.id
         LEFT JOIN publishers p ON b.publisher_id = p.id
         WHERE b.id = $1`,
        [id]
    );
    return result.rows[0];
}

async function createBook(title, author, type, volume, price, stock, description, genre_id, publisher_id) {
    const result = await pool.query(
        `INSERT INTO books (title, author, type, volume, price, stock, description, genre_id, publisher_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [title, author, type,
         volume || null,
         price || null,
         stock || 0,
         description || null,
         genre_id || null,
         publisher_id || null]
    );
    return result.rows[0];
}

async function updateBook(id, title, author, type, volume, price, stock, description, genre_id, publisher_id) {
    const result = await pool.query(
        `UPDATE books SET title=$1, author=$2, type=$3, volume=$4, price=$5,
         stock=$6, description=$7, genre_id=$8, publisher_id=$9
         WHERE id=$10 RETURNING *`,
        [title, author, type,
         volume || null,
         price || null,
         stock || 0,
         description || null,
         genre_id || null,
         publisher_id || null,
         id]
    );
    return result.rows[0];
}

async function deleteBook(id) {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
}

module.exports = {
    getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre, getGenreBookCount,
    getAllPublishers, getPublisherById, createPublisher, updatePublisher, deletePublisher, getPublisherBookCount,
    getAllBooks, getBookById, createBook, updateBook, deleteBook
};
