const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const genresRouter = require('./routes/genres');
const publishersRouter = require('./routes/publishers');

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/genres', genresRouter);
app.use('/publishers', publishersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
