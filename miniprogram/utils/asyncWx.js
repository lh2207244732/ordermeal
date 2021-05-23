module.exports = {
  uploadFile(data) {
    return new Promise((resolve, reject)=>{
      wx.cloud.uploadFile({
        ...data,
        success(res){
          resolve(res)
        },
        fail(err){
          reject(err)
        }
      })
    })
  },
  deleteFile(data) {
    return new Promise((resolve, reject)=>{
      wx.cloud.deleteFile({
        ...data,
        success(res){
          resolve(res)
        },
        fail(err){
          reject(err)
        }
      })
    })
  },
  getUserProfile(data) {
    return new Promise((resolve, reject)=>{
      wx.getUserProfile({
        ...data,
        success(res){
          resolve(res)
        },
        fail(err){
          console.log(err);
          reject(err)
        }
      })
    })
  },
}