const db = require('../db/queries');

async function listBooks(req, res) {
    try {
        var books = await db.getAllBooks();
        res.render('books/index', { books });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function getBook(req, res) {
    try {
        var book = await db.getBookById(req.params.id);
        if (!book) return res.status(404).send('Book not found');
        res.render('books/detail', { book });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showCreateForm(req, res) {
    try {
        var genres = await db.getAllGenres();
        var publishers = await db.getAllPublishers();
        res.render('books/form', { book: null, genres, publishers, error: null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function createBook(req, res) {
    var { title, author, type, volume, price, stock, description, genre_id, publisher_id } = req.body;

    if (!title || !author || !type) {
        try {
            var genres = await db.getAllGenres();
            var publishers = await db.getAllPublishers();
            return res.render('books/form', {
                book: req.body,
                genres,
                publishers,
                error: 'Title, author, and type are required.'
            });
        } catch(e) {
            return res.status(500).send('Something went wrong');
        }
    }

    try {
        await db.createBook(title, author, type, volume, price, stock, description, genre_id, publisher_id);
        res.redirect('/books');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showEditForm(req, res) {
    try {
        var book = await db.getBookById(req.params.id);
        if (!book) return res.status(404).send('Book not found');
        var genres = await db.getAllGenres();
        var publishers = await db.getAllPublishers();
        res.render('books/form', { book, genres, publishers, error: req.query.error || null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function updateBook(req, res) {
    var { title, author, type, volume, price, stock, description, genre_id, publisher_id, admin_password } = req.body;
    var id = req.params.id;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.redirect('/books/' + id + '/edit?error=wrong_password');
    }

    if (!title || !author || !type) {
        try {
            var book = await db.getBookById(id);
            var genres = await db.getAllGenres();
            var publishers = await db.getAllPublishers();
            return res.render('books/form', {
                book: { ...req.body, id },
                genres,
                publishers,
                error: 'Title, author, and type are required.'
            });
        } catch(e) {
            return res.status(500).send('Something went wrong');
        }
    }

    try {
        await db.updateBook(id, title, author, type, volume, price, stock, description, genre_id, publisher_id);
        res.redirect('/books/' + id);
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function deleteBook(req, res) {
    var id = req.params.id;
    var { admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.redirect('/books/' + id + '?error=wrong_password');
    }

    try {
        await db.deleteBook(id);
        res.redirect('/books');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

module.exports = { listBooks, getBook, showCreateForm, createBook, showEditForm, updateBook, deleteBook };
