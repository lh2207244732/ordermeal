const app = getApp()
const { Toast } = app.globalData
const { uploadFile,deleteFile } = require('../../utils/asyncWx.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeid: '',
    diningRoom: '',
    imageList: [],
    title: '',
    price: null,
    describe: '',
    ingredients: '',
    weight: '',
    sort: '早餐',
    isPub: false
  },

  //上传图片
  async handleUploaded(event) {
    const { file } = event.detail;
    let uploadRes = await uploadFile({
      cloudPath: 'om_product/productImg_' + Date.now() + '.png',
      filePath: file.url,
    })
    // console.log(uploadRes.fileID);
    const { imageList = [] } = this.data;
    imageList.push(uploadRes.fileID);
    this.setData({ imageList });
  },

  //删除图片
  async handleDelImage(e) {
    const { index } = e.currentTarget.dataset
    const { imageList } = this.data
    let fileId = imageList[index]
    await deleteFile({
      fileList: [fileId]
    })
    imageList.splice(index,1)
    this.setData({
      imageList
    })
  },

  //预览大图
  handlePreviewImage(e) {
    const { index } = e.currentTarget.dataset
    const { imageList } = this.data
    wx.previewImage({
      urls: imageList,
      showmenu: true,
      current: imageList[index]
    })
  },

  //分类选择
  onSortChange(event) {
    this.setData({
      sort: event.detail,
    });
  },

  //提交点击
  handleSubmit() {
    //验证表单
    const val = this.validate()
    if (val) {
      this.requestPublish()
    }
  },
  
  //验证表单
  validate() {
    const { imageList,title,price,describe,ingredients,weight } = this.data
    if (imageList.length < 1) {
      Toast.fail('未上传主图');
      return false
    }
    if (!title) {
      Toast.fail('未填写标题');
      return false
    }
    if (!price) {
      Toast.fail('未填写价格');
      return false
    }
    if (!describe) {
      Toast.fail('未填写描述');
      return false
    }
    if (!ingredients) {
      Toast.fail('未填写主料');
      return false
    }
    if (!weight) {
      Toast.fail('未填写份量');
      return false
    }
    return true
  },

  //请求发布商品
  async requestPublish() {
    Toast.loading({
      message: '发布中...',
      duration: 10000,
      forbidClick: true,
    });

    const { storeid,diningRoom,imageList,title,price,describe,ingredients,weight,sort } = this.data
    const pubRes = await wx.cloud.callFunction({
      name: 'publishProduct',
      data: {
        data: { storeid,diningRoom,imageList,title,price,describe,ingredients,weight,sort }
      }
    })
    const { status } = pubRes.result
    if (status == 0) {//成功
      this.setData({
        isPub: true
      })
      Toast.success('发布成功');
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
      },1000)
      
    } else {
      Toast.fail('发布失败');
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { storeid,diningRoom } = options
    this.setData({
      storeid,
      diningRoom
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
  onUnload: async function () {
    const { imageList,isPub } = this.data
    if (!isPub && imageList.length > 0) {//如果没发布商品 删除图片
      await deleteFile({
        fileList: imageList
      })
    }
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