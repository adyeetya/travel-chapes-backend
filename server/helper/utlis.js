const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("../../config/config")
const saltRounds = 10;
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
        return jwt.sign(payload, global.gConfig.jwtsecret, { expiresIn: '30d' });
    },
};

const passwordHashing = (password) => {
    return bcrypt.hashSync(password, saltRounds);
};

// console.log(passwordHashing("admin@2612"));
