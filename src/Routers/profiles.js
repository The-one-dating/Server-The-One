const express = require("express")
const Profile = require("../Classs/Romantic/Profile")
const SportProfile = require("../Classs/Sport/SportProfile")
const BusinessProfile = require("../Classs/Business/BusinessProfile")
const PoliticsProfile = require("../Classs/Politics/PoliticsProfile")
const Messages = require("../Classs/Romantic/Messages")
const HashTags = require("../Classs/Romantic/HashTags")
const SportHashTags = require("../Classs/Sport/SportHashTags")
const BusinessHashTags = require("../Classs/Business/BusinessHashTags")
const PoliticsHashTags = require("../Classs/Politics/PoliticsHashTags")
const router = express()

router.get('/', function (req, res) {
    getUsers(req.query.id, req.query.type, res)
})

router.post('/user', function (req, res) {
    getUser(req.body.id, req.body.type, res)
})

router.get('/postForSearch', function (req, res) {
    getPostForSearch(req.query.id, req.query.str, req.query.type, res)
})

router.get('/profileForSearch', function (req, res) {
    getProfileForSearch(req.query.str, req.query.type, res)
})

router.get('/groupForSearch', function (req, res) {
    getGroupForSearch(req.query.str, req.query.type, res)
})

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

async function deleteProfileByType(type, query) {
    // extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await Profile.deleteOne(query).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportProfile.deleteOne(query).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessProfile.deleteOne(query).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsProfile.deleteOne(query).catch(err => console.log(err))
    }
}

async function getProfilesByType(type, query, params) {
    //  extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await Profile.find(query, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportProfile.find(query, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessProfile.find(query, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsProfile.find(query, params).catch(err => console.log(err))
    }
}

router.get('/isProfileTypeExists', function (req, res) {
    isProfileTypeExists(req.query.email, req.query.password, req.query.type, res)
})

async function isProfileTypeExists(email, password, type, res) {
    const profile = await getProfileByType(type, { email: email, password: password }, '')
    let exsit = profile != undefined
    res.send({ value: exsit })
}

async function getUser(id, type, res) {
    const profile = await getProfileByType(type, { _id: id }, '_id name birthdate email gender bio images').catch(err => console.log(err))
    res.send(profile)
}

async function getPostForSearch(id, str, type, res) {
    if (str.length == 0) {
        res.send()
        return
    }

    const user = await getProfileByType(type, { _id: id }, 'posts following')

    var results = []
    for (i = 0; i < user.posts.length; i++) {
        if (user.posts[i].text.toLowerCase().includes(str.toLowerCase())) {
            results.push(user.posts[i])
        }
    }

    for (i = 0; i < user.following.length; i++) {
        const profile = await getProfileByType(type, { _id: user.following[i] }, 'posts')
        for (j = 0; j < profile.posts.length; j++) {
            if (profile.posts[j].isGroupInvite != true && profile.posts[j].text.toLowerCase().includes(str.toLowerCase())) {
                results.push(profile.posts[j])
            }
        }
    }

    res.send({ results: results })
}

async function getProfileForSearch(str, type, res) {
    const users = await getProfilesByType(type, {}, 'name image')

    var results = []
    for (i = 0; i < users.length; i++) {
        const profile = users[i]
        if (profile.name.toLowerCase().includes(str.toLowerCase())) {
            results.push(profile)
        }
    }

    res.send({ results: results })
}

async function getGroupForSearch(str, type, res) {
    const users = await getProfilesByType(type, {}, "groups")

    var results = []
    for (i = 0; i < users.length; i++) {
        for (j = 0; j < users[i].groups.length; j++) {
            if (users[i].groups[j].title.toLowerCase().includes(str.toLowerCase())) {
                results.push(
                    {
                        timeStemp: users[i].groups[j].timeStemp,
                        id: users[i]._id,
                        groupID: users[i].groups[j]._id,
                        title: users[i].groups[j].title,
                        bio: users[i].groups[j].bio,
                        image: users[i].groups[j].image
                    }
                )
            }
        }
    }

    res.send({ results: results })
}

