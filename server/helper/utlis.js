const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../../config/config.json");
const saltRounds = 10;

console.log('config.jwtsecret', config.jwtsecret)
const jwtSec = 'qwerty123'

module.exports = {
    createHash: (password) => {
        return bcrypt.hashSync(password, saltRounds);
    },
    compareHash: (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword); // Use compareSync for synchronous comparison
    },
    getOtp: () => {
        return Math.floor(100000 + Math.random() * 90000);
    },
    getToken: (payload) => {
        console.log('payload', payload)
        console.log('config.jwtsecret', config.jwtsecret)
        return jwt.sign(payload, jwtSec, { expiresIn: '30d' });
    },
};

const passwordHashing = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

// console.log(passwordHashing("admin@2612"));
