const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    factoryId:'',
  },
  formSubmit(e){
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.username == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      task:true
    })
    let form = e.detail.value;
    form.id = wx.getStorageSync('user').id;
    app.com.post('user/update', form, function (res) {
      wx.hideLoading()
      if (res.code == 1) {
        wx.showToast({
          title: '修改成功',
        })
        let uinfo = wx.getStorageSync("user");
        uinfo.name = e.detail.value.name;
        uinfo.username = e.detail.value.username;
        wx.setStorageSync("user", uinfo)
        console.log(uinfo);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this= this
    console.log(wx.getStorageSync("user"))
    this.setData({
      name:wx.getStorageSync("user").name,
      phone:wx.getStorageSync("user").username,
      factoryId:wx.getStorageSync("user").factoryId,
    })
  
  },
})