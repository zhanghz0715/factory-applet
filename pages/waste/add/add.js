const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight: '', //重量
    price: '', //价格
    materialId:'',
    factoryId: '1',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    if (wx.getStorageSync("user").factoryId != null) {
      this.setData({
        factoryId: wx.getStorageSync("user").factoryId
      })
    }
    if(options.id!=null){
      _this.setData({
        materialId:options.id,
        weight:options.weight,
        price:options.price
      })
      wx.setNavigationBarTitle({
        title: '修改废料单'
      })
    }

  },
  formSubmit(e) {
    if (e.detail.value.weight == '') {
      wx.showToast({
        title: '请填写重量',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.price == '') {
      wx.showToast({
        title: '请填写价格',
        icon: 'none'
      })
      return;
    }
    if (_this.data.materialId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('material/update', {
        id: _this.data.materialId,
        weight: e.detail.value.weight,
        price: e.detail.value.price
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/waste/waste',
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
      app.com.post('material/save', {
        weight: e.detail.value.weight,
        price: e.detail.value.price,
        type: '2',
        factoryId: _this.data.factoryId
      }, function (res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/waate/waste',
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