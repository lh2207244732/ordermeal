// pages/registerStore/registerStore.js
const { getStorage } = require('../../utils/index.js')
const { uploadFile } = require('../../utils/asyncWx.js')
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
      cloudPath: 'om_store/storeLogo_' + _this.data.userInfo.openid+'.png',
      filePath: file.url,
    })
    console.log(uploadRes.fileID);
    _this.setData({
      fileList: [{
        name: 'store_logo',
        url: uploadRes.fileID
      }]
    })
  },

  //删除图片
  handleDeleteLogo(e) {
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
    console.log(123);
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