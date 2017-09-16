import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const voteSchema = new Schema({
  openid: {type: String, required: true},
  type: {type: String, required: true},
  data: {type: String, required: true},
  last_change_time: {type: Number, required: true},
  is_del: {type: Number, required: true},
  publisher: {type: Schema.Types.ObjectId, ref: 'User'}
})

voteSchema.index({name: 1})

const Vote = mongoose.model('Vote', voteSchema)

export { Vote }