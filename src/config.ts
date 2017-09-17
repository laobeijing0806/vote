// 根据环境切换数据库

const env = process.env.NODE_ENV
const localMongo = 'mongodb://127.0.0.1:27017/vote'
const cloudMongo = 'mongodb://lbj:qawsed@dds-bp164725c19e29c42.mongodb.rds.aliyuncs.com:3717,dds-bp164725c19e29c41.mongodb.rds.aliyuncs.com:3717/lbjtest?replicaSet=mgset-2699659'

export const url = env === 'dev' ? localMongo : cloudMongo