const mongoose = require('mongoose');
const ProfileSchema = require('../../Schemas/ProfileSchema')

const schema = new mongoose.Schema(ProfileSchema)
const Profile = mongoose.model("PoliticsProfile", schema)

module.exports = Profile