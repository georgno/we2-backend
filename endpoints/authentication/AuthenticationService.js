const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const User = require('../user/UserModel.js');

app.use(express.json());

async function authenticateUser(header, callback) {
    if(isBase64(header)) header = Buffer.from(header, 'base64')
    let credentials = header.split(' ')[1];
    credentials = Buffer.from(credentials,'base64')
    const [username, password] = credentials.toString().split(':');
    const user = await authenticate({ username, password });
    if (!user) {
        callback('Invalid Authentication Credentials', null);
    } else {
        callback(null, user)
    }
};

async function createJWT(user, callback) {
    let username = user.userName;
    const tokenSecret = config.get('session.tokenKey');
    const accessToken = jwt.sign({"userID" : username}, tokenSecret);
    callback(null, accessToken);
}

// AUTHENTICATE

async function authenticate(incoming) {
    try {
        var existing = await User.findOne({ userID: incoming.username });
        var pwMatch = await bcrypt.compare(incoming.password, existing.password);

        if (pwMatch) return existing;
        return null;
    } catch (error) {
        return null;
    }
}

function isBase64(str) {
    if (str ==='' || str.trim() ===''){ return false; }
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}



module.exports = {
    authenticateUser,
    createJWT
}