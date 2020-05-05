const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('../helpers/bcrypt');
const format = require('date-fns');

let userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    // birthdate: {
    //     type: String,
    //     required: true,
    // },
    class: [{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }],
    className: {
        type:String
    },
    classRole: {
        type: String
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    backpack: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }]
    // notes: Array,
}, { timestamps: { createdAt: 'created_at' } });

userSchema.pre('save', function (next) {
    this.password = bcrypt.encrypt(this.password);
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User