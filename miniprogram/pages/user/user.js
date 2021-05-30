// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData
const { saveUserInfo,getStorage,deleteStorage,isLogin } = require('../../utils/index.js')
const { getUserProfile } = require('../../utils/asyncWx.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      cost: 0,
      orders: 0
    },
    collectionLen: 0
  },
  
  //登录
  async handleLogin() {
    let uinfo = this.data.userInfo
    if (uinfo.avatarUrl) {
      return
    }
    let _this = this

    Toast.loading({
      message: '登录中...',
      duration: 10000,
      forbidClick: true,
    });

    //获取用户账号信息
    const userInfo = await getUserProfile({desc: '用户登录授权'})
    const { avatarUrl,gender,nickName } = userInfo.userInfo
    
    //获取openid
    const loginRes = await wx.cloud.callFunction({name:'login',data:{}})
    const { openid,isMember } = loginRes.result

    if (!isMember) {//未注册
      //调用云函数注册用户
      const addUserRes = await wx.cloud.callFunction({
        name: 'addUser',
        data: {
          avatarUrl,
          gender,
          nickName,
          openid
        }
      })
      //存储用户信息
      _this.updateUserInfo(addUserRes.result.user)
    } else {//查询用户信息
      const userRes = await db.collection('om_user').where({ openid }).get()
      //存储用户信息
      _this.updateUserInfo(userRes.data[0])
    }
  },

  //存储用户信息
  updateUserInfo(userInfo) {
    saveUserInfo(userInfo)
    this.setData({
      userInfo
    })
    Toast.success('登录成功');
  },

  //注销
  handleLogout() {
    if (!isLogin()) {
      return
    }
    deleteStorage('userInfo')
    this.setData({
      userInfo: {},
      collectionLen: 0
    })
    Toast.success('退出成功');
  },

  //点击我的店铺
  async handleOpenStore() {
    let _this = this
    const { openid } = _this.data.userInfo
    //查询店铺
    const storeRes = await db.collection('om_store').where({ openid }).get()
    
    if (!storeRes.data[0]) { //没查到走注册
      wx.navigateTo({
        url:'/pages/registerStore/registerStore'
      })
    } else {//查到进入店铺管理
      wx.navigateTo({
        url: '/pages/storeManage/storeManage?openid=' + openid,
      })
    }
  },

  //去收藏页
  toCollectionList() {
    if (!isLogin()) {
      Toast.fail('暂未登录');
      return
    }
    wx.navigateTo({
      url: '/pages/collectionList/collectionList',
    })
  },

  //去收货地址页
  toAddress() {
    if (!isLogin()) {
      Toast.fail('暂未登录');
      return
    }
    wx.navigateTo({
      url: '/pages/address/address',
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
    //检测登录  查缓存中数据
    //1. 如果有，无需再请求登录
    const userInfo = getStorage('userInfo')
    const collectionList = getStorage('collectionList')
    if (userInfo.openid) {
      this.setData({
        userInfo,
        collectionLen: collectionList.length
      })
    }
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