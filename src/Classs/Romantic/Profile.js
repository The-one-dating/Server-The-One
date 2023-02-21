const mongoose = require('mongoose');
const ProfileSchema = require('../../Schemas/ProfileSchema')

const schema = new mongoose.Schema(ProfileSchema)
const Profile = mongoose.model("Profile", schema)

module.exports = Profile