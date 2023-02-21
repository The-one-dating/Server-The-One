const express = require("express")
const Profile = require("../Classs/Romantic/Profile")
const SportProfile = require("../Classs/Sport/SportProfile")
const BusinessProfile = require("../Classs/Business/BusinessProfile")
const PoliticsProfile = require("../Classs/Politics/PoliticsProfile")
const HashTags = require("../Classs/Romantic/HashTags")
const SportHashTags = require("../Classs/Sport/SportHashTags")
const BusinessHashTags = require("../Classs/Business/BusinessHashTags")
const PoliticsHashTags = require("../Classs/Politics/PoliticsHashTags")
const router = express()

function getHashTagsType(type, params) {
    if (type == "Romantic") {
        return HashTags(params)
    }
    else if (type == "Sport") {
        return SportHashTags(params)
    }
    else if (type == "Business") {
        return BusinessHashTags(params)
    }
    else if (type == "Politics") {
        return PoliticsHashTags(params)
    }
}

async function getHashByType(type, query, params) {
    if (type == "Romantic") {
        return await HashTags.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportHashTags.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessHashTags.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsHashTags.findOne(query, params).catch(err => console.log(err))
    }
}

async function getProfileByType(type, query, params) {
    // extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await Profile.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportProfile.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessProfile.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsProfile.findOne(query, params).catch(err => console.log(err))
    }
}

router.get('/', function (req, res) {
    getPosts(req.query.id, req.query.page, req.query.type, res)
})

router.get('/byID', function (req, res) {
    getPostById(req.query.token, req.query.id, req.query.type, res)
})

router.get('/get', function (req, res) {
    getPost(req.query.id, req.query.type, res)
})

router.get('/likePost', function (req, res) {
    likePost(req.query.id, req.query.postID, req.query.like, req.query.byID, req.query.type, res)
})

router.get('/isLiked', function (req, res) {
    isLiked(req.query.id, req.query.postID, req.query.byID, req.query.type, res)
})

router.post('/post', function (req, res) {
    const audio = req.body.audio != undefined ? {
        signals: req.body.signals,
        url: req.body.audio
    } : undefined

    const post = {
        "text": req.body.text,
        "gif": req.body.gif,
        "video": req.body.video,
        "audio": audio,
        "location": req.body.location,
        "file": req.body.file,
        "tagsIDs": req.body.tagsIDs,
        "urls": req.body.urls,
        "image": req.body.image,
        "timeStemp": Number(req.body.timeStemp),
        "replayToken": req.body.replayToken,
        "replayID": req.body.replayID
    }

    addPost(req.body.hashTags, req.body.id, post, req.body.type, res)
})

async function addHashTags(hashTags, id, type, postID) {
    if (hashTags == undefined) { return }
    const user = await getProfileByType(type, { _id: id }, "posts")
    const hashTagsArray = hashTags.split(",")
    for (let i = 0; i < hashTagsArray.length; i++) {
        const text = hashTagsArray[i]
        let hashTag = await getHashByType(type, { text: text })

        if (hashTag == null || hashTag.text == undefined) {
            hashTag = getHashTagsType(type, {
                text: text,
                posts: [{
                    id: id,
                    postID: postID
                }]
            })
        }
        else {
            hashTag.posts.push(
                {
                    id: id,
                    postID: postID
                }
            )
        }

        hashTag.save()
    }
}

router.post('/comment', function (req, res) {
    const audio = req.body.audio != undefined ? {
        signals: req.body.signals,
        url: req.body.audio
    } : undefined

    const comment = {
        "profileID": req.body.profileID,
        "commentID": req.body.commentID,
        "text": req.body.text,
        "gif": req.body.gif,
        "video": req.body.video,
        "audio": audio,
        "location": req.body.location,
        "file": req.body.file,
        "urls": req.body.urls,
        "image": req.body.image,
        "timeStemp": Number(req.body.timeStemp),
        "replayToken": req.body.replayToken,
        "replayID": req.body.replayID
    }

    addComment(req.body.hashTags, req.body.id, comment, req.b.type, res)
})

