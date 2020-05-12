let com = require('./utils/util.js')
App({
  com: com,
  onLaunch: function () {
    let _this = this
  },
  login(cb){
    wx.login({
      success(res) {
        com.post('wx/user/login', { js_code: res.code }, function (res) {
          if (res.code == 1) {
            wx.setStorageSync("user", res.data)
            wx.setStorageSync("token", res.token)
            cb(res)
          }else{
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})