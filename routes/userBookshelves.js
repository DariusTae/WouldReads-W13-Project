const express = require('express');
const { userBook, Book, Bookshelf, Author, authorBooks } = require('../db/models');
const { check } = require('express-validator');
const { asyncHandler, handleValidationErrors } = require("../utils");
const { requireAuth } = require('../auth.js')
const user = require('../db/models/user');

const router = express.Router();

router.get("/:id/bookshelves", requireAuth, asyncHandler(async (req, res) => {
    const userBooks = await userBook.findAll({
        where: { userId: req.params.id },
        include: { all: true, nested: true }
    })

    let shelves = userBooks.reduce((shelvesObj, book) => {
        if (!Object.keys(shelvesObj).includes(book.Bookshelf.shelfName)) {
            shelvesObj[book.Bookshelf.shelfName] = [];
        }
        shelvesObj[book.Bookshelf.shelfName].push(book);
        return shelvesObj;
    }, {})
    console.log(shelves)
    res.render('user-bookshelves', { shelves, userId:req.params.id })
}));

//uid is userId bid is bookId
router.post('/:uid/books/:bid/status', asyncHandler(async (req, res) => {
    const statusId = req.body.status

    const bookStatus = await userBook.findOne({
        where: [{ bookId: req.params.bid }, { userId: req.params.uid }],
    })

    bookStatus.statusId = statusId
    console.log("book status", bookStatus)
    console.log("bookstatus.id", bookStatus.statusId)
    await bookStatus.save()
    res.redirect(`/users/${req.params.uid}/bookshelves`)
}))

module.exports = router;