async function getUsers(id, type, res) {
    const users = await getProfilesByType(type, {}, '_id loggedIn name birthdate email password confirmPassword gender bio timeStemp oneMatch images._id gender looking location matchs activeMatches').catch(err => console.log(err))
    const user = await getProfileByType(type, { _id: id }, 'matchs loggedIn activeMatchs gender looking likes location oneMatch radius ageRange').catch(err => console.log(err))

    const profiles = []

    let uLatLng = user.location == undefined ? [] : user.location.split(",")
    let uLat = uLatLng.length == 0 ? 0 : parseFloat(uLatLng[0])
    let uLng = uLatLng.length == 0 ? 0 : parseFloat(uLatLng[1])

    for (i = 0; i < users.length; i++) {
        let latLng = users[i].location == undefined ? 0 : users[i].location.split(",")
        let lat = latLng.length == 0 ? 0 : parseFloat(latLng[0])
        let lng = latLng.length == 0 ? 0 : parseFloat(latLng[1])

        const distance = uLat || uLng || user.globaly == "true" ? 0 : clacDistance(uLat, uLng, lat, lng)

        if (distance <= parseFloat(user.radius)) {
            let avilable = !users[i].oneMatch || (users[i].matchs.length == 0 && (users[i].activeMatchs == undefined || users[i].activeMatchs.length == 0))
            if (users[i]._id != id && avilable) {
                const matched = user.likes.some(function (check) {
                    return check == users[i].id
                })

                const matched1 = user.matchs.some(function (check) {
                    return check.id == users[i]._id
                })

                const matched2 = user.activeMatchs.some(function (check) {
                    return check.id == users[i]._id
                })

                const matched3 = user.looking == users[i].gender
                const matched4 = user.gender == users[i].looking

                let age = _calculateAge(users[i].birthdate)
                const matched5 = age >= user.ageRange.from && age <= user.ageRange.to

                if (!matched && !matched1 && !matched2 && matched3 && matched4 && matched5) {
                    profiles.push(users[i])
                }
            }
        }
    }

    res.send(profiles)
}

function _calculateAge(birthday) { 
    const componnets = birthday.split('/')
    const date = new Date(componnets[2], componnets[1], componnets[0])
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

router.post('/bio', function (req, res) {
    updateBio(req.body.id, req.body.bio, req.body.type, res)
})

router.get('/image', function (req, res) {
    getImage(req.query.id, req.query.imageID, req.query.type, res)
})

router.get('/isGlobaly', function (req, res) {
    setIsGlobaly(req.query.id, req.query.globaly, req.query.type, res)
})

router.get('/getIsGlobaly', function (req, res) {
    getIsGlobaly(req.query.id, req.query.type, res)
})

router.get('/radius', function (req, res) {
    setRadius(req.query.id, req.query.radius, req.query.type, res)
})

router.get('/getRadius', function (req, res) {
    getRadius(req.query.id, req.query.type, res)
})

router.get('/ageRange', function (req, res) {
    setAgeRange(req.query.id, req.query.from, req.query.to, req.query.type, res)
})

router.get('/getAgeRange', function (req, res) {
    getAgeRange(req.query.id, req.query.type, res)
})

router.get('/getAccounts', function (req, res) {
    getAccounts(req.query.id, res)
})

router.get('/deleteAccount', function (req, res) {
    deleteAccount(req.query.id, req.query.account, res)
})

async function deleteAccount(id, account, res) {
    await deleteProfileByType(account, { _id: id })
    res.send()
}

async function getAccounts(id, res) {
    const profileTypes = ["Romantic", "Sport", "Business", "Politics"]
    let profiles = []
    for (i = 0; i < profileTypes.length; i++) {
        const user = await getProfileByType(profileTypes[i], { _id: id }, "_id")
        if (user != undefined) {
            profiles.push(profileTypes[i])
        }
    }

    res.send({ profileTypes: profiles })
}

async function getRadius(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "radius")
    res.send({ radius: user.radius })
}

