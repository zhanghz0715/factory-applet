const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', //名称
    length: '', //长度
    weight: '', //支重
    typeId: '',
    factoryId: '1',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    if (wx.getStorageSync("user").factoryId != null) {
      this.setData({
        factoryId: wx.getStorageSync("user").factoryId
      })
    };
    if (options.id != null) {
      _this.setData({
        typeId: options.id,
        name: options.name,
        length: options.length,
        weight: options.weight
      })
      wx.setNavigationBarTitle({
        title: '修改产品'
      })
    }

  },
  formSubmit(e) {
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.length == '') {
      wx.showToast({
        title: '请填写长度',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.weight == '') {
      wx.showToast({
        title: '请填写支重',
        icon: 'none'
      })
      return;
    }
    if (_this.data.typeId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('type/update', {
        id: _this.data.typeId,
        name: e.detail.value.name,
        length: e.detail.value.length,
        weight: e.detail.value.weight
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/type/type',
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
      app.com.post('type/save', {
        name: e.detail.value.name,
        length: e.detail.value.length,
        weight: e.detail.value.weight,
        factoryId: _this.data.factoryId
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/type/type',
          })
          wx.setStorageSync('isRefresh', true);
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