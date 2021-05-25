const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    productInfo: {}
  },

  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  goStoreDetail(e) {
    const openid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storeDetails/storeDetails?storeid=' + openid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    Toast.loading({
      message: '加载中...',
      duration: 10000,
      forbidClick: true,
    });
    const { id } = options
    const productRes = await wx.cloud.callFunction({
      name: 'getProduct',
      data: {
        id:id
      }
    })
    this.setData({
      productInfo: productRes.result.data
    })
    Toast.clear()
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