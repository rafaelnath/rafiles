const Class = require('../models/class');
const User = require('../models/user');
const Course = require('../models/course');
const mongoose = require('mongoose');

module.exports = {
    createClass(req, res) {
        Class.findOne({ name: req.body.name, major: req.body.majorId}).then(result => {
            if (result) {
                throw new Error('class already exist.')
            } else {
                Class.create({
                    name: req.body.name,
                    major: req.body.majorId,
                    majorName: req.body.majorName,
                }).then(result => {
                    res.status(200).json(result);
                }).catch(err => {
                    res.status(400).json({ msg: err.message });
                })
            }
        }).catch(err => {
            res.status(400).json({ msg: err.message });
        })
    },
    pushMajorName(req, res){
        Class.findByIdAndUpdate(req.body.id, {majorName: req.body.majorName})
            .then(result =>{
                res.status(200).json(result)
            })
            .catch(err =>{
                res.status(500).json({msg: err.message});
            })
    },
    findAll(req, res) {
        Class.find({})
            .populate('monitor', 'name')
            .populate('users', 'name role')
            .populate('courses', 'name')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json(err);
            })
    },
    findOne(req, res) {
        console.log(req.query.id)
        Class.findById(req.query.id)
            .populate('major', 'name')
            .populate('monitor', 'name')
            .populate('users', 'name role')
            .populate('requests', 'name role')
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json(err);
            })
    },
    find(req, res) {
        if (req.body.filter === "name") {
            Class.find({ name: { $regex: req.body.name, $options: "i" } })
                .populate('monitor', 'name')
                .populate('users', 'name role')
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    res.status(400).json(err);
                })
        } else if (req.body.filter === "year") {
            Class.find({ year: req.body.year })
                .populate('monitor', 'name')
                .populate('users', 'name role')
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    res.status(400).json(err);
                })
        }
    },
    update(req, res) {
        Class.findOne({ name: req.body.name, year: req.body.year }).then(result => {
            if (result) {
                throw new Error(`class name already exist.`)
            } else {
                let updateObj = {
                    name: req.body.name,
                    year: req.body.year
                }
                Class.findByIdAndUpdate(req.body.classId, updateObj)
                    .then(updatedClass => {
                        res.status(200).json(updatedClass);
                    })
                    .catch(err => {
                        res.status(400).json({ msg: err.message });
                    })
            }
        }).catch(err => {
            res.status(400).json({ msg: err.message });
        })
    },
    requestJoin(req, res) {
        let userId = mongoose.Types.ObjectId(req.body.userId);
        Class.findById(req.body.classId)
            .then(result => {
                if (result.requests.includes(userId)) {
                    throw new Error(`user already on the request list`);
                } else {
                    User.findById(req.body.userId)
                        .then(userfound => {
                            if (userfound.role == 'student') {
                                if (userfound.class.length !== 0) {
                                    throw new Error('Student can only have one class')
                                } else {
                                    Class.findByIdAndUpdate(req.body.classId, { $push: { requests: req.body.userId } })
                                        .then(result => {
                                            res.status(200).json({
                                                msg: 'class requested',
                                                data: result
                                            })
                                        })
                                        .catch(err => {
                                            res.status(500).json({
                                                msg: err.message
                                            })
                                        })
                                }
                            }
                            else if (userfound.role == 'teacher') {
                                Class.findByIdAndUpdate(req.body.classId, { $push: { requests: req.body.userId } })
                                    .then(result => {
                                        res.status(200).json({
                                            msg: 'class requested',
                                            data: result
                                        })
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            msg: err.message
                                        })
                                    })
                            }
                            // if (user.class) {
                            //     throw new Error('user already joined a class')
                            // } else {
                            //     Class.findByIdAndUpdate(req.body.classId, { $push: { requests: req.body.userId } })
                            //         .then(requestedClass => {
                            //             res.status(200).json({
                            //                 msg: 'request sent.',
                            //                 data: requestedClass
                            //             })
                            //         })
                            //         .catch(err => {
                            //             res.status(400).json({ msg: err.message });
                            //         })
                            // }
                        }).catch(err => {
                            res.status(400).json({ msg: err.message });
                        })
                }
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },
    addCourse(req, res) {
        Class.findById(req.body.classId)
            .then(classfound => {
                if (classfound.courses.includes(req.body.courseId)) {
                    throw new Error('class already had this course')
                } else {
                    Class.findByIdAndUpdate(req.body.classId, { $push: { courses: req.body.courseId } })
                        .then(updatedClass => {
                            res.status(200).json({
                                msg: 'courses added',
                                data: updatedClass
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
    removeCourse(req, res) {
        Class.findByIdAndUpdate(req.body.classId, { $pull: { courses: req.body.courseId } })
            .then(updatedClass => {
                Course.findByIdAndUpdate(req.body.courseId, { $pull: { class: req.body.classId } })
                    .then(removedCourse => {
                        res.status(200).json({
                            msg: 'course removed.',
                            user: removedCourse,
                            updatedClass: updatedClass
                        })
                    })
                    .catch(err => {
                        res.status(400).json({ msg: err.message });
                    })
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },
    addUser(req, res) {
        Class.findByIdAndUpdate(req.body.classId, { $push: { users: req.body.userId } })
            .then(updatedClass => {
                let userId = mongoose.Types.ObjectId(req.body.userId);
                if (updatedClass.requests.includes(userId)) {
                    Class.findByIdAndUpdate(req.body.classId, { $pull: { requests: userId } })
                        .then(result => {
                            res.status(200).json({
                                msg: 'user added.',
                                data: updatedClass
                            })
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        })
                } else {
                    res.status(200).json({
                        msg: 'user added.',
                        data: updatedClass
                    })
                }
            }).catch(err => {
                res.status(400).json(err);
            })
    },
    removeUser(req, res) {
        Class.findByIdAndUpdate(req.body.classId, { $pull: { users: req.body.userId } })
            .then(updatedClass => {
                res.status(200).json({
                    msg: 'user removed.',
                    data: updatedClass
                })
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },
    rejectUser(req, res) {
        Class.findByIdAndUpdate(req.body.classId, { $pull: { requests: req.body.userId } })
            .then(updatedClass => {
                res.status(200).json({
                    msg: 'user removed.',
                    data: updatedClass
                })
            })
            .catch(err => {
                res.status(400).json({ msg: err.message });
            })
    },
    setMonitor(req, res) {
        User.findByIdAndUpdate(req.body.userId, { classRole: 'monitor' })
            .then(user => {
                Class.findByIdAndUpdate(req.body.classId, { $push: { monitor: req.body.userId } })
                    .then(updatedClass => {
                        res.status(200).json({
                            msg: 'monitor added successfully',
                            class: updatedClass
                        })
                    }).catch(err => {
                        res.status(400).json(err);
                    })
            }).catch(err => {
                res.status(400).json(err);
            })
    },
    delete(req, res) {
        Class.findByIdAndDelete(req.body.classId)
            .then(deletedClass => {
                if (deletedClass.users.length === 0) {
                    res.status(200).json({
                        msg: 'class deleted successfully.',
                        deletedClass: deletedClass
                    })
                } else {
                    let userId = deletedClass.users;

                    User.updateMany({ _id: userId }, { class: null })
                        .then(user => {
                            res.status(200).json({
                                msg: 'class deleted successfully',
                                deletedClass: deletedClass
                            })
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        })
                }
            })
            .catch(err => {
                res.status(400).json(err);
            })
    }
}