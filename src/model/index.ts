import * as mongoose from 'mongoose'
import { url } from '../config'

mongoose.connect(url, err => {
  if (err) {
    console.error('connect to %s error', url, err)
    process.exit(1)
  }
})

export { User } from './user'
export { Vote } from './vote'