const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const characterSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    class: {type: String, required: true, unique: true},
    level: {type: Number, required: true},
    userId: {type: String, required: true}
});

characterSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Character', characterSchema);