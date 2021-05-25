const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {}
  },

  //拨打电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '1340000'
    })
  },

  //去商品详情页
  goProductDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + id,
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
    const { storeid } = options

    //请求数据 查询店铺信息
    const storeRes = await db.collection('om_store').where({openid:storeid}).get()
    this.setData({
      storeInfo: storeRes.data[0]
    })
    Toast.clear()
    /*
      address: "许昌学院满庭芳餐厅一楼 1号窗口 快递餐"
collection: 0
diningRoom: "满庭芳餐厅"
logoUrl: "cloud://cloud1-6g41byxc4dfd0202.636c-cloud1-6g41byxc4dfd0202-1305805157/om_store/storeLogo_oClRs5AcDoSMeWXP3Qs77Qg5W__w1621833825870.png"
name: "快递餐"
notice: "新公告"
openid: "oClRs5AcDoSMeWXP3Qs77Qg5W__w"
orders: 0
phone: "13412341234"
productList: []
sales: 0
_id: "28ee4e3e60aa0adb1b9a205c61019e34"
_openid: "oClRs5AcDoSMeWXP3Qs77Qg5W__w"
    */
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