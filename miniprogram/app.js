//app.js
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';

App({
  onLaunch: function () {
    let _this = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}

    wx.getSystemInfo({
      success: function (res) {
        _this.globalData = {
          statusBarHeight: res.statusBarHeight,
          Toast: Toast
        }
      }
    })
  }
})

/*

om_user 集合
_id
openid
avatarUrl
gender   1男  0女
nickName
role   'user' 'store'
phone
cost  消费额
orders  订单量


om_store  店铺集合
_id
logoUrl
name
notice
diningRoom
productList
openid
address
phone
orders  订单量
sales 销售额
collections  收藏量


om_product  商品集合
_id
imgList: []
price: 234
collection: 54
title: 
describe
ingredients  主料、成份
weight  份量
sort   早餐  午餐 晚餐 
publisher 商家的openid
 

*/