router.get('/getComments', function (req, res) {
    getComments(req.query.id, req.query.commentID, req.query.type, res)
})

router.get('/numberOfComments', function (req, res) {
    getNumberOfComments(req.query.id, req.query.commentID, req.query.type, res)
})

router.get('/NumberOfGroupComments', function (req, res) {
    getNumberOfGroupComments(req.query.id, req.query.commentID, req.query.type, res)
})

router.post('/groupComment', function (req, res) {
    const audio = req.body.audio != undefined ? {
        signals: req.body.signals,
        url: req.body.audio
    } : undefined

    comment = {
        "profileID": req.body.profileID,
        "commentID": req.body.commentID,
        "text": req.body.text,
        "video": req.body.video,
        "gif": req.body.gif,
        "audio": audio,
        "location": req.body.location,
        "file": req.body.file,
        "urls": req.body.urls,
        "image": req.body.image,
        "timeStemp": Number(req.body.timeStemp),
        "replayToken": req.body.replayToken,
        "replayID": req.body.replayID
    }

    addGroupComment(req.body.hashTags, req.body.id, comment, req.body.type, res)
})

router.get('/getGroupComments', function (req, res) {
    getGroupComments(req.query.id, req.query.commentID, req.query.type, res)
})

async function getPosts(id, p, type, res) {
    const user = await getProfileByType(type, { _id: id }, "posts following name")
    let posts = []
    for (i = 0; i < user.posts.length; i++) {
        posts.push({
            "post": user.posts[i],
            "token": user._id,
            "name": user.name,
            // "timeStemp": user.timeStemp
        })
    }

    for (i = 0; i < user.following.length; i++) {
        const followed = await getProfileByType(type, { _id: user.following[i] }, "posts name")
        let fp = []
        for (j = 0; j < followed.posts.length; j++) {
            if (!followed.posts[j].isGroupInvite) {
                posts.push(
                    {
                        "post": followed.posts[j],
                        "token": followed._id,
                        "name": followed.name,
                        // "timeStemp": followed.timeStemp
                    }
                )
            }
        }
    }

    const page = parseInt(p)
    const start = page * 8
    const end = start + 8 < posts.length ? start + 8 : posts.length

    posts.sort((a, b) => b.post.timeStemp - a.post.timeStemp)

    let ans = []

    for (i = start; i < end; i++) {
        ans.push(posts[i])
    }

    res.send({ "value": ans })
}

async function getPost(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "posts name images")
    const posts = [{
        "posts": user.posts,
        "token": user._id,
        "name": user.name,
        "image": user.images[0]
    }]
    res.send({ "value": posts })
}

async function getPostById(token, id, type, res) {
    const user = await getProfileByType(type, { _id: token }, "posts name images")

    let post = null

    for (i = 0; i < user.posts.length; i++) {
        if (user.posts[i]._id == id) {
            post = {
                "post": user.posts[i],
                "token": user._id,
                "name": user.name,
                "image": user.images[0]
            }
            break
        }
    }

    res.send({ "value": post })
}

async function addPost(hashTags, id, post, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "posts")
    user.posts.push(post)
    user.save()
    addHashTags(hashTags, id, user.posts[user.posts.length - 1]._id)
    res.send({ "id": user.posts[user.posts.length - 1]._id })
}

async function addComment(hashTags, id, comment, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "commentsMap")
    user.commentsMap.push(comment)
    user.save()
    addHashTags(hashTags, id, user.commentsMap[user.commentsMap.length - 1]._id)
    res.send({ "id": user.commentsMap[user.commentsMap.length - 1]._id })
}

async function getComments(id, commentID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "commentsMap")
    let comments = []
    for (i = 0; i < user.commentsMap.length; i++) {
        if (user.commentsMap[i].commentID === commentID) {
            comments.push(user.commentsMap[i])
        }
    }
    res.send({ "comments": comments })
}

router.get('/getAllLiks', function (req, res) {
    getAllLiks(req.query.id, req.query.postID, req.query.type, res)
})

