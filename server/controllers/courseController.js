const Class = require('../models/class');
const Course = require('../models/course');
const User = require('../models/user');
const mongoose = require('mongoose');

function updateCourseAndClass(res, coursename, classId) {
    Course.findOneAndUpdate({ name: coursename }, { $push: { class: classId } })
        .then((result) => {
            Class.findByIdAndUpdate(classId, { $push: { courses: result._id } })
                .then(() => {
                    res.status(200).json({
                        msg: 'new course created.',
                        course: result
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        msg: err.message
                    });
                })
        })
        .catch(err => {
            res.status(400).json({
                msg: err.message
            });
        })
}

module.exports = {
    createCourse(req, res) {
        Course.findOne({ name: req.body.name, class: req.body.classId })
            .then(coursefound => {
                if (coursefound) {
                    throw new Error('course name already used in this class.')
                } else {
                    Course.create({
                        name: req.body.name
                    })
                        .then(newcourse => {
                            updateCourseAndClass(res, newcourse.name, req.body.classId);
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
        Course.find({})
            .populate('class', 'name majorName')
            .populate('users', 'name')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    findByClass(req, res) {
        Course.find({ class: req.query.cId })
            .populate('users', 'name role')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    findOne(req, res) {
        Course.findById(req.query.id)
            // .populate('class', 'name major majorName users')
            .populate('class', 'name major majorName')
            .populate({
                path:'class',
                populate:{
                    path:'users'
                }
            })
            .populate('books', 'title author description')
            .populate('requests', 'name role')
            .populate('users', 'name role')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    find(req, res) {
        Course.find({ name: { $regex: req.query.search, $options: "i" } })
            .populate('class', 'name majorName')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },

    requestJoin(req, res) {
        let userId = mongoose.Types.ObjectId(req.body.userId);
        Course.findById(req.body.courseId)
            .then(result => {
                if (result.requests.includes(userId)) {
                    throw new Error(`user already on the request list`);
                } else {
                    Course.findByIdAndUpdate(req.body.courseId, { $push: { requests: req.body.userId } })
                        .then(requestedCourse => {
                            res.status(200).json({
                                msg: 'request sent.',
                                data: requestedCourse
                            })
                        })
                        .catch(err => {
                            res.status(400).json({ msg: err.message });
                        })
                }
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },
    addUser(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $push: { users: req.body.userId } })
            .then(updatedCourse => {
                let userId = mongoose.Types.ObjectId(req.body.userId);
                if (updatedCourse.requests.includes(userId)) {
                    Course.findByIdAndUpdate(req.body.courseId, { $pull: { requests: userId } })
                        .then(() => {
                            res.status(200).json({
                                msg: 'user added.',
                                data: updatedCourse
                            })
                        })
                        .catch(err => {
                            res.status(400).json({
                                msg: err.message
                            });
                        })
                } else {
                    res.status(200).json({
                        msg: 'user added.',
                        data: updatedCourse
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },
    removeUser(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $pull: { users: req.body.userId } })
            .then(updatedCourse => {
                res.status(200).json({
                    msg: 'user removed.',
                    updatedClass: updatedCourse
                })
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },

    rejectUser(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $pull: { requests: req.body.userId } })
            .then(updatedCourse => {
                res.status(200).json({
                    msg: 'user rejected.',
                    updatedClass: updatedCourse
                })
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },

    addBook(req, res) {
        Course.findOne({ books: req.body.bookId })
            .then(course => {
                if (course) {
                    throw new Error(`Book's already exists.`)
                } else {
                    Course.findByIdAndUpdate(req.body.courseId, { $push: { books: req.body.bookId } })
                        .then(course => {
                            res.status(200).json({
                                msg: 'book added',
                                data: course
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
    removeBook(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $pull: { books: req.body.bookId } })
            .then(course => {
                res.status(200).json({
                    msg: 'book removed',
                    data: course
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },

    removeManyBook(req, res) {
        Course.updateMany({ _id: req.body.courseId }, { $pull: { books: req.body.bookId } })
            .then(course => {
                res.status(200).json({
                    msg: 'book removed',
                    data: course
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },

    addClass(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $push: { class: req.body.classId } })
            .then(course => {
                res.status(200).json({
                    msg: 'class added',
                    data: course
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },

    removeClass(req, res) {
        Course.findByIdAndUpdate(req.body.courseId, { $pull: { class: req.body.classId } })
            .then(course => {
                res.status(200).json({
                    msg: 'class removed',
                    data: course
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                });
            })
    },

    delete(req, res) {
        Course.findByIdAndDelete(req.query.id)
            .then(deletedCourse => {
                if (deletedCourse.users.length !== 0 && deletedCourse.class.length !== 0) {
                    let p1 = User.updateMany({ _id: deletedCourse.users }, { $pull: { courses: req.body.courseId } });
                    let p2 = Class.updateMany({ _id: deletedCourse.class }, { $pull: { courses: req.body.courseId } });

                    Promise.all([p1, p2])
                        .then(result => {
                            res.status(200).json({
                                msg: 'course deleted',
                                data: result
                            });
                        })
                        .catch(err => {
                            res.status(400).json({
                                msg: err.message
                            })
                        })

                } else if (deletedCourse.users.length !== 0 && deletedCourse.class.length === 0) {
                    let userId = deletedCourse.users;

                    User.updateMany({ _id: userId }, { $pull: { courses: req.body.courseId } })
                        .then(() => {
                            res.status(200).json({
                                msg: 'course deleted',
                                data: deletedCourse
                            })
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        })

                } else if (deletedCourse.users.length === 0 && deletedCourse.class.length !== 0) {
                    let classId = deletedCourse.class;

                    Class.updateMany({ _id: classId }, { $pull: { courses: req.body.courseId } })
                        .then(() => {
                            res.status(200).json({
                                msg: 'course deleted',
                                data: deletedCourse
                            })
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        })
                } else {
                    res.status(200).json({
                        msg: 'course deleted',
                        data: deletedCourse
                    })
                }
            })
            .catch(err => {
                res.status(400).json(err);
            })
    }
}