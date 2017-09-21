"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const config_1 = require("../config");
mongoose.connect(config_1.url, err => {
    err && console.error('connect to %s error', config_1.url, err);
});
var user_1 = require("./user");
exports.User = user_1.User;
var vote_1 = require("./vote");
exports.Vote = vote_1.Vote;
//# sourceMappingURL=index.js.map