async function setRadius(id, radius, type, res) {
    const user = await getProfileByType(type, { _id: id }, "radius")
    user.radius = radius
    user.save()
    res.send()
}

async function setAgeRange(id, from, to, type, res) {
    const user = await getProfileByType(type, { _id: id }, "ageRange")
    const fromNumber = parseFloat(from)
    const toNumber = parseFloat(to)
    user.ageRange.from = fromNumber
    user.ageRange.to = toNumber
    user.save()
    res.send()
}

async function getAgeRange(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "ageRange")
    res.send({ ageRange: user.ageRange })
}

async function getIsGlobaly(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "globaly")
    res.send({ value: user.globaly })
}

async function setIsGlobaly(id, globaly, type, res) {
    const user = await getProfileByType(type, { _id: id }, "globaly")
    user.globaly = globaly == "true"
    user.save()
    res.send()
}

async function getImage(id, imageID, type, res) {
    if (id.length === 0 || imageID.length === 0) { return res.send() }
    const user = await getProfileByType(type, { _id: id }, "images")
    let data = null

    for (i = 0; i < user.images.length; i++) {
        if (user.images[i]._id == imageID) {
            data = user.images[i].name
            break
        }
    }

    if (data != null) {
        res.send({ image: data })
    }
    else {
        res.send()
    }
}

router.post('/story', function (req, res) {
    saveStory(req.body.id, req.body.urls, req.body.texts, Date.now(), req.body.type, res)
})

router.get('/stories', function (req, res) {
    getStories(req.query.id, req.query.fromProfile, req.query.type, res)
})

router.get('/location', function (req, res) {
    getLocation(req.query.id, req.query.type, res)
})

router.post('/location', function (req, res) {
    setLocation(req.body.id, req.body.location, req.body.type, res)
})

router.get('/byLocation', function (req, res) {
    getProfilesByRadius(req.query.id, req.query.radius, req.query.type, res)
})

router.get('/deleteStory', function (req, res) {
    deleteStroy(req.query.id, req.query.storyID, req.query.type, res)
})

router.get('/deleteReel', function (req, res) {
    deleteReel(req.query.id, req.query.reelID, req.query.type, res)
})

router.get('/deleteGroup', function (req, res) {
    deleteGroup(req.query.id, req.query.groupID, req.query.type, res)
})

async function saveStory(id, story, text, timeStemp, type, res) {
    let array = []
    const stroies = story.split(",")
    const texts = text.split(",")

    for (i = 0; i < stroies.length; i++) {
        let filename = stroies[i]
        let text = texts[i]
        const componnets = filename.split("±")
        array.push({
            value: componnets[0],
            assetType: componnets[1],
            text: text,
        })
    }

    const toUpdate = await await getProfileByType(type, { _id: id }, 'stories')

    toUpdate.stories.push({ values: array, timeStemp: timeStemp })

    await toUpdate.save()

    res.send({ id: toUpdate.stories[toUpdate.stories.length - 1]._id })
}

async function getStories(id, fromProfile, type, res) {
    const s = await getProfileByType(type, { _id: id }, 'name stories images following')

    let allStories = []

    for (i = 0; i < s.stories.length; i++) {
        allStories.push({
            'token': s._id,
            'name': s.name,
            'stories': s.stories[i],
            'mainImage': s.images[0].name
        })
    }

    if (fromProfile == "false") {
        for (i = 0; i < s.following.length; i++) {
            const f = await getProfileByType(type, { _id: s.following[i] }, 'name stories images').catch(err => console.log(err))
            for (j = 0; j < f.stories.length; j++) {
                allStories.push({
                    'token': f._id,
                    'name': f.name,
                    'stories': f.stories[j],
                    'mainImage': f.images[0].name
                })
            }
        }
    }

    allStories.sort((a, b) => a.stories.timeStemp - b.stories.timeStemp)

    res.send(allStories)
}

router.get('/follow', function (req, res) {
    follow(req.query.id, req.query.followID, req.query.add, req.query.type, res)
})

router.get('/like', function (req, res) {
    like(req.query.id, req.query.likeID, req.query.type, res)
})

