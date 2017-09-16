import * as Router from 'koa-router'
import * as user from '../lib/user'
import * as vote from '../lib/vote'

interface UserInfo {
  openid: string
  nickname: string
  points: number
  check_day: number
  last_check_time: number
  headimg: string
}

const api = new Router({
  prefix: '/api'
})

api.
  get('/wx_verify', async ctx => {
    const echostr = await ctx.request.query
    if (echostr) {
      ctx.body = echostr
    } else {
      ctx.throw(403)
    }
  })
  .get('/check', async ctx => {
    const userInfo: UserInfo = await user.get_user('openid')
    const last_check_time = userInfo.last_check_time
    const check_day = userInfo.check_day
    let checked: boolean = true

    const current_time: number = Date.now()
    const current_day: number = current_time / (3600 * 24 * 1000)
    const last_check_day: number = last_check_time / (3600 * 24 * 1000)

    if (current_day - last_check_day >= 1) {
      checked = false
    }

    ctx.body = JSON.stringify({
      check_day,
      checked,
      last_check_time
    })
  })
  .post('/check', async ctx => {
    const userInfo: UserInfo = await user.get_user('openid')
    let points = userInfo.points
    let check_day = userInfo.check_day
    const last_check_time = userInfo.last_check_time

    const current_time: number = Date.now()
    const current_day: number = current_time / (3600 * 24 * 1000)
    const last_check_day: number = last_check_time / (3600 * 24 * 1000)

    if (current_day - last_check_day < 1) {
      ctx.body = JSON.stringify({
        err: 1,
        msg: 'You have checked today!'
      })
    } else {
      check_day += 1
      points += 1

      await user.update_info('openid', {
        check_day,
        points,
        last_check_time: Date.now()
      })

      ctx.body = JSON.stringify({
        err: 0,
        msg: 'check success'
      })
    }
  })
  .get('/user/info', async ctx => {
    const userInfo: UserInfo = await user.get_user('openid')
    ctx.body = JSON.stringify({ 
      openid: userInfo.openid,
      nickname: userInfo.nickname,
      points: userInfo.points,
      check_day: userInfo.check_day,
      last_check_time: userInfo.last_check_time,
      headimg: userInfo.headimg
     })
  })
  .post('/new', async ctx => {
    const { type, data } = ctx.request.body
    let msg = await vote.createNew({
      openid: 'openid',
      type,
      data,
      last_change_time: Date.now(),
      is_del: 0
    })

    if (msg) {
      const userInfo: UserInfo = await user.get_user('openid')
      let points = userInfo.points
      points = --points
      if (points < 1) {
        ctx.body = JSON.stringify({
          err: 1,
          msg: '你已经没有分了'
        })
      } else {
        await user.adjust_points('openid', points)
        ctx.body = JSON.stringify({
          err: 0,
          msg: 'Success'
        })
      }
    } else {
      ctx.body = JSON.stringify({
        err: 1,
        msg: 'Error'
      })
    }
  })
  .get('/all', async ctx => {
    let dataList = await vote.getAll('openid')
    const userInfo: UserInfo = await user.get_user('openid')
    dataList.forEach(data => {
      data._doc.nickname = userInfo.nickname
    })
    ctx.body = JSON.stringify({
      data: dataList
    })
  })
  .delete('/qv', async ctx => {
    let url = ctx.request.query
    const userInfo: UserInfo = user.get_user('openid')
    if ('openid' !== userInfo.openid) {
      ctx.body = JSON.stringify({
        err: 403,
        msg: 'You can only delete things that you created!'
      })
    }
    try {
      const msg = await vote.deleteOne(url.id)
      ctx.body = JSON.stringify({
        err: 0,
        msg: 'success'
      })
    } catch (e) {
      ctx.body = JSON.stringify({
        err: 1,
        message: e.message
      })
    }
  })

export default api
