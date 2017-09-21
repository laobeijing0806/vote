"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user = require("../lib/user");
const vote = require("../lib/vote");
const api = new Router({
    prefix: '/api'
});
api.
    get('/wx_verify', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const echostr = yield ctx.request.query;
    if (echostr) {
        ctx.body = echostr;
    }
    else {
        ctx.throw(403);
    }
}))
    .get('/check', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const userInfo = yield user.get_user('openid');
    const last_check_time = userInfo.last_check_time;
    const check_day = userInfo.check_day;
    let checked = true;
    const current_time = Date.now();
    const current_day = current_time / (3600 * 24 * 1000);
    const last_check_day = last_check_time / (3600 * 24 * 1000);
    if (current_day - last_check_day >= 1) {
        checked = false;
    }
    ctx.body = JSON.stringify({
        check_day,
        checked,
        last_check_time
    });
}))
    .post('/check', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const userInfo = yield user.get_user('openid');
    let points = userInfo.points;
    let check_day = userInfo.check_day;
    const last_check_time = userInfo.last_check_time;
    const current_time = Date.now();
    const current_day = current_time / (3600 * 24 * 1000);
    const last_check_day = last_check_time / (3600 * 24 * 1000);
    if (current_day - last_check_day < 1) {
        ctx.body = JSON.stringify({
            err: 1,
            msg: 'You have checked today!'
        });
    }
    else {
        check_day += 1;
        points += 1;
        yield user.update_info('openid', {
            check_day,
            points,
            last_check_time: Date.now()
        });
        ctx.body = JSON.stringify({
            err: 0,
            msg: 'check success'
        });
    }
}))
    .get('/user/info', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const userInfo = yield user.get_user('openid');
    ctx.body = JSON.stringify({
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        points: userInfo.points,
        check_day: userInfo.check_day,
        last_check_time: userInfo.last_check_time,
        headimg: userInfo.headimg
    });
}))
    .post('/new', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const { type, data } = ctx.request.body;
    let msg = yield vote.createNew({
        openid: 'openid',
        type,
        data,
        last_change_time: Date.now(),
        is_del: 0
    });
    if (msg) {
        const userInfo = yield user.get_user('openid');
        let points = userInfo.points;
        points = --points;
        if (points < 1) {
            ctx.body = JSON.stringify({
                err: 1,
                msg: '你已经没有分了'
            });
        }
        else {
            yield user.adjust_points('openid', points);
            ctx.body = JSON.stringify({
                err: 0,
                msg: 'Success'
            });
        }
    }
    else {
        ctx.body = JSON.stringify({
            err: 1,
            msg: 'Error'
        });
    }
}))
    .get('/all', (ctx) => __awaiter(this, void 0, void 0, function* () {
    let dataList = yield vote.getAll('openid');
    const userInfo = yield user.get_user('openid');
    dataList.forEach(data => {
        data._doc.nickname = userInfo.nickname;
    });
    ctx.body = JSON.stringify({
        data: dataList
    });
}))
    .delete('/qv', (ctx) => __awaiter(this, void 0, void 0, function* () {
    let url = ctx.request.query;
    const userInfo = user.get_user('openid');
    if ('openid' !== userInfo.openid) {
        ctx.body = JSON.stringify({
            err: 403,
            msg: 'You can only delete things that you created!'
        });
    }
    try {
        const msg = yield vote.deleteOne(url.id);
        ctx.body = JSON.stringify({
            err: 0,
            msg: 'success'
        });
    }
    catch (e) {
        ctx.body = JSON.stringify({
            err: 1,
            message: e.message
        });
    }
}));
exports.default = api;
//# sourceMappingURL=api.js.map