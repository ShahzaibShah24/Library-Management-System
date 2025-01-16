const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');  // Import the cors package

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Use the cors middleware

mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    year: Number
});

const Book = mongoose.model('Book', bookSchema);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendConfirmationEmail = (book) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@gmail.com',
        subject: 'New Book Entry Confirmation',
        text: `A new book has been added to the library:\n\nTitle: ${book.title}\nAuthor: ${book.author}\nGenre: ${book.genre}\nYear: ${book.year}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};
// Create a new book
app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        sendConfirmationEmail(book);
        res.status(201).send(book);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Read all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.send(books);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Read a single book by ID
app.get('/books/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const book = await Book.findById(_id);
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (e) {
        res.status(500).send(e);
    }
});

// Update a book by ID
app.patch('/books/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const book = await Book.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const book = await Book.findByIdAndDelete(_id);
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





