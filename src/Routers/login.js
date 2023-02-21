const express = require("express")
const Profile = require("../Classs/Romantic/Profile")
const SportProfile = require("../Classs/Sport/SportProfile")
const BusinessProfile = require("../Classs/Business/BusinessProfile")
const PoliticsProfile = require("../Classs/Politics/PoliticsProfile")
const router = express()

router.post('/', function (req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    const type = req.body.type;

    get(email, pass, type, res)
})

router.get('/logout', function (req, res) {
    const id = req.query.id;
    const type = req.query.type;
    logOut(id, type, res)
})

router.get('/checkEmail', function (req, res) {
    const email = req.query.email;
    const type = req.query.type;
    emailExsit(email, type, res)
})

async function emailExsit(email, type, res) {
    let errors = []
    let emails = await getProfilesByType(type, {}, 'email')
    if (emails == undefined) {
        res.send({ "errors": [] })
        return
    }
    for (i = 0; i < emails.length; i++) {
        if (emails[i].email == email) {
            errors.push(email + " is taken")
        }
    }
    res.send({ "errors": errors })
}

async function logOut(id, type, res) {
    let profile = await getProfileByType(type, { _id: id }, '').catch(err => console.log(err))
    profile.loggedIn = false
    profile.save()
    res.send()
}

async function get(email, pass, type, res) {
    if (email.length > 0 && !validateEmail(email)) {
        res.send({ "errors": ["email," + email + " is not a valid email"] })
        return
    }

    let profile = await getProfileByType(type, { email: email }, '')

    if (profile == null) {
        res.send({ "errors": ["email, no user with email " + email] })
        return
    }

    if (profile.password === pass) {
        profile.timeStemp = Date.now()
        profile.loggedIn = true
        profile.save()
        res.send(profile)
    }
    else {
        res.send({ "errors": ["password," + "password is incorrect"] })
    }
}

router.post('/sign_up', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const confPass = req.body.confirmPassword
    const birthdate = req.body.birthdate;
    const gender = req.body.gender;
    const looking = req.body.lookingGender;
    const bio = req.body.bio;
    const images = req.body.images;
    const type = req.body.type;
    const id = req.body.id
    save(id, name, email, birthdate, pass, confPass, gender, looking, bio, images, type, res)
})

function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

function _calculateAge(birthday) { 
    const componnets = birthday.split('/')
    const date = new Date(componnets[2], componnets[1], componnets[0])
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function save(id, name, email, birthdate, password, confirmPassword, gender, looking, bio, images, type, res) {
    let errors = []

    if (name.length == 0) {
        errors.push("name,Name can not be empty")
    }

    if (password.length < 6) {
        errors.push("password,Password must have at least 6 characters")
    }
    else if (password !== confirmPassword && password) {
        errors.push("passwords,Passwords do not match")
    }

    if (gender.length == 0) {
        errors.push("gender,Must choose gender")
    }

    if (looking.length == 0) {
        errors.push("lookingGender,Must choose gender")
    }

    if (birthdate.length == 0) {
        errors.push("brithdate,Must choose brithdate")
    }
    else {
        const age = _calculateAge(birthdate)
        if (age < 14) {
            errors.push("brithdate, age: " + age + " - Must be at lest 14 years old")
        }
    }

    if (!validateEmail(email)) {
        errors.push("email," + email + " Is not a valid email")
    }

    const emails = await getProfilesByType(type, {}, 'email')

    if (emails != undefined && email.length > 0) {
        for (i = 0; i < emails.length; i++) {
            if (emails[i].email === email) {
                errors.push("email," + email + " is taken")
            }
        }
    }

    if (errors.length > 0) {
        res.send({ "errors": errors })
        return
    }

    const array = images.split(",")
    const imagesArray = []

    for (i = 0; i < array.length; i++) {
        imagesArray.push({
            name: array[i]
        })
    }

    let dict = {
        "name": name,
        "birthdate": birthdate,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword,
        "gender": gender,
        "looking": looking,
        "bio": bio,
        "images": imagesArray,
        "type": type
    }

    if (id != undefined) {
        dict["_id"] = id
    }

    let profile = await getProfilesType(type, dict)

    if (profile == undefined) {
        res.send(null)
        return
    }

    const result = await profile.save().catch((err => console.log(err)))
    res.send(result)
}

async function getProfileByType(type, query, params) {
    let p = undefined

    if (type == "Romantic") {
        p = await Profile.findOne(query, params).catch(err => console.log(err))
    }
    else if (type == "Sport") {
        p = await SportProfile.findOne(query, params).catch(err => console.log(err))
    }
    else if (type == "Business") {
        p = await BusinessProfile.findOne(query, params).catch(err => console.log(err))
    }
    else if (type == "Politics") {
        p = await PoliticsProfile.findOne(query, params).catch(err => console.log(err))
    }
    else { return }

    return p
}

async function getProfilesByType(type, query, params) {
    let p = undefined

    if (type == "Romantic") {
        p = await Profile.find(query, params).catch(err => console.log(err))
    }
    else if (type == "Sport") {
        p = await SportProfile.find(query, params).catch(err => console.log(err))
    }
    else if (type == "Business") {
        p = await BusinessProfile.find(query, params).catch(err => console.log(err))
    }
    else if (type == "Politics") {
        p = await PoliticsProfile.find(query, params).catch(err => console.log(err))
    }
    else { return }

    return p
}

function getProfilesType(type, params) {
    if (type == "Romantic") {
        return Profile(params)
    }
    else if (type == "Sport") {
        return SportProfile(params)
    }
    else if (type == "Business") {
        return BusinessProfile(params)
    }
    else if (type == "Politics") {
        return PoliticsProfile(params)
    }
    else { return }
}

module.exports = router