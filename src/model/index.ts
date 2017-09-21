import * as mongoose from 'mongoose'
import { url } from '../config'

mongoose.connect(url, err => {
  err && console.error('connect to %s error', url, err)
})

export { User } from './user'
export { Vote } from './vote'