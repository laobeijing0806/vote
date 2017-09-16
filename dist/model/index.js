"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const url = 'mongodb://127.0.0.1:27017/vote';
mongoose.connect(url, err => {
    if (err) {
        console.error('connect to %s error', url, err.message);
        process.exit(1);
    }
});
var user_1 = require("./user");
exports.User = user_1.User;
var vote_1 = require("./vote");
exports.Vote = vote_1.Vote;
//# sourceMappingURL=index.js.map