const User = require('../models/user');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
    register(req, res) {

        User.findOne({ email: req.body.email }).then((result) => {
            if (result) {
                throw new Error('email already exist');
            } else {
                const time = new Date().getTime();
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: req.body.role,
                    nationality: req.body.nationality,
                    gender: req.body.gender,
                    birthdate: req.body.birthdate,
                    displaypic: `displaypics/${time}_${req.body.name}.png`,
                    // birthdate: req.body.birthdate,
                })
                    .then(user => {
                        fs.writeFile(`./uploads/displaypics/${time}_${req.body.name}.png`, req.body.upic, { encoding: 'base64' }, (err) => {
                            console.log(`file created`);
                        });
                        res.status(201).json(user);
                    }).catch(err => {
                        res.status(404).json({ msg: err.message });
                    });
            }
        }).catch(err => {
            res.status(400).json({ msg: err.message });
        })
    },

    adminlogin(req, res){
        if(req.body.uname !== process.env.ADMIN_UNAME){
            res.status(400).json({msg:`Incorrect username.`})
        } else if(req.body.pwd !== process.env.ADMIN_PASSWORD){
            res.status(400).json({msg: `Incorrect password.`})
        } else{
            let token = jwt.sign({uname: process.env.ADMIN_UNAME, pwd: process.env.ADMIN_PASSWORD}, process.env.ADMIN_SECRET_KEY);
            res.status(200).json({token})
        }
    },

    login(req, res) {
        User.findOne({ email: req.body.email }).then(userFound => {
            if (!userFound) {
                throw new Error("account doesn't exist.");
            } else {
                if (bcrypt.compare(req.body.password, userFound.password) === false) {
                    throw new Error("incorrect password.");
                }
                else {
                    let token = jwt.sign({ userFound }, process.env.SECRET_KEY);
                    res.status(200).json({
                        token,
                        msg: `welcome ${userFound.name}`,
                        userId: userFound._id,
                        role: userFound.role
                    })
                }
            }
        }).catch(err => {
            res.status(500).json({
                msg: err.message
            })
        })
    },
    findAll(req, res) {
        User.find({})
            .populate('class', 'name')
            .then(users => {
                res.status(200).json(users);
            }).catch(err => {
                res.status(400).json(err);
            })
    },
    findOne(req, res) {
        User.findById(req.query.id)
            // .populate('course', 'name ')
            .populate('class')
            .populate('backpack')
            .then(user => {
                res.status(200).json(user)
            }).catch(err => {
                res.status(400).json(err);
            })
    },
    find(req, res) {
        User.find({
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(400).json(err)
            })
    },
    update(req, res) {
        User.findOne({ email: req.body.email }).then((result) => {
            let updateObj = {
                name: req.body.name,
                email: req.body.email,
                nationality: req.body.nationality,
                gender: req.body.gender,
                birthdate: req.body.birthdate
            }
            if (result) {
                if (result._id.toString() === req.body.userId) {
                    User.findByIdAndUpdate(req.body.userId, updateObj)
                        .then(updatedUser => {
                            res.status(200).json(updatedUser);
                        })
                        .catch(err => {
                            res.status(400).json({ msg: err.message });
                        })
                } else {
                    throw new Error(`Sorry, that email address is already used! :(`);
                }
            } else {
                User.findByIdAndUpdate(req.body.userId, updateObj)
                    .then(updatedUser => {
                        res.status(200).json(updatedUser);
                    })
                    .catch(err => {
                        res.status(400).json({ msg: err.message });
                    })
            }
        }).catch(err => {
            res.status(400).json({ msg: err.message });
        })
    },
    updatePic(req, res) {
        const time = new Date().getTime();
        let filename = `displaypics/${time}_${req.body.uname}.png`
        fs.writeFile(`./uploads/${filename}`, req.body.newpic, { encoding: 'base64' }, (err) => {
            if (err) {
                res.status(400).json(err)
            } else {
                console.log(`file created`);
                User.findByIdAndUpdate(req.body.id, { displaypic: filename })
                    .then(() => {
                        if (req.body.oldpic) {
                            fs.unlink(`./uploads/${req.body.oldpic}`, (err) => {
                                if (err) {
                                    res.status(500).json({
                                        msg: err
                                    })
                                } else {
                                    console.log(`user's old pic deleted :)`);
                                    res.status(200).json({ msg: `display pic updated!` });
                                }
                            });
                        } else {
                            res.status(200).json({ msg: `display pic updated!` });
                        }

                    }).catch(err => {
                        res.status(400).json({ msg: err.message });
                    })
            }
        });
    },
    changePassword(req, res) {
        User.findById(req.body.userId)
            .then(user => {
                if (bcrypt.compare(req.body.oldPassword, user.password)) {
                    let encryptedPassword = bcrypt.encrypt(req.body.newPassword);
                    let newPasswordObj = {
                        password: encryptedPassword
                    }

                    User.findByIdAndUpdate(req.body.userId, newPasswordObj)
                        .then(updatedUser => {
                            res.status(200).json(updatedUser);
                        }).catch(err => {
                            throw new Error(err);
                        })
                } else {
                    throw new Error('Current password incorrect!');
                }
            }).catch(err => {
                res.status(400).json({ msg: err.message })
            })
    },
    addBook(req, res) {
        User.findById(req.body.userId).then(user => {
            if (user.backpack.includes(req.body.bookId)) {
                throw new Error("You already have this book in your backpack.")
            } else {
                User.findByIdAndUpdate(req.body.userId, { $push: { backpack: req.body.bookId } })
                    .then(userfound => {
                        res.status(200).json({
                            msg: 'book added',
                            data: userfound
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            msg: err.message
                        })
                    })
            }
        })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                })
            })
    },
    removeBook(req, res) {
        User.findByIdAndUpdate(req.body.userId, { $pull: { backpack: req.body.bookId } })
            .then(user => {
                res.status(200).json({
                    msg: 'book removed',
                    data: user
                })
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.message
                })
            })
    },
    addClass(req, res) {
        User.findById(req.body.userId)
            .then(userfound => {
                if (userfound.role == 'student') {
                    if (userfound.class.length !== 0) {
                        throw new Error('Student can only have one class')
                    } else {
                        User.findByIdAndUpdate(req.body.userId, { $push: { class: req.body.classId }, className: req.body.className })
                            .then(user => {
                                res.status(200).json({
                                    msg: 'class added',
                                    data: user
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
                    User.findByIdAndUpdate(req.body.userId, { $push: { class: req.body.classId }, className: req.body.className })
                        .then(user => {
                            res.status(200).json({
                                msg: 'class added',
                                data: user
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                msg: err.message
                            })
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },
    removeClass(req, res) {
        User.findByIdAndUpdate(req.body.userId, { $pull: { class: req.body.classId } })
            .then(user => {
                res.status(200).json({
                    msg: 'class removed',
                    data: user
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    addCourse(req, res) {
        User.findByIdAndUpdate(req.body.userId, { $push: { courses: req.body.courseId } })
            .then(user => {
                res.status(200).json({
                    msg: 'course added',
                    data: user
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    removeCourse(req, res) {
        User.findByIdAndUpdate(req.body.userId, { $pull: { courses: req.body.courseId } })
            .then(user => {
                res.status(200).json({
                    msg: 'course removed',
                    data: user
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    delete(req, res) {
        User.findByIdAndDelete(req.query.id)
            .then(deletedUser => {
                res.status(200).json(deletedUser);
            })
            .catch(err => {
                res.status(400).json(err);
            })
    }
}