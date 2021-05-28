const app = getApp()
const db = wx.cloud.database()
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
      message: '获取中...',
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
    console.log(res.data);
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