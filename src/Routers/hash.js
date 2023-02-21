const express = require("express")
const HashTags = require("../Classs/Romantic/HashTags")
const SportHashTags = require("../Classs/Sport/SportHashTags")
const BusinessHashTags = require("../Classs/Business/BusinessHashTags")
const PoliticsHashTags = require("../Classs/Politics/PoliticsHashTags")
const Profile = require("../Classs/Romantic/Profile")
const SportProfile = require("../Classs/Sport/SportProfile")
const BusinessProfile = require("../Classs/Business/BusinessProfile")
const PoliticsProfile = require("../Classs/Politics/PoliticsProfile")
const router = express()

async function getHashByType(type, query, params, extra) {
    extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await HashTags.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportHashTags.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessHashTags.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsHashTags.findOne(query, extra, params).catch(err => console.log(err))
    }
}

async function getProfileByType(type, query, params, extra) {
    extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await Profile.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportProfile.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessProfile.findOne(query, extra, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsProfile.findOne(query, extra, params).catch(err => console.log(err))
    }
}

router.post('/', function (req, res) {
    getPosts(req.body.text, req.type, res)
})

async function getPosts(text, type, res) {
    const hashTag = await getHashByType(type, { text: text })
    let result = []
    for (i = 0; i < hashTag.posts.length; i++) {
        const user = await getProfileByType(type, { _id: hashTag.posts[i].id }, "posts commentsMap groupCommentsMap reels")
        let post = undefined
        let next = false
        for (j = 0; j < user.posts.length; j++) {
            if (user.posts[j] == undefined) { continue }
            if (user.posts[j]._id == hashTag.posts[i].postID) {
                post = user.posts[j]
                next = true
                break
            }
        }
        if (!next) {
            for (j = 0; j < user.commentsMap.length; j++) {
                if (user.commentsMap[j] == undefined) { continue }
                if (user.commentsMap[j]._id == hashTag.posts[i].postID) {
                    post = user.commentsMap[j]
                    next = true
                    break
                }
            }
        }
        if (!next) {
            for (j = 0; j < user.groupCommentsMap.length; j++) {
                if (user.groupCommentsMap[j] == undefined) { continue }
                if (user.groupCommentsMap[j]._id == hashTag.posts[i].postID) {
                    post = user.groupCommentsMap[j]
                    next = true
                    break
                }
            }
        }

        if (!next) {
            for (j = 0; j < user.reels.length; j++) {
                if (user.reels[j] == undefined) { continue }
                if (user.reels[j]._id == hashTag.posts[i].postID) {
                    post = {
                        id : user.id,
                        reel: user.reels[j],
                    }
                    next = true
                    break
                }
            }
        }

        if (post != undefined) {
            result.push(post)
        }
    }

    res.send(result)
}

module.exports = router