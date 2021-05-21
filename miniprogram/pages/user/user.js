// pages/user/user.js
// import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
const { Toast } = app.globalData
const { saveUserInfo,deleteStorage,isLogin } = require('../../utils/index.js') 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  
  //登录
  async handleLogin() {
    let _this = this

    //获取用户账号信息
    const userInfo = await wx.getUserProfile({desc: '用户登录授权'})
    // console.log('userInfo::', userInfo.userInfo);
    const { avatarUrl,gender,nickName } = userInfo.userInfo

    //获取openid
    const loginRes = await wx.cloud.callFunction({name:'login',data:{}})
    console.log('loginRes::', loginRes.result);
    const { openid } = loginRes.result

    //存储用户信息
    _this.updateUserInfo({
      avatarUrl,
      gender,
      nickName,
      openid
    })
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

  //
  handleNoLogin() {
    if (!isLogin()) {
      Toast.fail('暂未登录');
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