router.get('/rlike', function (req, res) {
    reveseLike(req.query.id, req.query.likeID, req.query.type, res)
})

router.get('/cancelMatch', function (req, res) {
    cancelMatch(req.query.id, req.query.likeID, req.query.isNew, req.query.type, res)
})

router.get('/matchs', function (req, res) {
    matchs(req.query.id, req.query.type, res)
})

router.get('/activeMatchs', function (req, res) {
    activeMatchs(req.query.id, req.query.type, res)
})

router.get('/allMatchs', function (req, res) {
    allMatchs(req.query.id, req.query.type, res)
})

router.get('/oneMatch', function (req, res) {
    oneMatch(req.query.id, req.query.value, req.query.type, res)
})

router.get('/isOneMatch', function (req, res) {
    isOneMatch(req.query.id, req.query.type, res)
})

router.get('/isFollowing', function (req, res) {
    isFowllwing(req.query.id, req.query.followID, req.query.type, res)
})

router.get('/isLiked', function (req, res) {
    isLiked(req.query.id, req.query.likeID, req.query.type, res)
})

router.get('/following', function (req, res) {
    getFowllowing(req.query.id, req.query.type, res)
})

router.get('/mainImage', function (req, res) {
    mainImage(req.query.id, req.query.type, res)
})

router.get('/name', function (req, res) {
    getName(req.query.id, req.query.type, res)
})

router.post('/reel', function (req, res) {
    saveReel(req.body.id, req.body.image, req.body.video, req.body.text, req.body.hashTags, Date.now(), req.body.type, res)
})

router.get('/reels', function (req, res) {
    getReels(req.query.id, req.query.type, res)
})

router.get('/removeImage', function (req, res) {
    removeImage(req.query.id, req.query.imageID, req.query.type, res)
})

router.post('/addImage', function (req, res) {
    addImage(req.body.id, req.body.image, req.body.type, res)
})

router.post('/updateImage', function (req, res) {
    updateImage(req.body.id, req.body.imageID, req.body.image, req.body.type, res)
})

router.get('/galleryImages', function (req, res) {
    addToGallery(req.query.id, req.query.images, req.query.type, res)
})

router.get('/getGalleryImages', function (req, res) {
    getGallery(req.query.id, req.query.type, res)
})

async function addToGallery(id, image, type, res) {
    const images = image.split(",")
    const user = await getProfileByType(type, { _id: id }, "galleryImages")
    for (i = 0; i < images.length; i++) {
        user.galleryImages.push(images[i])
    }
    user.save()
    res.send()
}

async function getGallery(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "galleryImages")
    res.send(user.galleryImages)
}

async function saveReel(id, image, video, text, hashTags, timeStemp, type, res) {
    const toUpdate = await getProfileByType(type, { _id: id }, 'reels')

    let filename = ""
    let t = ""

    if (image.length > 0) {
        filename = image
        t = "image"
    }
    else if (video.length > 0) {
        filename = video
        t = "video"
    }
    toUpdate.reels.push({
        timeStemp: timeStemp,
        value: {
            name: filename,
            text: text,
        },
        assetType: t
    })

    toUpdate.save()

    addHashTags(hashTags, type, id, toUpdate.reels[toUpdate.reels.length - 1]._id)

    res.send({ id: toUpdate.reels[toUpdate.reels.length - 1]._id })
}

