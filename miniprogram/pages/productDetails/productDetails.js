const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast } = app.globalData
const { getStorage,isLogin } = require('../../utils/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    swiperActiveIndex: 0,
    productInfo: {},
    isCollection: false,
  },

  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  //轮播图滑动 更新索引
  onSwiperChange(e) {
    this.setData({
      swiperActiveIndex: e.detail.current
    })
  },

  //进店铺详情
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

    //获取商品详情
    let productInfo = await this.getProductDetail(id)
    //获取是否收藏状态
    let isCollection = this.getCollectionStatus(productInfo)
    
    this.setData({
      productInfo,
      isCollection
    })
    Toast.clear()
  },

  //获取商品详情
  async getProductDetail(id) {
    let productRes = await wx.cloud.callFunction({
      name: 'getProduct',
      data: {
        id
      }
    })
    return productRes.result.data
  },

  //获取收藏状态
  getCollectionStatus(productInfo) {
    let res = false
    if (!isLogin()) {//没登录
      return res
    }

    //获取缓存中收藏夹数据
    let collList = getStorage('collectionList') || []
    if (collList.indexOf(productInfo) > -1) {
      res = true
    }
    return res
  },

  //收藏点击
  async hitCollection() {
    if (!isLogin()) {//如果没登录
      Toast.fail('请先登录')
      return
    }
    let { productInfo,isCollection } = this.data
    let collList = getStorage('collectionList') || []
    let inc
    let toast = ''

    if (isCollection) {//如果已赞，取消之
      //更新缓存
      let delIndex = collList.indexOf(productInfo)
      collList.splice(delIndex,1)
      //更新页面数据
      productInfo.collection--
      isCollection = false
      inc = -1
      toast = '取消成功'

    } else {//如果未赞，增加赞
      productInfo.collection++
      isCollection = true
      inc = 1
      toast = '收藏成功'
      collList.unshift(productInfo)
    }
    this.setData({
      productInfo,
      isCollection
    })
    wx.setStorageSync('collectionList', collList)
    await db.collection('om_product').doc(productInfo._id).update({
      data: {
        collection: _.inc(inc)
      }
    })
    Toast.success(toast)
  },

  //联系商家按钮
  onContactClick() {
    let phone = this.data.productInfo.storeObj.phone
    wx.makePhoneCall({
      phoneNumber: phone
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
    console.log('on share');
    let url = encodeURIComponent('/pages/productDetail/productDetail?id=' + this.data.productInfo._id);
    let title = '许院点餐'
 
    return {
      title,
      path: url 
    }
  }
})