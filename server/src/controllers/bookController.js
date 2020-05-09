const Book = require('../models/book');
const mongoose = require('mongoose');
const fs = require('fs');

const filepath = './uploads/textbooks'

module.exports = {
    upload(req, res) {
        console.log(req);
        let data = req.files.file;
        let allowedTypes = ['application/pdf'];

        if (!allowedTypes.includes(data.mimetype)) {
            res.status(400).json({ message: 'only PDFs are allowed' });
            return;
        }

        const time = new Date().getTime();
        const filename = `${time}_${data.name}`

        data.mv(`${filepath}/${filename}`, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json({
                    message: 'got your file!',
                    fileName: filename,
                    fileSize: data.size
                })
            }
        })
    },
    create(req, res) {
        Book.findOne({ title: req.body.title })
            .then(bookfound => {
                if (bookfound) {
                    throw new Error('book title taken')
                } else {
                    Book.create({
                        title: req.body.title,
                        author: req.body.author,
                        description: req.body.description,
                        size: req.body.size,
                        filename: req.body.filename,
                    })
                        .then(newbook => {
                            res.status(200).json({
                                msg: 'book uploaded!',
                                book: newbook
                            })
                        })
                        .catch(err => {
                            res.status(400).json({
                                msg: err.message
                            });
                        })
                }
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    findAll(req, res) {
        Book.find({})
            .then(books => {
                res.status(200).json({
                    data: books
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                })
            })
    },
    findOne(req, res) {
        Book.findById(req.query.id)
            .then(book => {
                res.status(200).json({
                    data: book
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                })
            })
    },
    find(req, res) {
        Book.find({
            $or: [
                { title: { $regex: req.query.search, $options: "i" } },
                { author: { $regex: req.query.search, $options: "i" } },
            ]
        })
            .then(book => {
                res.status(200).json({
                    data: book
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                })
            })
    },
    update(req, res) {
        console.log(req);
        Book.findOne({ title: req.body.title }).then((result) => {
            if (result._id.toString() === req.body.bookId) {
                let updateObj = {
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description,
                    filename: req.body.filename,
                    size: req.body.size
                }

                Book.findByIdAndUpdate(req.body.bookId, updateObj)
                    .then(updatedBook => {
                        res.status(200).json(updatedBook);
                    })
                    .catch(err => {
                        res.status(400).json({ msg: err.message });
                    })
            } else {
                throw new Error('book title used, please change it.');
            }
        }).catch(err => {
            res.status(400).json({ msg: err.message });
        })
    },
    deleteBookFile(req, res){
        console.log(req);
        const filename = req.query.name;
        // const filename = req.body.name;
        fs.unlink(`${filepath}/${filename}`, (err) =>{
            if (err) {
                res.status(500).json({
                    msg: err
                })
            } else{
                res.status(200).json({
                    msg: `${filename} was deleted.`
                })
            }
        })
    },
    addCourse(req, res) {
        Book.findByIdAndUpdate(req.body.bookId, { $push: { courses: req.body.courseId } })
            .then(book => {
                res.status(200).json({
                    msg: 'course added',
                    data: book
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    removeCourse(req, res) {
        Book.findByIdAndUpdate(req.body.bookId, { $pull: { courses: req.body.courseId } })
            .then(book => {
                res.status(200).json({
                    msg: 'course removed',
                    data: book
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    download(req, res) {
        Book.findById(req.query.id)
            .then(book => {
                const link = `${filepath}/${book.filename}`
                res.download(link);
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    deletebook(req, res) {
        Book.findByIdAndDelete(req.query.id)
            .then(deletedbook => {
                res.status(200).json({
                    msg: 'book deleted',
                    data: deletedbook
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
}