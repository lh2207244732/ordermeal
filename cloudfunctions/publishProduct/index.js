// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = event
  data.collection = 0
  data.sales = 0
  data.status = 0
  //添加数据
  const addRes = await db.collection('om_product').add({
    data
  })

  
  

  if (addRes._id) {//添加成功
    //查询数据
    const productRes = await db.collection('om_product').doc(addRes._id).get()

    //更新店铺中的数据
    const { storeid } = data
    await db.collection('om_store').where({openid: storeid}).update({
      data: {
        productList: _.unshift(productRes.data)
      }
    })
  }
  return {
    status: 0
  }
}