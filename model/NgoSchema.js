const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NgoSchema = new Schema({
    ngoName: { type: String, required: true },
    memberName:{ type: String, required: true },
    memberEmail:{ type: String, required: true },
    memberBloodGroup:{ type: String, required: true }
});

const Ngo = mongoose.model('Ngo', NgoSchema);

module.exports = Ngo;
