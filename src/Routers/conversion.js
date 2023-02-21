const express = require("express")
const Messages = require("../Classs/Romantic/Messages")
const SportMessages = require("../Classs/Sport/SportMessages")
const BusinessMessages = require("../Classs/Business/BusinessMessages")
const PoliticsMessages = require("../Classs/Politics/PoliticsMessages")
const Profile = require("../Classs/Romantic/Profile")
const SportProfile = require("../Classs/Sport/SportProfile")
const BusinessProfile = require("../Classs/Business/BusinessProfile")
const PoliticsProfile = require("../Classs/Politics/PoliticsProfile")
const router = express()

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

async function getMessageByType(type, query, params) {
    // extra = extra == undefined ? {} : extra
    if (type == "Romantic") {
        return await Messages.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Sport") {
        return await SportMessages.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Business") {
        return await BusinessMessages.findOne(query, params).catch(err => console.log(err))
    }
    if (type == "Politics") {
        return await PoliticsMessages.findOne(query, params).catch(err => console.log(err))
    }
}

router.post('/setTimer', function (req, res) {
    setTimer(req.body.id, req.body.toID, req.body.room, req.body.timeStemp, res)
})

router.get('/getTimer', function (req, res) {
    getTimer(req.query.room, req.query.type, res)
})

router.get('/cancelTimer', function (req, res) {
    removeConversionTimer(req.query.id, req.query.room, req.query.type, res)
})

router.get('/setInteracted', function (req, res) {
    setInteracted(req.query.id, req.query.id2, req.query.type, res)
})

router.get('/setActiveInteracted', function (req, res) {
    setActiveInteracted(req.query.id, req.query.id2, req.query.type, res)
})

router.get('/isUnread', function (req, res) {
    isUnread(req.query.id, req.query.type, res)
})

router.post('/moveToActive', function (req, res) {
    moveToActive(req.body.id, req.body.id2, req.body.type, res)
})

router.get('/groupInvite', function (req, res) {
    inviteToGroup(req.query.token, req.query.name, req.query.id, req.query.groupID, req.query.type, res)
})

router.get('/lastMessage', function (req, res) {
    getLastMassege(req.query.room, req.query.type, res)
})

router.get('/messages', function (req, res) {
    getAllMassege(req.query.room, req.query.type, res)
})

router.get('/message', function (req, res) {
    getMessage(req.query.room, req.query.id, req.query.type, res)
})

router.get('/likeMessage', function (req, res) {
    likeMessage(req.query.room, req.query.id, req.query.type, res)
})

router.get('/isMessageLiked', function (req, res) {
    isMessageLiked(req.query.room, req.query.id, req.query.type, res)
})

router.get('/dateState', function (req, res) {
    dateState(req.query.room, req.query.type, res)
})

router.get('/location', function (req, res) {
    location(req.query.room, req.query.type, res)
})

router.post('/send', function (req, res) {
    const audio = req.body.audio != undefined ? {
        signals: req.body.signals,
        url: req.body.audio
    } : undefined

    const message = {
        "id": req.body.id,
        "text": req.body.text,
        "gif": req.body.gif,
        "video": req.body.video,
        "audio": audio,
        "location": req.body.location,
        "file": req.body.file,
        "tagsIDs": req.body.tagsIDs,
        "urls": req.body.urls,
        "image": req.body.time,
        "timeStemp": Number(req.body.timeStemp)
    }

    saveMessage(req.body.room, message, req.body.type, res)
})

async function saveMessage(room, message, type, res) {
    let msg = await getMessageByType(type,{ room: room })

    if (msg == null || msg.room == undefined) {
        msg = Messages({
            room: room,
            messages: [message]
        })
    }
    else {
        msg.messages.push(message)
    }

    msg.save()

    res.send({ id: msg.messages[msg.messages.length - 1]._id })
}

async function setTimer(id, toID, room, timeStemp, type, res) {
    const m = await getMessageByType(type, { room: room }, 'timer')
    m.timer = timeStemp
    m.save()

    const p = await getProfileByType(type, { _id: id }, 'timedConversions')
    p.timedConversions.push({
        room: room,
        id: toID
    })

    const p2 = await getProfileByType(type, { _id: toID }, 'timedConversions')
    p2.timedConversions.push({
        room: room,
        id: id
    })

    p.save()
    p2.save()

    res.send()
}

async function getTimer(room, type, res) {
    const m = await getMessageByType(type, { room: room }, 'timer')
    if (m != undefined) {
        res.send({ value: m.timer })
    }
    else {
        res.send(null)
    }
}

async function isUnread(id, type, res) {
    const user = await getProfileByType(type, { _id: id }, 'matchs')
    for (i = 0; i < user.matchs.length; i++) {
        if (!user.matchs[i].interacted) {
            // console.log(!user.matchs[i].interacted)
            res.send({ "value": true })
            return
        }
    }

    const user2 = await getProfileByType(type, { _id: id }, 'activeMatchs')
    for (i = 0; i < user2.activeMatchs.length; i++) {
        if (user2.activeMatchs[i].newMassage) {
            // console.log(user2.activeMatchs[i].newMassage)
            res.send({ "value": true })
            return
        }
    }
    // console.log("false")
    res.send({ "value": false })
}

