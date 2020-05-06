const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let courseSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    class:[{
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }],
    users:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    requests:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    books:[{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    files:[{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }]
}, { timestamps: { createdAt: 'created_at' } })

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;