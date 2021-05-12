// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetShow: false,
    diningRoomActiveIndex: 0,
    diningRoom: [
      {
        name: '满庭芳',
        index: 0
      },
      {
        name: '沁园春',
        index: 1
      }
    ],
    productOrder: 'comprehensive',
    productOrderList: [
      { text: '综合排序', value: 'comprehensive' },
      { text: '销量优先', value: 'sales' },
    ],
    productSort: 'all',
    productSortList: [
      { text: '全部', value: 'all' },
      { text: '早餐', value: 'breakfast' },
      { text: '午餐', value: 'lunch' },
      { text: '晚餐', value: 'dinner' },
    ]
  },

  //搜索框点击
  handleSearch() {
    //跳转搜索页
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  //切换地址点击
  handleChangeAddress() {
    this.setData({
      actionSheetShow: true
    })
  },

  //动作面板关闭
  onActionSheetClose() {
    this.setData({ actionSheetShow: false });
  },
  //动作面板选择
  onActionSheetSelect(event) {
    let activeIndex = event.detail.index
    this.setData({
      diningRoomActiveIndex: activeIndex
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