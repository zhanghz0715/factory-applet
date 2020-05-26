const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', //用户账号
    name: '', //姓名
    type: 3, //类型：2财务 3工人
    userId:'',
    factoryId: wx.getStorageSync("user").factoryId,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    if(options.id!=null){
      _this.setData({
        userId:options.id,
        name:options.name,
        username:options.username,
        type:options.type
      })
      wx.setNavigationBarTitle({
        title: '修改用户'
      })
    }

  },
  radioChange(e) {
    _this.setData({
      type: e.detail.value
    })
  },
  formSubmit(e) {
    if (e.detail.value.username == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return;
    }
    if (_this.data.userId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('user/update', {
        id: _this.data.userId,
        username: e.detail.value.username,
        name: e.detail.value.name,
        type: _this.data.type
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/user/user',
          })
          wx.setStorageSync('isUpdate', true);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('user/save', {
        username: e.detail.value.username,
        name: e.detail.value.name,
        type: _this.data.type,
        factoryId: _this.data.factoryId
      }, function (res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '添加成功,默认密码为123456',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/user/user',
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },


})