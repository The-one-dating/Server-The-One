const schema = {
    "room": String,
    "timer": String,
    "date": {
        "state": { type: String, default: "none" },
        "location": {
            "value": { type: String, default: "none" },
            "status": { type: String, default: "none" },
        },
    },
    "messages": [
        {
            "id": String,
            "liked": { type: Boolean, default: false },
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
            "file": String,
            "urls": String,
            "image": String
        }
    ]
}

module.exports = schema