async function addHashTags(hashTags, type, id, postID) {
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

async function getReels(id, type, res) {
    const find = id === "" ? {} : { _id: id }
    const r = await getProfileByType(type, find, 'name reels images')

    let allReels = []

    for (i = 0; i < r.length; i++) {
        if (r[i] != undefined) {
            let reels = []
            for (j = 0; j < r[i].reels.length; j++) {
                allReels.push({
                    'token': r[i]._id,
                    'name': r[i].name,
                    'reel': r[i].reels[j],
                    'mainImage': r[i].images[0]
                })
            }
        }
    }

    allReels.sort((a, b) => a.reel.timeStemp - b.reel.timeStemp)

    res.send(allReels)
}

router.post('/group', function (req, res) {
    saveGroup(req.body.id, req.body.image, req.body.title, req.body.bio, Date.now(), req.body.type, res)
})

router.post('/updateGroup', function (req, res) {
    updateGroup(req.body.id, req.body.groupID, req.body.image, req.body.title, req.body.bio, req.body.type, res)
})

router.get('/isGroupFollowed', function (req, res) {
    isGroupFollwed(req.query.id, req.query.groupID, req.query.type, res)
})

router.get('/followGroup', function (req, res) {
    followGroup(req.query.id, req.query.profileID, req.query.groupID, req.query.follow, req.query.type, res)
})

router.get('/groups', function (req, res) {
    getFollowedGroups(req.query.id, req.query.fromProfile, req.query.type, res)
})

router.get('/getGroup', function (req, res) {
    getGruop(req.query.id, req.query.groupID, req.query.type, res)
})

async function saveGroup(id, image, title, bio, timeStemp, type, res) {
    const toUpdate = await getProfileByType(type, { _id: id }, 'groups')

    let filename = image
    const group = {
        image: filename,
        title: title,
        bio: bio,
        timeStemp: timeStemp
    }
    toUpdate.groups.push(group)

    toUpdate.save()

    res.send({ "id": toUpdate.groups[toUpdate.groups.length - 1]._id })
}

async function updateGroup(id, groupID, image, title, bio, type, res) {
    const toUpdate = await getProfileByType(type, { "_id": id }, 'groups')
    for (i = 0; i < toUpdate.groups.length; i++) {
        if (toUpdate.groups[i]._id == groupID) {
            toUpdate.groups[i].image = image
            toUpdate.groups[i].title = title
            toUpdate.groups[i].bio = bio
            break
        }
    }

    toUpdate.save()

    res.send(true)
}

async function followGroup(id, profileID, groupID, follow, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'followedGroups')
    if (follow == "true") {
        user.followedGroups.push({
            id: profileID,
            groupID: groupID
        })
    }
    else {
        user.followedGroups.pull({
            id: profileID,
            groupID: groupID
        })
    }
    user.save()
    res.send()
}

async function isGroupFollwed(id, groupID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'followedGroups')
    const gruop = user.followedGroups.some(function (check) {
        return check.groupID == groupID
    });
    res.send({ value: gruop != false })
}

async function getFollowedGroups(id, fromFrofile, type, res) {
    let groups = []
    if (fromFrofile == "false") {
        const user = await getProfileByType(type, { _id: id }, 'groups followedGroups')
        if (user.groups != undefined) {
            for (i = 0; i < user.groups.length; i++) {
                groups.push({
                    timeStemp: user.groups[i].timeStemp,
                    id: user._id,
                    title: user.groups[i].title,
                    bio: user.groups[i].bio,
                    groupID: user.groups[i]._id,
                    image: user.groups[i].image
                })
            }
        }

        if (user.followedGroups != undefined) {
            for (i = 0; i < user.followedGroups.length; i++) {
                const profile = await getProfileByType(type, { _id: user.followedGroups[i].id }, 'groups')
                let group = undefined

                for (i = 0; i < profile.groups.length; i++) {
                    if (profile.groups[i]._id == user.followedGroups[i].groupID) {
                        group = profile.groups[i]
                        break
                    }
                }

                if (group != undefined) {
                    groups.push({
                        timeStemp: group.timeStemp,
                        id: profile.followedGroups[i].id,
                        title: group.title,
                        bio: group.bio,
                        groupID: profile.groups[i]._id,
                        image: group.image
                    })
                }
            }
        }
    }
    else {
        const profile = await getProfileByType(type, { _id: id }, 'groups')
        for (i = 0; i < profile.groups.length; i++) {
            groups.push({
                timeStemp: profile.groups[i].timeStemp,
                id: profile._id,
                groupID: profile.groups[i]._id,
                title: profile.groups[i].title,
                bio: profile.groups[i].bio,
                image: profile.groups[i].image
            })
        }
    }

    groups.sort((a, b) => a.timeStemp - b.timeStemp)

    res.send(groups)
}

