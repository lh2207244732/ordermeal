const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetShow: false,
    diningRoomActiveIndex: 0,
    diningRoom: [
      {
        name: '满庭芳餐厅',
        index: 0
      },
      {
        name: '沁园春餐厅',
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
    ],
    limit: 6,
    hotStoreList: [],
    recProductList: [],
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
    Toast.loading({
      message: '加载中...',
      duration: 10000,
      forbidClick: true,
    });
    //获取首页数据
    this.getHotStore()
  },

  //获取首页热销店铺
  async getHotStore() {
    const { diningRoomActiveIndex,diningRoom,productOrder,productSort,limit } = this.data
    let activeRoom = diningRoom[diningRoomActiveIndex].name

    //获取首页热销店铺数据
    const hotStoreRes = await db.collection('om_store').where({
      diningRoom: activeRoom
    }).field({
      logoUrl: 1,
      name: 1,
      openid: 1,
      productList: 1
    }).limit(3).get()
    this.setData({
      hotStoreList: hotStoreRes.data
    })

    Toast.clear()

    //获取推荐商品数据
    // this.getProductList(activeRoom,productOrder,productSort,0,limit)
  },

  async getProductList(diningRoom,order,sort,skip,limit) {
    let newProList
    if (order == 'sales') {
      newProList = await db.collection('om_product').where({
        diningRoom,
        sort,
      }).orderBy(order, 'desc').skip(skip).limit(limit).get()
    } else {
      newProList = await db.collection('om_product').where({
        diningRoom,
        sort,
      }).skip(skip).limit(limit).get()
    }
    console.log(newProList);
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