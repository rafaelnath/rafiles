const Note = require('../models/note');
const User = require('../models/user');

module.exports = {
    create(req, res) {
        Note.find({
            author: req.body.userId,
            book: req.body.bookId,
            page: req.body.page
        }).then(result => {
            if (result.length != 0) {
                throw new Error(`Notes already exist on this page.`)
            } else {
                if (!req.body.page) {
                    throw new Error('Page number is missing.')
                } else {
                    Note.create({
                        title: req.body.title,
                        author: req.body.userId,
                        book: req.body.bookId,
                        content: req.body.content
                    })
                        .then(newNote => {
                            Note.findByIdAndUpdate(newNote._id, { $push: { page: req.body.page } })
                                .then(note => {
                                    res.status(201).json(note);
                                })
                                .catch(err => {
                                    res.status(400).json({ msg: err.message });
                                });
                        })
                        .catch(err => {
                            res.status(400).json({ msg: err.message });
                        });
                }
            }
        })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            });
    },
    findAll(req, res) {
        Note.find()
            .populate('author', 'name')
            .sort({ bookName: 1 })
            .then(notes => {
                res.status(200).json(notes);
            }).catch(err => {
                res.status(400).json(err.message);
            })
    },
    findOne(req, res) {
        Note.findById(req.query.noteId)
            .then(note => {
                res.status(200).json(note);
            }).catch(err => {
                res.status(400).json(err.message);
            })
    },
    find(req, res) {
        Note.findOne({
            author: req.query.uid,
            page: { $in: req.query.page },
            book: req.query.bid
        }).then(note => {
            res.status(200).json(note);
        }).catch(err => {
            res.status(400).json(err.message);
        })
    },
    // findFromBook(req,res){
    //     Note.findOne({
    //         author: req.query.uid,
    //         bookId: req.query.bid,
    //         page: {$in: req.query.page}
    //     }).then(note =>{
    //         res.status(200).json(note);
    //     }).catch(err =>{
    //         res.status(400).json(err.message);
    //     })
    // },
    update(req, res){
        let noteObj = {
            title: req.body.title,
            content: req.body.content
        }
        Note.findByIdAndUpdate(req.body.nid, noteObj)
            .then(note =>{
                res.status(200).json(note)
            })
            .catch(err =>{
                res.status(400).json({msg: err});
            })
    },
    addPage(req, res) {
        Note.findByIdAndUpdate(req.body.nid, { $push: { page: req.body.page } })
            .then(note => {
                res.status(200).json(note);
            }).catch(err => {
                res.status(400).json(err.message);
            })
    },
    removePage(req, res) {
        Note.findByIdAndUpdate(req.body.nid, { $pull: { page: req.body.page } })
            .then(note => {
                res.status(200).json(note);
            }).catch(err => {
                res.status(400).json(err.message);
            })
    },
    delete(req, res) {
        Note.findByIdAndDelete(req.query.id)
            .then(deletedNote => {
                res.status(200).json(deletedNote);
            }).catch(err => {
                res.status(400).json(err.message);
            })
    }
}