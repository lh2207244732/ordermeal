const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const { Toast } = app.globalData
const { getStorage } = require('../../utils/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action_pop_show: false,
    actionSheetShow: false,
    popActiveIndex: 0,//弹框索引
    addressActiveIndex: 0,//地址选择索引
    pickMode: '自取',
    pickModeList: [
      { name: '自取' },
      { name: '配送' },
    ],
    pickTime: '0:00',
    reMark: '',
    payment: '当面付款',
    addressList: [],
    purchaseData: {},
  },

  //关闭弹框
  onActionPopClose() {
    this.setData({
      action_pop_show: false
    })
  },

  //打开弹窗
  openActionPop() {
    this.setData({
      action_pop_show: true
    })
  },

  //动作面板选择
  onActionSheetSelect(event) {
    this.setData({
      pickMode: event.detail.name
    })
  },
  //动作面板关闭
  onActionSheetClose() {
    this.setData({
      actionSheetShow: false
    })
  },

  //收货地址点击更换
  handleChangeAddress() {
    this.setData({
      popActiveIndex: 0,
      action_pop_show: true
    })
  },

  //确定更换地址
  selectedAddress(e) {
    let _this = this
    const { index } = e.currentTarget.dataset
    this.setData({
      addressActiveIndex: index
    })
    setTimeout(()=>{
      _this.onActionPopClose()
    },300)
  },

  //取餐方式点击
  handlePickModeClick() {
    this.setData({
      actionSheetShow: true
    })
  },

  //送餐时间点击
  handlePickTime() {
    this.setData({
      popActiveIndex: 1,
      action_pop_show: true
    })
  },

  //送餐时间界面点击取消
  onPickTimeCancel() {
    this.setData({
      action_pop_show: false
    })
  },

  //送餐时间选择
  onPickTimeClick(event) {
    let _this = this
    this.setData({
      pickTime: event.detail,
    });
    setTimeout(()=>{
      _this.onActionPopClose()
    },300)
  },

  //点击添加备注
  handleAddRemark() {
    this.setData({
      popActiveIndex: 2,
      action_pop_show: true
    })
  },

  //添加备注确认点击
  handleCompleteRemark() {
    let _this = this
    let { reMark } = this.data
    if (!reMark) {
      Toast.fail('未输入备注')
      return
    }
    Toast.success('备注成功')
    setTimeout(()=>{
      _this.onActionPopClose()
    })
  },

  //提交订单点击
  async onSubmitOrder() {
    //加载排号中...
    Toast.loading({
      message: '排号中...',
      duration: 10000,
      forbidClick: true,
    });

    //获取数据
    let { addressList,addressActiveIndex,purchaseData,pickMode,pickTime,reMark,payment } = this.data
    let address = addressList[addressActiveIndex]
    let product = purchaseData
    let status = 1
    let storeid = product.storeObj.openid
    let customerid = getStorage('userInfo').openid
    let totalPrice = product.price
    let myDate = new Date()
    let registerTime = {
      year: myDate.getFullYear(),
      month: myDate.getMonth() + 1,
      day: myDate.getDate(),
      hour: myDate.getHours(),
      minute: myDate.getMinutes(),
      second: myDate.getSeconds(),
    }

    //获取排号
    let queue = await this.getQueue(storeid,registerTime)
    
    this.requestAddOrder({
      address,
      product,
      storeid,
      customerid,
      totalPrice,
      pickMode,
      pickTime,
      payment,
      reMark,
      status,
      queue,
      registerTime
    })
    //用户  消费额  订单量
    //店铺 订单量 销售额
  },

  //获取排号
  async getQueue(storeid,registerTime) {
    const res = await db.collection('om_order').where({
      storeid,
      'registerTime.year': registerTime.year,
      'registerTime.month': registerTime.month,
      'registerTime.day': registerTime.day
    }).get()
    return res.data.length + 1
  },

  //请求生成订单
  async requestAddOrder(data) {
    //订单集合新增数据
    let addOrderRes = await db.collection('om_order').add({
      data
    })
    if (addOrderRes._id) {//添加成功
      //更新用户数据  消费额  订单量
      let uid = data.customerid
      await db.collection('om_user').where({
        openid: uid
      }).update({
        data: {
          cost: _.inc(data.totalPrice),
          orders: _.inc(1)
        }
      })
      //更新用户缓存数据
      let uInfo = getStorage('userInfo')
      uInfo.cost += data.totalPrice
      uInfo.orders += 1
      wx.setStorageSync('userInfo', uInfo)

      //更新商品数据
      await db.collection('om_product').doc(data.product._id).update({
        data: {
          sales: _.inc(1)
        }
      })

      //更新商家数据
      let sid = data.storeid
      await db.collection('om_store').where({
        openid: sid
      }).update({
        data: {
          sales: _.inc(data.totalPrice),
          orders: _.inc(1)
        }
      })
      this.orderSuccess(addOrderRes._id)
    } else {//添加失败
      Toast.fail('排号失败')
    }
  },

  //排号成功回调
  orderSuccess(id) {
    Toast.success('排号成功')
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/orderDetail/orderDetail?id=' + id,
      })
      console.log('okok');
    },300)
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
    //获取缓存中的购买数据
    let purchaseData = getStorage('purchaseData')
    purchaseData.price = Number(purchaseData.price)

    //获取收货地址数据
    const uInfo = getStorage('userInfo')
    const { openid } = uInfo
    //获取数据
    const addressRes = await db.collection('om_address').where({openid}).get()
    this.setData({
      addressList: addressRes.data[0].addressList,
      purchaseData: purchaseData
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