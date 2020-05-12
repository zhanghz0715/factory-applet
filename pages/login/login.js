const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },
  ddinput(e) {
    let name = e.currentTarget.dataset.name;
    this.data[name] = e.detail.value;

    this.setData({
      username: this.data.username,
      password: this.data.password
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#6e42d3',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  authorLogin(e) {
    if (this.data.username == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return;
    }
    if (this.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    let userInfo = e.detail.userInfo
    userInfo.username = this.data.username
    userInfo.password = this.data.password
    wx.login({
      success(res) {
        userInfo.js_code = res.code
        wx.showLoading({
          title: '授权中',
          task: true
        })
        app.com.post('wx/user/update', userInfo, function(res) {
          wx.hideLoading()
          if (res.code == 1) {
            wx.showToast({
              title: '授权成功',
              mask: true,
              duration: 800
            })
            let user = res.data
            user.username = userInfo.username
            wx.setStorage({
              key: 'user',
              data: user,
            })
            // wx.setStorageSync("user", user)
            setTimeout(function() {
              wx.navigateBack({
                detal: 1
              })
            }, 900)
          } 
        })
      }
    });



  },

})