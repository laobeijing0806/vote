import * as mongoose from 'mongoose'

const url = 'mongodb://127.0.0.1:27017/vote'

mongoose.connect(url, err => {
  if (err) {
    console.error('connect to %s error', url, err.message)
    process.exit(1)
  }
})

export { User } from './user'
export { Vote } from './vote'