async function getGruop(id, groupID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'groups')
    let group = null

    for (i = 0; i < user.groups.length; i++) {
        if (user.groups[i]._id == groupID) {
            group = {
                timeStemp: user.groups[i].timeStemp,
                id: user._id,
                groupID: user.groups[i]._id,
                title: user.groups[i].title,
                bio: user.groups[i].bio,
                image: user.groups[i].image
            }
            break
        }
    }
    res.send({ group: group })
}

async function deleteStroy(id, storyID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'stories').catch(err => console.log(err))
    for (i = 0; i < user.stories.length; i++) {
        if (user.stories[i]._id == storyID) {
            user.stories.pull(user.stories[i])
            break
        }
    }

    user.save()
    res.send()
}

async function deleteReel(id, reelID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'reels').catch(err => console.log(err))
    for (i = 0; i < user.reels.length; i++) {
        if (user.reels[i]._id == reelID) {
            user.reels.pull(user.reels[i])
            break
        }
    }

    user.save()
    res.send()
}

async function deleteGroup(id, groupID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'groups').catch(err => console.log(err))
    for (i = 0; i < user.groups.length; i++) {
        if (user.groups[i]._id == groupID) {
            user.groups.pull(user.groups[i])
            break
        }
    }

    user.save()
    res.send()
}

async function updateBio(id, bio, type, res) {
    const user = await getProfileByType(type, { _id: id }).catch(err => console.log(err))
    await user.updateOne({ bio: bio })
    const updatedUser = await getProfileByType(type, { _id: id }).catch(err => console.log(err))
    res.send(updatedUser)
}

async function removeImage(id, imageID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'images')
    for (i = 0; i < user.images.length; i++) {
        if (user.images[i]._id == imageID) {
            user.images.pull(user.images[i])
            break
        }
    }

    user.save()
    res.send()
}

async function updateImage(id, imageID, image, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'images')
    let filename = image
    for (i = 0; i < user.images.length; i++) {
        if (user.images[i]._id == imageID) {
            user.images[i].name = filename
            break
        }
    }

    await user.save()
    res.send()
}

async function addImage(id, image, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'images')
    const filename = image
    user.images.push({ name: filename })
    user.save()
    res.send()
}

async function like(id, likeID, type, res) {
    const user = await getProfileByType(type, { _id: likeID }, "likes")

    const likes = user.likes.some(function (check) {
        return check == id
    });

    if (!likes) {
        const user = await getProfileByType(type, { _id: id }, "likes")
        user.likes.push(likeID)
        user.save()
    }
    else {
        const user = await getProfileByType(type, { _id: likeID }, "matchs likes")
        user.matchs.push({ interacted: false, id: id })
        user.likes.pull(id)
        user.save()
        const profile = await getProfileByType(type, { _id: id }, "matchs")
        profile.matchs.push({ interacted: false, id: likeID })
        profile.save()
    }

    res.send({ "likes": likes })
}

async function isLiked(id, likeID, type, res) {
    const user = await getProfileByType(type, { _id: id }, "likes matchs")
    const exsit = user.likes.some(function (id) {
        return likeID == id
    })

    const exsit2 = user.matchs.some(function (match) {
        return likeID == match.id
    })

    res.send({ "isLiked": exsit || exsit2 })
}

async function reveseLike(id, likeID, type, res) {
    const user = await getProfileByType(type, { _id: id }, "likes matchs")
    user.likes.pull(likeID)
    user.matchs.pull({ id: likeID })
    const match = await getProfileByType(type, { _id: likeID }, "matchs")
    match.matchs.pull({ id: id })
    user.save()
    match.save()
    res.send()
}

