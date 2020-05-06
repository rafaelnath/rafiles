const Major = require('../models/major');

module.exports = {
    create(req, res) {
        Major.findOne({ name: req.body.name }).then(result => {
            if (result) {
                throw new Error(`major's name taken, please use another name.`)
            } else {
                Major.create({
                    name: req.body.name
                }).then(result => {
                    res.status(200).json({
                        msg: 'Major created',
                        data: result
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: err.message });
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(400).json({ msg: err.message });
        })
    },
    addClass(req, res) {
        Major.findByIdAndUpdate(req.body.majorId, { $push: { classes: req.body.classId } })
            .then(major => {
                res.status(200).json({
                    msg: `class added`,
                    data: major
                })
            })
            .catch(err => {
                res.status(500).then({
                    msg: err.message
                })
            })
    },
    removeClass(req, res) {
        Major.findByIdAndUpdate(req.body.majorId, { $pull: { classes: req.body.classId } })
            .then(major => {
                res.status(200).json({
                    msg: `class removed`,
                    data: major
                })
            })
            .catch(err => {
                res.status(500).then({
                    msg: err.message
                })
            })
    },
    findAll(req, res) {
        Major.find()
            .populate('classes', 'name')
            .then(major => {
                res.status(200).json({
                    data: major
                })
            })
            .catch(err => {
                res.status(500).then({
                    msg: err.message
                })
            })
    },
    findOne(req, res) {
        Major.findById(req.query.id)
            .populate('classes')
            .then(major => {
                res.status(200).json(major)
            })
            .catch(err => {
                res.status(500).then({
                    msg: err.message
                })
            })
    },
    find(req, res){
        Major.find({name: {$regex: req.query.name, $options: "i"}})
            .populate('classes', 'name')
            .then(major =>{
                res.status(200).json({
                    data: major
                })
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },
    update(req, res){
        Major.findByIdAndUpdate(req.body.majorId, {name: req.body.name})
            .then(major =>{
                res.status(200).json({
                    msg: `major updated`,
                    data: major,
                })
            })
            .catch(err =>{
                res.status(500).json({
                    msg: err.message
                })
            })
    },
    delete(req, res){
        Major.findByIdAndDelete(req.query.id)
            .then(major =>{
                res.status(200).json({
                    msg: `major deleted`,
                    data: major
                })
            })
            .catch(err =>{
                res.status(500).json({
                    msg: err.message
                })
            })
    }
}