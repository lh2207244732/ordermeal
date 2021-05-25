const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast,Dialog } = app.globalData
const { getStorage } = require('../../utils/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj: {},
    actionSheetShow: false,
    name: '',
    phone: null,
    dormitory: '静庐宿舍',
    building: '',
    roomNumber: null,
  },

  //新增地址
  handleIncreaseAddress() {
    this.setData({
      actionSheetShow: true
    })
  },

  //关闭动作面板
  handleCloseActionSheet () {
    this.setData({
      actionSheetShow: false
    })
  },

  //宿舍选择
  onDormitoryChange(event) {
    this.setData({
      dormitory: event.detail,
    });
  },

  //保存地址
  handleSaveAddress() {
    if (this.validate()) {
      this.requestAddress()
    }
  },

  //验证表单
  validate() {
    const { name,phone,building,roomNumber } = this.data
    if (!name) {
      Toast.fail('请输入姓名')
      return false
    }
    if (!phone) {
      Toast.fail('请输入手机号')
      return false
    }
    if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone)) {
      Toast.fail('手机号格式有误');
      return false
    }
    if (!building) {
      Toast.fail('请输入楼号')
      return false
    }
    if (!roomNumber) {
      Toast.fail('请输入房间号')
      return false
    }
    return true
  },

  //请求新增
  async requestAddress() {
    let _this = this
    Toast.loading({
      message: '保存中...',
      duration: 10000,
      forbidClick: true,
    });
    const { addressObj,name,phone,dormitory,building,roomNumber } = this.data
    const openid = addressObj.openid
    let data = { 
      name,
      phone,
      dormitory,
      building,
      roomNumber,
      time: Date.now()
    }
    
    const addRes = await db.collection('om_address').where({openid}).update({
      data: {
        addressList: _.unshift(data)
      }
    })
    if (addRes.stats.updated == 1) {
      addressObj.addressList.unshift(data)
      this.setData({
        addressObj,
        name: '',
        phone: null,
        dormitory: '静庐宿舍',
        building: '',
        roomNumber: null,
      })
      Toast.success('保存成功')
      setTimeout(function(){
        _this.handleCloseActionSheet()
      },400)
    } else {
      Toast.fail('保存失败')
    }
  },

  //置顶地址
  async handlToTop(e) {
    const { index } = e.currentTarget.dataset
    if (index == 0) {
      return
    }
    const { addressObj } = this.data
    let { openid,addressList } = addressObj
    let temp = addressList.splice(index,1)[0]
    addressList.unshift(temp)
    const toTopRes = await db.collection('om_address').where({openid}).update({
      data: {
        addressList
      }
    })
    if (toTopRes.stats.updated == 1) {
      this.setData({
        ['addressObj.addressList']: addressList
      })
      Toast.success('设置成功')
    } else {
      Toast.fail('设置失败')
    }
  },

  //删除地址
  handleDelAddress(e) {
    const { index } = e.currentTarget.dataset
    Dialog.confirm({
      message: '确定要删除该地址吗？',
      theme: 'round-button',
    }).then(() => {
      // on confirm
      // console.log('on confirm');
      this.requestDeleteAddress(index)
    })
    .catch(() => {
      // on cancel
      // console.log('on cancel');
    });
  },
  async requestDeleteAddress(index) {
    const { addressObj } = this.data
    addressObj.addressList.splice(index,1)
    const { openid,addressList } = addressObj
    const delRes = await db.collection('om_address').where({openid}).update({
      data: {
        addressList
      }
    })
    if (delRes.stats.updated == 1) {
      this.setData({
        ['addressObj.addressList']: addressList
      })
      Toast.success('删除成功')
    } else {
      Toast.fail('删除失败')
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
  onShow: async function () {
    const uInfo = getStorage('userInfo')
    const { openid } = uInfo
    //获取数据
    const addressRes = await db.collection('om_address').where({openid}).get()
    // console.log(addressRes.data[0]);
    this.setData({
      addressObj: addressRes.data[0]
    })
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