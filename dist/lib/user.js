"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const get_user = (openid) => model_1.User.findOne({ openid }, { '_id': 0 });
exports.get_user = get_user;
const update_info = (openid, info) => model_1.User.update({ openid }, { $set: Object.assign({}, info) });
exports.update_info = update_info;
const adjust_points = (openid, points) => model_1.User.update({ openid }, { $set: { 'points': points } });
exports.adjust_points = adjust_points;
//# sourceMappingURL=user.js.map