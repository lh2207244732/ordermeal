// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event
  let data
  //查询商品数据
  let productRes = await db.collection('om_product').doc(id).get()
  data = productRes.data

  //查询商家数据
  const { storeid } = data
  const storeRes = await db.collection('om_store')
                          .where({openid:storeid})
                          .field({
                            openid: 1,
                            diningRoom:1,
                            logoUrl: 1,
                            name: 1,
                          })
                          .get()
  data.storeObj = storeRes.data[0]

  return {
    data
  }
}