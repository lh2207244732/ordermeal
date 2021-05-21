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
}