const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast } = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshIconShow: true,
    surplusPeople: 0,
    activeNames: ['1'],
    cancelSteps: [{ text: '已取消' }],
    steps: [
      { text: '待做餐'},
      { text: '待取餐'},
      { text: '已完成'}
    ],
    orderData: {}
  },

  handleRefresh() {
    const { status } = this.data.orderData
    if (status == 0 || status == 2 || status == 3) {
      Toast.fail('订单已结束')
      return
    }
    this.setData({
      refreshIconShow: false
    })
    setTimeout(()=>{
      this.updateSurplusPeople()
      this.setData({
        refreshIconShow: true
      })
    }, 1000)
  },
  handleRefreshLeave() {
    this.setData({
      refreshIconShow: false
    })
  },

  async updateSurplusPeople() {
    //查询商家openid所有订单  本订单时间之前 状态为1
    const { storeid,status,registerTime } = this.data.orderData
    const { year, month, day, hour, minute, second } = registerTime
    let res = await db.collection('om_order').where(_.or([
      {
        storeid,
        status: 1,
        'registerTime.year': year,
        'registerTime.month': month,
        'registerTime.day': day,
        'registerTime.hour': _.lt(hour),
      },
      {
        storeid,
        status: 1,
        'registerTime.year': year,
        'registerTime.month': month,
        'registerTime.day': day,
        'registerTime.hour': hour,
        'registerTime.minute': _.lt(minute),
      },
      {
        storeid,
        status: 1,
        'registerTime.year': year,
        'registerTime.month': month,
        'registerTime.day': day,
        'registerTime.hour': hour,
        'registerTime.minute': minute,
        'registerTime.second': _.lt(second),
      },
    ])).get()
    let len = res.data.length
    this.setData({
      surplusPeople: len
    })
  },

  //折叠面板点击
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { id } = options
    let res = await db.collection('om_order').doc(id).get()
    let orderData = res.data
    //时间格式化
    orderData.time = orderData.registerTime.year+'-' + orderData.registerTime.month + '-' + orderData.registerTime.day + ' ' + orderData.registerTime.hour+':'+ orderData.registerTime.minute+':'+orderData.registerTime.second
    this.setData({
      orderData
    })
    this.updateSurplusPeople()
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