import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'

import api from './router/api'

const app = new Koa()

// 全局错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      status: err.status || 500,
      message: err.message
    }
  }
})

app.use(bodyParser())

app.use(api.routes())

let port:string | number = process.env.PORT || 3000

app.listen(port)

console.log(`server is listening on ${port}`)