import { User } from '../model'

const get_user = (openid: any) => User.findOne({ openid }, {'_id': 0})
const update_info = (openid: any, info: any) => User.update({openid}, {$set: { ...info }})
const adjust_points = (openid: any, points: number) => User.update({openid}, {$set: {'points': points}})

export { get_user, update_info, adjust_points }