async function cancelMatch(id, likeID, isNew, type, res) {
    if (isNew == "true") {
        const user = await getProfileByType(type, { _id: id }, "matchs")
        user.matchs.pull({ id: likeID })
        const match = await getProfileByType(type, { _id: likeID }, "matchs")
        match.matchs.pull({ id: id })
        user.save()
        match.save()
    }
    else {
        const user = await getProfileByType(type, { _id: id }, "activeMatchs")
        user.activeMatchs.pull({ id: likeID })
        const match = await getProfileByType(type, { _id: likeID }, "activeMatchs")
        match.activeMatchs.pull({ id: id })
        user.save()
        match.save()
    }

    const array = [id, likeID].sort()

    await Messages.deleteOne({ room: array[0] + array[1] })

    res.send()
}

async function matchs(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "matchs")
    res.send({ "matchs": user.matchs })
}

async function activeMatchs(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "activeMatchs")
    res.send({ "matchs": user.activeMatchs })
}

async function allMatchs(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "matchs activeMatchs")
    const matches = user.matchs
    for (i = 0; i < user.activeMatchs.length; i++) {
        matches.push(user.activeMatchs[i])
    }
    res.send({ "matchs": matches })
}


async function follow(id, followID, toAdd, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'following')
    if (toAdd == "true") {
        user.following.push(followID)
    }
    else {
        user.following.pull(followID)
    }
    user.save()
    res.send(true)
}

async function getFowllowing(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'following')
    if (user == undefined) {
        res.send({ "follwoing": [] })
        return
    }
    res.send({ "follwoing": user.following })
}

async function isFowllwing(id, followID, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'following')
    const exsit = user.following.some(function (id) {
        return followID == id
    })
    res.send({ "isFollow": exsit })
}

async function mainImage(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "images")
    if (user == undefined) {
        res.send(null)
    }
    else {
        res.send({
            "image": user.images[0].name
        })
    }
}

async function getName(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "name")
    res.send({ "name": user.name })
}

async function setLocation(id, location, type, res) {
    const user = await getProfileByType(type, { _id: id })
    await user.updateOne({ location: location })
    res.send()
}

async function getLocation(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, "location")
    if (user == null) {
        res.send(null)
    }
    else {
        res.send({ "location": user.location })
    }
}

async function getProfilesByRadius(id, radius, type, res) {
    const user = await getProfileByType(type, { _id: id }, "location timedConversions gender looking")
    const users = await getProfilesByType(type, {}, "location gender looking")
    let profilesByRadius = []

    if (user.timedConversions != undefined) {
        for (i = 0; i < user.timedConversions.length; i++) {
            const profile = await getProfileByType(type, { _id: user.timedConversions[i].id }, '_id name')
            profilesByRadius.push(profile)
        }
    }

    let uLatLng = user.location != undefined ? user.location.split(",") : []
    let uLat = uLatLng.length == 0 ? 0 : parseFloat(uLatLng[0])
    let uLng = uLatLng.length == 0 ? 0 : parseFloat(uLatLng[1])

    for (i = 0; i < users.length; i++) {
        const match = user.timedConversions.some(function (a) { return a.id == users[i]._id })
        const match2 = user.looking == users[i].gender
        const match3 = user.gender == users[i].looking
        if (!match && match2 && match3 && users[i]._id != id && users[i].location != undefined) {
            let latLng = users[i].location == undefined ? [] : users[i].location.split(",")
            let lat = latLng.length == 0 ? 0 : parseFloat(latLng[0])
            let lng = latLng.length == 0 ? 0 : parseFloat(latLng[1])

            const distance = clacDistance(uLat, uLng, lat, lng)
            if (distance <= parseFloat(radius)) {
                const profile = await getProfileByType(type, { _id: users[i]._id }, '_id name')
                profilesByRadius.push(profile)
            }
        }
    }
    res.send({ "profiles": profilesByRadius })
}

async function oneMatch(id, value, type, res) {
    const user = await getProfileByType(type, { _id: id }, "oneMatch")
    if (user.oneMatch === undefined) {
        user.oneMatch = true
    }
    else {
        user.oneMatch = value == "true"
    }
    user.save()
    res.send()
}

async function isOneMatch(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'oneMatch')
    res.send({ "isOneMatch": user.oneMatch })
}

function clacDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function toRad(Value) {
    return Value * Math.PI / 180;
}

module.exports = router