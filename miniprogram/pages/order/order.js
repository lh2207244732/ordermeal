const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast } = app.globalData
const { getStorage } = require('../../utils/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 4,//默认tab栏索引
    uInfo: {},
    s4List: [],
    s0List: [],
    s2List: [],
    s3List: [],
    s4List: [],
  },

  //Tab栏点击
  async onTabClick(event) {
    Toast.loading({
      message: '加载中...',
      duration: 10000,
      forbidClick: true,
    });
    let { uInfo } = this.data
    let index = event.detail.name
    let res
    if (index == 4) {
      if (uInfo.role == 'store') {
        res = await db.collection('om_order').where({
          storeid: uInfo.openid
        }).get()
      } else {
        res = await db.collection('om_order').where({
          customerid: uInfo.openid
        }).get()
      }
      this.setData({
        s4List: res.data
      })
    } else {
      if (uInfo.role == 'store') {
        res = await db.collection('om_order').where({
          storeid: uInfo.openid,
          status: index
        }).get()
      } else {
        res = await db.collection('om_order').where({
          customerid: uInfo.openid,
          status: index
        }).get()
      }
      if (index==0) {
        this.setData({
          s0List: res.data
        })
      } else if (index==1) {
        this.setData({
          s1List: res.data
        })
      } else if (index==2) {
        this.setData({
          s2List: res.data
        })
      } else if (index==3) {
        this.setData({
          s3List: res.data
        })
      }
      
    }
    Toast.clear()
  },

  //进入订单详情
  toOrderDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + id,
    })
  },

  //进入店铺详情
  toStoreDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storeDetails/storeDetails?storeid=' + id,
    })
  },

  //更新订单状态
  async handleUpdateStatus(e) {
    Toast.loading({
      message: 'Loading...',
      duration: 10000,
      forbidClick: true,
    });
    const { id } = e.currentTarget.dataset
    const updateRes = await db.collection('om_order').doc(id).update({
      data: {
        status: _.inc(1)
      }
    })
    if (updateRes.stats.updated == 1) {
      this.onTabClick({
        detail: {
          name: 4
        }
      })
    } else {
      Toast.fail('更新失败')
    }
  },

  //取消订单
  async handleCancelOrder(e) {
    Toast.loading({
      message: 'Loading...',
      duration: 10000,
      forbidClick: true,
    });
    const { id,status,customerid,storeid,totalprice,productid } = e.currentTarget.dataset

    //未做餐的订单才可取消
    if (status != 1) {
      Toast.fail('订单无法取消')
      return
    }

    //更新订单状态为0
    const updateRes = await db.collection('om_order').doc(id).update({
      data: {
        status: 0
      }
    })
    if (updateRes.stats.updated == 1) {//取消成功

      //更新用户数据 消费额
      let uid = customerid
      await db.collection('om_user').where({
        openid: uid
      }).update({
        data: {
          cost: _.inc(-totalprice),
        }
      })
      //更新用户缓存数据
      let uInfo = getStorage('userInfo')
      uInfo.cost += -totalprice
      wx.setStorageSync('userInfo', uInfo)

      //更新商品数据
      await db.collection('om_product').doc(productid).update({
        data: {
          sales: _.inc(-1)
        }
      })

      //更新商家数据 销售额
      await db.collection('om_store').where({
        openid: storeid
      }).update({
        data: {
          sales: _.inc(-totalprice),
        }
      })

      //重新获取数据
      this.onTabClick({
        detail: {
          name: 4
        }
      })
    } else {
      Toast.fail('取消失败')
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uInfo = getStorage('userInfo')
    this.setData({
      uInfo
    })
    this.onTabClick({
      detail: {
        name: 4
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})