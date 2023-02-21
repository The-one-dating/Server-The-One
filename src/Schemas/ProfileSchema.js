const schema = {
    "loggedIn": { type: Boolean, default: false },
    "type": { type: String, default: "" },
    "name": String,
    "email": String,
    "password": String,
    "confirmPassword": String,
    "birthdate": String,
    "ageRange": {
        "from": { type: Number, default: 0 },
        "to": { type: Number, default: Number.MAX_VALUE }
    },
    "gender": String,
    "looking": String,
    "bio": String,
    "timeStemp": { type: Number, default: Date.now() },
    "radius": { type: Number, default: 500 },
    "globaly": {type: Boolean, default: false},
    "following": [String],
    "location": String,
    "oneMatch": { type: Boolean, default: false },
    "galleryImages": [String],
    "timedConversions": [
        {
            "room": String,
            "id": String
        }
    ],
    "images": [{
        name: String
    }],
    "likes": [String],
    "matchs": [
        {
            interacted: Boolean,
            id: String
        }
    ],
    "activeMatchs": [
        {
            id: String,
            newMassage: Boolean
        }
    ],
    "stories": [{
        timeStemp: Number,
        values: [{
            value: String,
            assetType: String,
            text: String
        }],
        liked: [{
            "value": { type: String, default: "-1" },
            "id": String

        }],
    }
    ],
    "reels": [{
        timeStemp: Number,
        assetType: String,
        value: {
            name: String,
            text: String,
        },
        liked: [{
            "value": { type: String, default: "-1" },
            "id": String

        }],
    }],
    "groups": [
        {
            timeStemp: Number,
            image: String,
            title: String,
            bio: String
        }
    ],
    "followedGroups": [
        {
            id: String,
            groupID: String
        }
    ],
    "posts": [
        {
            "isGroupInvite": { type: Boolean, default: false },
            "liked": [{
                "value": { type: String, default: "-1" },
                "id": String

            }],
            "replayToken": String,
            "replayID": String,
            "timeStemp": { type: Number, default: Date.now() },
            "text": String,
            "gif": String,
            "tagsIDs": { type: String, default: null },
            "video": String,
            "audio": {
                signals: [String],
                url: String,
            },
            "location": String,
            "fie": String,
            "urls": String,
            "image": String
        }
    ],
    "commentsMap": [{
        "liked": [{
            "value": { type: String, default: "-1" },
            "id": String

        }],
        "commentID": String,
        "profileID": String,
        "text": String,
        "gif": String,
        "video": String,
        "audio": {
            signals: [String],
            url: String,
        },
        "location": String,
        "fie": String,
        "urls": String,
        "image": String
    }],
    "groupCommentsMap": [{
        "liked": [{
            "value": { type: String, default: "-1" },
            "id": String
        }],
        "commentID": String,
        "profileID": String,
        "text": String,
        "gif": String,
        "video": String,
        "audio": {
            signals: [String],
            url: String,
        },
        "location": String,
        "fie": String,
        "urls": String,
        "image": String
    }]
}

module.exports = schema