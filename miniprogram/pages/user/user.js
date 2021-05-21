// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()

const { Toast } = app.globalData
const { saveUserInfo,deleteStorage,isLogin } = require('../../utils/index.js') 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      cost: '-',
      orders: '-'
    }
  },
  
  //登录
  async handleLogin() {
    let _this = this

    Toast.loading({
      message: '登录中...',
      duration: 0,
      forbidClick: true,
    });

    //获取用户账号信息
    const userInfo = await wx.getUserProfile({desc: '用户登录授权'})
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
      const userRes = await db.collection('order_user').where({ openid }).get()
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
    deleteStorage('userInfo')
    this.setData({
      userInfo: {}
    })
    Toast.success('退出成功');
  },

  //未登录点击事件
  handleNoLogin() {
    if (!isLogin()) {
      Toast.fail('暂未登录');
    }
  },

  //点击我的店铺
  async handleOpenStore() {
    let _this = this

    //查询店铺
    const storeRes = await db.collection('om_store').where({
      openid: _this.data.userInfo.openid
    }).get()
    if (!storeRes.data[0]) {
      wx.navigateTo({
        url:'/pages/registerStore/registerStore'
      })
    } else {

    }

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