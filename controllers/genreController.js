const db = require('../db/queries');

async function listGenres(req, res) {
    try {
        var genres = await db.getAllGenres();
        // get book count for each genre
        var genresWithCount = await Promise.all(genres.map(async (g) => {
            var count = await db.getGenreBookCount(g.id);
            return { ...g, book_count: count };
        }));
        res.render('genres/index', { genres: genresWithCount });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function getGenre(req, res) {
    try {
        var data = await db.getGenreById(req.params.id);
        if (!data.genre) return res.status(404).send('Genre not found');
        res.render('genres/detail', { genre: data.genre, books: data.books, error: req.query.error || null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showCreateForm(req, res) {
    res.render('genres/form', { genre: null, error: null });
}

async function createGenre(req, res) {
    var { name } = req.body;
    if (!name || name.trim() === '') {
        return res.render('genres/form', { genre: null, error: 'Genre name is required.' });
    }
    try {
        await db.createGenre(name.trim());
        res.redirect('/genres');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showEditForm(req, res) {
    try {
        var data = await db.getGenreById(req.params.id);
        if (!data.genre) return res.status(404).send('Genre not found');
        res.render('genres/form', { genre: data.genre, error: req.query.error || null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function updateGenre(req, res) {
    var id = req.params.id;
    var { name, admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.redirect('/genres/' + id + '/edit?error=wrong_password');
    }

    if (!name || name.trim() === '') {
        var data = await db.getGenreById(id);
        return res.render('genres/form', { genre: data.genre, error: 'Genre name is required.' });
    }

    try {
        await db.updateGenre(id, name.trim());
        res.redirect('/genres/' + id);
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function deleteGenre(req, res) {
    var id = req.params.id;
    var { admin_password } = req.body;

    try {
        var count = await db.getGenreBookCount(id);
        if (count > 0) {
            return res.redirect('/genres/' + id + '?error=has_books');
        }

        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.redirect('/genres/' + id + '?error=wrong_password');
        }

        await db.deleteGenre(id);
        res.redirect('/genres');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

module.exports = { listGenres, getGenre, showCreateForm, createGenre, showEditForm, updateGenre, deleteGenre };
