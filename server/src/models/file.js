const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fileSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    uploader:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description:{
        type: String
    },
    fileType:{
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } })

const File = mongoose.model('File', fileSchema);
module.exports = File;