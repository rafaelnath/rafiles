const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let noteSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book:{
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    page:[{
        type: String,
    }],
    content: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } })

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;