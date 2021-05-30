const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast } = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    list: []
  },

  //输入
  onChange(e) {
    this.setData({
      keyword: e.detail,
    });
  },
  //点击搜索
  async onSearch() {
    Toast.loading({
      message: '搜索中...',
      duration: 10000,
      forbidClick: true,
    });
    let { keyword } = this.data
    const listRes = await db.collection('om_product').where(_.or([
      {
        title: db.RegExp({
          regexp: '.*' + keyword,
          options: 'i',
        })
      },
      {
        diningRoom: db.RegExp({
          regexp: '.*' + keyword,
          options: 'i',
        })
      },
      {
        sort: db.RegExp({
          regexp: '.*' + keyword,
          options: 'i',
        })
      }
    ])).get()

    this.setData({
      list: listRes.data
    })
    Toast.clear()
  },

  onCancel() {
    //数据清空
    this.setData({
      keyword: '',
      list: []
    })
    //返回
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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