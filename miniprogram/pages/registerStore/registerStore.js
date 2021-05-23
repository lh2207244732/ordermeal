const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData
const { getStorage } = require('../../utils/index.js')
const { uploadFile,deleteFile } = require('../../utils/asyncWx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    fileList: [],
    userInfo: {},
    ActionSheetShow: false,
    actionSheetActiveIndex: 0,
    diningRoom: [
      {name: '满庭芳餐厅',index:0},
      {name: '沁园春餐厅',index:1},
    ]
  },

  //上传图片
  async handleUploaded(event) {
    let _this = this
    const { file } = event.detail;
    let uploadRes = await uploadFile({
      cloudPath: 'om_store/storeLogo_' + _this.data.userInfo.openid + Date.now() + '.png',
      filePath: file.url,
    })
    console.log(uploadRes.fileID);
    _this.setData({
      fileList: [{
        name: 'store_logo' + Date.now(),
        url: uploadRes.fileID
      }]
    })
  },

  //删除图片
  async handleDeleteLogo(e) {
    let fileId = this.data.fileList[0].url
    await deleteFile({
      fileList: [fileId]
    })
    this.setData({
      fileList:[]
    })
  },

  //改变餐厅
  handleChangeRoom() {
    this.setData({
      ActionSheetShow: true
    })
  },
  onRoomClose() {
    this.setData({
      ActionSheetShow: false
    })
  },
  onSelect(event) {
    this.setData({
      actionSheetActiveIndex: event.detail.index
    })
  },


  //提交表单
  submitForm() {
    if (this.validateForm()) {
      this.registerStore()
    } else {
      Toast.fail('请完善信息');
    }
  },
  validateForm() {
    let { name,fileList } = this.data
    if (!name || fileList.length < 1) {
      return false
    }
    return true
  },


  //处理注册店铺逻辑
  async registerStore() {
    let data = this.data
    await db.collection('om_store').add({
      data:{
        name: data.name,
        logoUrl: data.fileList[0].url,
        diningRoom: data.diningRoom[data.actionSheetActiveIndex].name,
        productList: [],
        openid: data.userInfo.openid,
        address:'',
        phone: '',
        notice: '',
        collection: 0,
        orders: 0,
        sales: 0
      }
    })
    Toast.success('注册成功');
    wx.navigateTo({
      url: '/pages/storeManage/storeManage?openid=' + data.userInfo.openid,
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = getStorage('userInfo')
    this.setData({
      userInfo
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

  }
})