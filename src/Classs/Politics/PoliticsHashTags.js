const mongoose = require('mongoose');
const HashTagsSchema = require('../../Schemas/HashTagsSchema')

const schema = new mongoose.Schema(HashTagsSchema)
const HashTag = mongoose.model("PoliticsHashTags", schema)

module.exports = HashTag