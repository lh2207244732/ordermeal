const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { avatarUrl,gender,nickName,openid } = event
  await db.collection('om_user').add({
    data: {
      avatarUrl,
      gender,
      nickName,
      openid,
      role: 'user',
      phone: '',
      cost: 0,
      orders: 0
    }
  })
  await db.collection('om_address').add({
    data: {
      openid: openid,
      addressList: []
    }
  })
  const user = await db.collection('om_user').where({ openid }).get()
  return {
    user: user.data[0]
  }
}

