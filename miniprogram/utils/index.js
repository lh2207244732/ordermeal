module.exports = {
  saveUserInfo(data) {
    wx.setStorageSync('userInfo', data)
  },
  getStorage(key) {
    return wx.getStorageSync(key)
  },
  deleteStorage(name) {
    wx.removeStorageSync(name)
  },
  isLogin() {
    var value = wx.getStorageSync('userInfo')
    return value.openid ? true : false
  }
}