"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    openid: { type: String, required: true },
    nickname: { type: String, required: true },
    points: { type: Number, required: true },
    check_day: { type: Number, required: true },
    last_check_time: { type: Number, required: true },
    headimg: { type: String, required: true }
});
userSchema.index({ name: 1 });
const User = mongoose.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.js.map