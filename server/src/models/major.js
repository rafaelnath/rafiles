const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const majorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    classes:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Class',
        }
    ]
})

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;