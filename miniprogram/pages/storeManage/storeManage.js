const app = getApp()
const db = wx.cloud.database()
const { Toast } = app.globalData
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
      sales: '-',
    },
    actionSheetShow: false,
    activeIndex: 0,
    addressColumns: [
      {
        values: ['满庭芳餐厅', '沁园春餐厅']
      },
      {
        values: ['一楼', '二楼', '三楼']
      },
      {
        values: ['1号窗口', '2号窗口', '3号窗口','4号窗口','5号窗口','6号窗口','7号窗口','8号窗口','9号窗口','10号窗口','11号窗口','12号窗口','13号窗口','14号窗口','15号窗口','16号窗口',]
      },
    ],
    newNoticeValue: '',
    newLogoUrl: '',
    newNameValue: '',
    newPhoneValue: '',
    newAddressValue: '',
  },

  //功能区点击
  itemClick(e) {
    let index = e.currentTarget.dataset.index
    if ([3,4,5,6,7].indexOf(index) != -1) {
      this.setData({
        activeIndex: index,
        actionSheetShow: true
      })
    }
  },

  //关闭动作面板
  handleCloseActionSheet () {
    this.setData({
      actionSheetShow: false
    })
  },

  //更新数据
  handleUpdateData() {
    let { newNoticeValue,newNameValue,activeIndex,newPhoneValue,newAddressValue } = this.data
    switch(activeIndex) {
      case 3://修改公告
        if (!newNoticeValue) {
          Toast.fail('还未输入');
          return
        }
        this.requestUpdateData('om_store', { notice: newNoticeValue })
        break;
      case 4://logo
        this.setData({
          newLogoUrl: ''
        })
        break;
      case 5://name店名
        if (!newNameValue) {
          Toast.fail('还未输入');
          return
        }
        this.requestUpdateData('om_store', { name: newNameValue })
        break;
      case 6://手机号
        if (!newPhoneValue) {
          Toast.fail('还未输入');
          return
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(newPhoneValue)) {
          Toast.fail('格式有误');
          return
        }
        this.requestUpdateData('om_store', { phone: newPhoneValue })
        break;
      case 7://地址
        if (!newAddressValue) {
          Toast.fail('还未选择地址');
          return
        }
        this.requestUpdateData('om_store', { address: newAddressValue })
        break;
    }
  },

  //请求更新数据
  async requestUpdateData(collection, data) {
    const _this = this
    const { openid } = _this.data.storeInfo
    const res = await db.collection(collection).where({openid}).update({
      data
    })
    if (res.stats.updated==1) {
      Toast.success('修改成功');
      _this.handleCloseActionSheet()
      _this.resetNewValue()
    } else {
      Toast.fail('修改失败');
    }
  },

  //重置新值
  resetNewValue() {
    const { activeIndex,newNoticeValue,newNameValue,newPhoneValue,newAddressValue } = this.data
    switch(activeIndex) {
      case 3:
        this.setData({
          ['storeInfo.notice']: newNoticeValue,
          newNoticeValue: ''
        })
        break;
      case 4:
        this.setData({
          newLogoUrl: ''
        })
        break;
      case 5:
        this.setData({
          ['storeInfo.name']: newNameValue,
          newNameValue: ''
        })
        break;
      case 6:
        this.setData({
          ['storeInfo.phone']: newPhoneValue,
          newPhoneValue: ''
        })
        break;
      case 7:
        this.setData({
          ['storeInfo.address']: newAddressValue,
          newAddressValue: ''
        })
        break;
    }
  },

  //选择地址取消
  onAddressCancel() {
    this.handleCloseActionSheet()
  },

  //选择地址确认
  onAddressConfirm(e) {
    const { value } = e.detail;
    let address = '许昌学院' + value[0] + value[1] +' '+ value[2] +' '+ this.data.storeInfo.name
    console.log({ address });
    this.setData({
      newAddressValue: address
    })
    this.handleUpdateData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取url参数
    const { openid } = options
    //请求数据 查询店铺信息
    const storeRes = await db.collection('om_store').where({openid}).get()
    this.setData({
      storeInfo: storeRes.data[0]
    })
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