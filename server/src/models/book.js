const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bookSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String
    },
    description:{
        type: String
    },
    size: {
        type: String,
        required: true
    },
    filename:{
        type: String,
        required: true
    },
    courses:[{
        type: Schema.Types.ObjectId,
        ref: 'Course',
    }]
}, { timestamps: { createdAt: 'created_at' } })

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;