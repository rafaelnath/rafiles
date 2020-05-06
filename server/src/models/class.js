const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let classSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    major: {
        type: Schema.Types.ObjectId,
        ref: 'Major',
        required: true,
    },
    majorName:{
        type: String
    },
    courses:[{
        type: Schema.Types.ObjectId, ref: 'Course'
    }],
    users:[{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    requests:[{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    monitor:[{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
}, { timestamps: { createdAt: 'created_at' } })

const Class = mongoose.model('Class', classSchema);

module.exports = Class;