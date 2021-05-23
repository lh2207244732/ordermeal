const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    funcList: [
      {
        name: '发布商品',
        icon: 'add-o',
        background: '#f86a63'
      },
      {
        name: '商品管理',
        icon: 'bag-o',
        background: '#f8b81b'
      },
      {
        name: '通知管理',
        icon: 'volume-o',
        background: '#1ab3ff'
      },
      {
        name: '订单管理',
        icon: 'orders-o',
        background: '#2cd465'
      },
      {
        name: '店铺信息',
        icon: 'shop-o',
        background: '#cb8f50'
      },
    ]
  },

  //通知消息编辑
  handleNoticeEdit() {
    console.log('消息编辑...');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取url参数
    // const { openid } = options
    //请求数据 查询店铺信息
    // const storeRes = await db.collection('om_store').where({openid}).get()
    // console.log(storeRes.data[0]);
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