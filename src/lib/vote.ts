import { Vote, User } from '../model'

const createNew = (data) => Vote.create(data)
const getAll = (openid) => {
  return Vote.
          find({openid: openid}, {'__v': 0}).
          where('is_del').equals(0)
}
const deleteOne = (id) => Vote.update({_id: id}, {$set: {'is_del': 1}})
export { createNew, getAll, deleteOne }