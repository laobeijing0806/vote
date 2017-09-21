"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const createNew = (data) => model_1.Vote.create(data);
exports.createNew = createNew;
const getAll = (openid) => {
    return model_1.Vote.
        find({ openid: openid }, { '__v': 0 }).
        where('is_del').equals(0);
};
exports.getAll = getAll;
const deleteOne = (id) => model_1.Vote.update({ _id: id }, { $set: { 'is_del': 1 } });
exports.deleteOne = deleteOne;
//# sourceMappingURL=vote.js.map