async function getAllLiks(id, postID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "posts commentsMap groupCommentsMap stories reels")
    for (i = 0; i < user.posts.length; i++) {
        if (user.posts[i]._id == postID) {
            res.send({ value: user.posts[i].liked })
            return
        }
    }

    for (i = 0; i < user.commentsMap.length; i++) {
        if (user.commentsMap[i]._id == postID) {
            res.send({ value: user.commentsMap[i].liked })
            return
        }
    }

    for (i = 0; i < user.groupCommentsMap.length; i++) {
        if (user.groupCommentsMap[i]._id == postID) {
            if (user.groupCommentsMap[i]._id == postID) {
                res.send({ value: user.groupCommentsMap[i].liked })
                return
            }
        }
    }

    for (i = 0; i < user.stories.length; i++) {
        if (user.stories[i]._id == postID) {
            if (user.stories[i]._id == postID) {
                res.send({ value: user.stories[i].liked })
                return
            }
        }
    }

    for (i = 0; i < user.reels.length; i++) {
        if (user.reels[i]._id == postID) {
            res.send({ value: user.reels[i].liked })
            return
        }
    }

    res.send({ value: [] })
}

async function getNumberOfComments(id, commentID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "commentsMap")
    let comments = []
    for (i = 0; i < user.commentsMap.length; i++) {
        if (user.commentsMap[i].commentID === commentID) {
            comments.push(user.commentsMap[i])
        }
    }
    res.send({ "number": comments.length })
}

async function getNumberOfGroupComments(id, commentID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "groupCommentsMap")
    let comments = []
    for (i = 0; i < user.groupCommentsMap.length; i++) {
        if (user.groupCommentsMap[i].commentID === commentID) {
            comments.push(user.groupCommentsMap[i])
        }
    }
    res.send({ "number": comments.length })
}

async function addGroupComment(id, comment, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "groupCommentsMap")
    user.groupCommentsMap.push(comment)
    user.save()
    addHashTags(hashTags, id, user.groupCommentsMap[user.groupCommentsMap.length - 1]._id)
    res.send({ "id": user.groupCommentsMap[user.groupCommentsMap.length - 1]._id })
}

async function getGroupComments(id, commentID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "groupCommentsMap")
    let comments = []
    for (i = 0; i < user.groupCommentsMap.length; i++) {
        if (user.groupCommentsMap[i].commentID === commentID) {
            comments.push(user.groupCommentsMap[i])
        }
    }
    res.send({ "comments": comments })
}

