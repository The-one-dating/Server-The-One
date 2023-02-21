const mongoose = require('mongoose');
const HashTagsSchema = require('../../Schemas/HashTagsSchema')

const schema = new mongoose.Schema(HashTagsSchema)
const HashTag = mongoose.model("HashTag", schema)

module.exports = HashTag