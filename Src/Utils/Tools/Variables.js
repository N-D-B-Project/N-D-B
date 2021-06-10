require("dotenv").config();

const config = require("../../Config/Config.js");

let token;
let mongouri;

if(config.dev) {
    token = process.env.Dev_Token;
    mongouri = process.env.MongoURI;
} else if(config.dev) {
    token = process.env.token
    mongouri = process.env.MongoURI;
}

module.exports = {
    token,
    mongouri
}