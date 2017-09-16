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
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const path = require("path");
const index_1 = require("./router/index");
const api_1 = require("./router/api");
const app = new Koa();
// 全局错误处理
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            status: err.status || 500,
            message: err.message
        };
    }
}));
app.use(bodyParser());
app.use(serve(path.join(__dirname, '../static/resources')));
app.use(index_1.default.routes());
app.use(api_1.default.routes());
let port = process.env.PORT || 3000;
app.listen(port);
console.log(`server is listening on ${port}`);
//# sourceMappingURL=app.js.map