async function removeConversionTimer(id, room, type, res) {
    await Messages.deleteOne({ room: room })
    const user = await getProfileByType(type, { _id: id }, 'timedConversions')
    for (i = 0; i < user.timedConversions.length; i++) {
        if (user.timedConversions[i].room == room) {
            const user2 = await getProfileByType(type, { _id: user.timedConversions[i].id }, 'timedConversions')
            for (j = 0; j < user2.timedConversions.length; j++) {
                if (user2.timedConversions[j].room == room) {
                    user2.timedConversions.pull(user2.timedConversions[j])
                    break
                }
            }
            user.timedConversions.pull(user.timedConversions[i])
            user.save()
            user2.save()
            break
        }
    }
    res.send()
}

async function inviteToGroup(token, name, id, groupID, type, res) {
    const user = await getProfileByType(type, { _id: token }, "posts")
    const profile = await getProfileByType(type, { _id: id }, "name")
    user.posts.push(
        {
            text: name + "," + id + "," + groupID + "," + profile.name,
            isGroupInvite: true
        }
    )
    user.save()
    res.send()
}

async function setInteracted(id, id2, type, res) {
    const user = await getProfileByType(type, { _id: id }, "matchs")
    for (i = 0; i < user.matchs.length; i++) {
        if (user.matchs[i].id == id2) {
            user.matchs[i].interacted = true
            break
        }
    }
    user.save()
    res.send()
}

async function setActiveInteracted(id, id2, type, res) {
    const user = await getProfileByType(type, { _id: id }, "activeMatchs")
    for (i = 0; i < user.activeMatchs.length; i++) {
        if (user.activeMatchs[i].id == id2) {
            user.activeMatchs[i].newMassage = false
            break
        }
    }
    user.save()
    res.send({ "value": true })
}

async function moveToActive(id, id2, type, res) {
    const user = await getProfileByType(type, { _id: id }, "matchs activeMatchs")
    for (i = 0; i < user.matchs.length; i++) {
        if (user.matchs[i].id == id2) {
            user.matchs.pull(user.matchs[i])
            user.activeMatchs.push(
                {
                    id: id2,
                    newMassage: false
                }
            )
            break
        }
    }

    const match = await getProfileByType(type, { _id: id2 }, "matchs activeMatchs")
    for (j = 0; j < match.matchs.length; j++) {
        if (match.matchs[i] != undefined) {
            if (match.matchs[i].id == id) {
                match.matchs.pull(match.matchs[j])
                match.activeMatchs.push(
                    {
                        id: id,
                        newMassage: true
                    }
                )
                break
            }
        }
    }

    match.save()
    user.save()
    res.send({ "value": true })
}

async function getLastMassege(room, type, res) {
    const m = await getMessageByType(type,{ room: room })
    if (m != undefined) {
        res.send({ "text": m.messages[m.messages.length - 1].text })
    }
    else {
        res.send({ "text": "" })
    }
}

async function getAllMassege(room, type, res) {
    const m = await getMessageByType(type, { room: room })
    if (m != undefined) {
        res.send({ "messages": m.messages })
    }
    else {
        res.send({ "messages": [] })
    }
}

async function getMessage(room, id, type, res) {
    const m = await getMessageByType(type, { room: room })
    let message = undefined
    if (m != undefined) {
        for (i = 0; i < m.messages.length; i++) {
            if (m.messages[i]._id == id) {
                message = m.messages[i]
                break
            }
        }
    }
    res.send({ "message": message })
}

async function likeMessage(room, id, type, res) {
    const m = await getMessageByType(type, { room: room })
    if (m != undefined) {
        for (i = 0; i < m.messages.length; i++) {
            if (m.messages[i]._id == id) {
                m.messages[i].liked = !m.messages[i].liked
                break
            }
        }
        m.save()
    }
    res.send()
}

async function isMessageLiked(room, id, type, res) {
    const m = await getMessageByType(type, { room: room })
    if (m != undefined) {
        for (i = 0; i < m.messages.length; i++) {
            if (m.messages[i]._id == id) {
                res.send({ liked: m.messages[i].liked })
                return
            }
        }
    }
    res.send({ liked: false })
}

async function dateState(room, type, res) {
    const m = await getMessageByType(type, { room: room })
    if (m != undefined) {
        res.send({ state: m.date.state })
    }
    else {
        res.send({ state: "none" })
    }
}

async function location(room, type, res) {
    const m = await getMessageByType(type, { room: room })
    if (m != undefined) {
        res.send({ location: m.date.location })
    }
    else {
        res.send()
    }
}

module.exports = router