const db = wx.cloud.database()
/*
春节将至，提前祝各位亲友们新年快乐，本店将于2月10日放假，2月10日-2月20日期间下单的亲友们，将在2月21日开始发货，为此给您带来的不便请谅解。
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funcList: [
      {
        name: '发布商品',
        icon: 'add-o',
        background: '#f86a63'
      },
      {
        name: '商品管理',
        icon: 'bag-o',
        background: '#f8b81b'
      },
      {
        name: '店铺信息',
        icon: 'shop-o',
        background: '#cb8f50'
      },
      
      {
        name: '修改公告',
        icon: 'volume-o',
        background: '#2499f6'
      },
      {
        name: 'LOGO变更',
        icon: 'replay',
        background: '#2499f6'
      },
      {
        name: '店名变更',
        icon: 'edit',
        background: '#2499f6'
      },
      {
        name: '手机号变更',
        icon: 'phone-o',
        background: '#2499f6'
      },
      {
        name: '编辑地址',
        icon: 'location-o',
        background: '#2499f6'
      },
      {
        name: '店铺预览',
        icon: 'eye-o',
        background: '#2cd465'
      },
    ],
    storeInfo: {
      collections: '-',
      orders: '-',
      sales: '-'
    },
    actionSheetShow: true,
    activeIndex: 0,
    addressColumns: [
      {
        values: ['满庭芳', '沁园春']
      },
      {
        values: ['一楼', '二楼', '三楼']
      },
      {
        values: ['1号窗口', '2号窗口', '3号窗口','4号窗口','5号窗口','6号窗口','7号窗口','8号窗口','9号窗口','10号窗口','11号窗口','12号窗口','13号窗口','14号窗口','15号窗口','16号窗口',]
      },
    ]
  },

  //功能区点击
  itemClick(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      actionSheetShow: true
    })
  },

  //关闭动作面板
  handleCloseActionSheet () {
    this.setData({
      actionSheetShow: false
    })
  },

  //选择地址取消
  onAddressCancel() {
    this.handleCloseActionSheet()
  },

  //选择地址确认
  onAddressConfirm(e) {
    const { value, index } = e.detail;
    console.log({ value });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取url参数
    const { openid } = options
    //请求数据 查询店铺信息
    // const storeRes = await db.collection('om_store').where({openid}).get()
    // this.setData({
    //   storeInfo: storeRes.data[0]
    // })
    /*
    address: ""
collection: 0
diningRoom: "满庭芳餐厅"
logoUrl: "cloud://cloud1-6g41byxc4dfd0202.636c-cloud1-6g41byxc4dfd0202-1305805157/om_store/storeLogo_oClRs5AcDoSMeWXP3Qs77Qg5W__w1621756632603.png"
name: "一楼美食"
openid: "oClRs5AcDoSMeWXP3Qs77Qg5W__w"
orders: 0
phone: ""
productList: []
sales: 0
_id: "28ee4e3e60aa0adb1b9a205c61019e34"
_openid: "oClRs5AcDoSMeWXP3Qs77Qg5W__w"
    */
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