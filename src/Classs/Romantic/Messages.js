const mongoose = require('mongoose');
const MessagesSchema = require('../../Schemas/MessagesSchema')

const schema = new mongoose.Schema(MessagesSchema)
const Messages = mongoose.model("Messages", schema)

module.exports = Messages