async function likePost(id, postID, like, byID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "posts commentsMap groupCommentsMap stories reels")

    let next = true

    for (i = 0; i < user.posts.length; i++) {
        if (user.posts[i]._id == postID) {
            for (j = 0; j < user.posts[i].liked.length; j++) {
                if (user.posts[i].liked[j].id == byID) {
                    if (like == "-1") {
                        user.posts[i].liked.pull(user.posts[i].liked[j])
                    }
                    else {
                        user.posts[i].liked[j].value = like
                    }
                    user.save()
                    res.send()
                    return
                }
            }
            if (like != "-1") {
                user.posts[i].liked.push(
                    {
                        id: byID,
                        value: like
                    }
                )
            }
            next = false
            break
        }
    }

    if (next) {
        for (i = 0; i < user.commentsMap.length; i++) {
            if (user.commentsMap[i]._id == postID) {
                for (j = 0; j < user.commentsMap[i].liked.length; j++) {
                    if (user.commentsMap[i].liked[j].id == byID) {
                        if (like == "-1") {
                            user.commentsMap[i].liked.pull(user.commentsMap[i].liked[j])
                        }
                        else {
                            user.commentsMap[i].liked[j].value = like
                        }
                        user.save()
                        res.send()
                        return
                    }
                }
                if (like != "-1") {
                    user.commentsMap[i].liked.push(
                        {
                            id: byID,
                            value: like
                        }
                    )
                }
                next = false
                break
            }
        }
    }

    if (next) {
        for (i = 0; i < user.groupCommentsMap.length; i++) {
            if (user.groupCommentsMap[i]._id == postID) {
                for (j = 0; j < user.groupCommentsMap[i].liked.length; j++) {
                    if (user.groupCommentsMap[i].liked[j].id == byID) {
                        if (like == "-1") {
                            user.groupCommentsMap[i].liked.pull(user.groupCommentsMap[i].liked[j])
                        }
                        else {
                            user.groupCommentsMap[i].liked[j].value = like
                        }
                        user.save()
                        res.send()
                        return
                    }
                }
                if (like != "-1") {
                    user.groupCommentsMap[i].liked.push(
                        {
                            id: byID,
                            value: like
                        }
                    )
                }
                next = false
                break
            }
        }
    }

    if (next) {
        for (i = 0; i < user.stories.length; i++) {
            if (user.stories[i]._id == postID) {
                for (j = 0; j < user.stories[i].liked.length; j++) {
                    if (user.stories[i].liked[j].id == byID) {
                        if (like == "-1") {
                            user.stories[i].liked.pull(user.stories[i].liked[j])
                        }
                        else {
                            user.stories[i].liked[j].value = like
                        }
                        user.save()
                        res.send()
                        return
                    }
                }
                if (like != "-1") {
                    user.stories[i].liked.push(
                        {
                            id: byID,
                            value: like
                        }
                    )
                }
                next = false
                break
            }
        }
    }

    if (next) {
        for (i = 0; i < user.reels.length; i++) {
            if (user.reels[i]._id == postID) {
                for (j = 0; j < user.reels[i].liked.length; j++) {
                    if (user.reels[i].liked[j].id == byID) {
                        if (like == "-1") {
                            user.reels[i].liked.pull(user.reels[i].liked[j])
                        }
                        else {
                            user.reels[i].liked[j].value = like
                        }
                        user.save()
                        res.send()
                        return
                    }
                }
                if (like != "-1") {
                    user.reels[i].liked.push(
                        {
                            id: byID,
                            value: like
                        }
                    )
                }
                next = false
                break
            }
        }
    }

    user.save()

    res.send()
}

async function isLiked(id, postID, byID, type, res) {
    const user = await getProfileByType(type,{ _id: id }, "posts commentsMap groupCommentsMap stories reels")
    for (i = 0; i < user.posts.length; i++) {
        if (user.posts[i]._id == postID) {
            for (j = 0; j < user.posts[i].liked.length; j++) {
                if (user.posts[i].liked[j].id == byID) {
                    res.send({ value: user.posts[i].liked[j].value })
                    return
                }
            }
            res.send("-1")
            return
        }
    }

    for (i = 0; i < user.commentsMap.length; i++) {
        if (user.commentsMap[i]._id == postID) {
            for (j = 0; j < user.commentsMap[i].liked.length; j++) {
                if (user.commentsMap[i].liked[j].id == byID) {
                    res.send({ value: user.commentsMap[i].liked[j].value })
                    return
                }
            }
            res.send("-1")
            return
        }
    }

    for (i = 0; i < user.groupCommentsMap.length; i++) {
        if (user.groupCommentsMap[i]._id == postID) {
            for (j = 0; j < user.groupCommentsMap[i].liked.length; j++) {
                if (user.groupCommentsMap[i].liked[j].id == byID) {
                    res.send({ value: user.groupCommentsMap[i].liked[j].value })
                    return
                }
            }
            res.send("-1")
            return
        }
    }

    for (i = 0; i < user.stories.length; i++) {
        if (user.stories[i]._id == postID) {
            for (j = 0; j < user.stories[i].liked.length; j++) {
                if (user.stories[i].liked[j].id == byID) {
                    res.send({ value: user.stories[i].liked[j].value })
                    return
                }
            }
            res.send("-1")
            return
        }
    }

    for (i = 0; i < user.reels.length; i++) {
        if (user.reels[i]._id == postID) {
            for (j = 0; j < user.reels[i].liked.length; j++) {
                if (user.reels[i].liked[j].id == byID) {
                    res.send({ value: user.reels[i].liked[j].value })
                    return
                }
            }
            res.send("-1")
            return
        }
    }

    res.send("-1")
}

module.exports = router