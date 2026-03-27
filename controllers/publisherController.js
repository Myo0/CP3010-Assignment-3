const db = require('../db/queries');

async function listPublishers(req, res) {
    try {
        var publishers = await db.getAllPublishers();
        var publishersWithCount = await Promise.all(publishers.map(async (p) => {
            var count = await db.getPublisherBookCount(p.id);
            return { ...p, book_count: count };
        }));
        res.render('publishers/index', { publishers: publishersWithCount });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function getPublisher(req, res) {
    try {
        var data = await db.getPublisherById(req.params.id);
        if (!data.publisher) return res.status(404).send('Publisher not found');
        res.render('publishers/detail', { publisher: data.publisher, books: data.books, error: req.query.error || null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showCreateForm(req, res) {
    res.render('publishers/form', { publisher: null, error: null });
}

async function createPublisher(req, res) {
    var { name, country } = req.body;
    if (!name || name.trim() === '') {
        return res.render('publishers/form', { publisher: null, error: 'Publisher name is required.' });
    }
    try {
        await db.createPublisher(name.trim(), country || null);
        res.redirect('/publishers');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function showEditForm(req, res) {
    try {
        var data = await db.getPublisherById(req.params.id);
        if (!data.publisher) return res.status(404).send('Publisher not found');
        res.render('publishers/form', { publisher: data.publisher, error: req.query.error || null });
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function updatePublisher(req, res) {
    var id = req.params.id;
    var { name, country, admin_password } = req.body;

    if (admin_password !== process.env.ADMIN_PASSWORD) {
        return res.redirect('/publishers/' + id + '/edit?error=wrong_password');
    }

    if (!name || name.trim() === '') {
        var data = await db.getPublisherById(id);
        return res.render('publishers/form', { publisher: data.publisher, error: 'Publisher name is required.' });
    }

    try {
        await db.updatePublisher(id, name.trim(), country || null);
        res.redirect('/publishers/' + id);
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

async function deletePublisher(req, res) {
    var id = req.params.id;
    var { admin_password } = req.body;

    try {
        var count = await db.getPublisherBookCount(id);
        if (count > 0) {
            return res.redirect('/publishers/' + id + '?error=has_books');
        }

        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.redirect('/publishers/' + id + '?error=wrong_password');
        }

        await db.deletePublisher(id);
        res.redirect('/publishers');
    } catch(err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
}

module.exports = { listPublishers, getPublisher, showCreateForm, createPublisher, showEditForm, updatePublisher, deletePublisher };
