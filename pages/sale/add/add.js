const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight: '', //总重量
    count:'',//总支数
    totalPrice: '', //总价
    collectMoney:'0',//收款
    arrears:'0',//欠款
    saleId: '',
    factoryId: '1',
    saleDate: app.com.getNowDate(),

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
        saleId: options.id,
        weight: options.weight,
        totalPrice: options.totalPrice,
        count:options.count,
        collectMoney:options.collectMoney,
        arrears:options.arrears,
      })
      wx.setNavigationBarTitle({
        title: '修改信息'
      })
    }

  },
    bindDateChange(e) {
    this.setData({
      saleDate: e.detail.value
    })
  },

  collectMoney(e){
    if (_this.data.totalPrice != '') {
      var arrears = (parseFloat(_this.data.totalPrice)-parseFloat(e.detail.value)).toFixed(2);
      _this.setData({
        arrears: arrears
      })
    }
  },
  formSubmit(e) {
    if (_this.data.saleId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('sale/update', {
        id: _this.data.saleId,
        saleDate: _this.data.saleDate,
        typeId: _this.data.typeId,
        weight: e.detail.value.weight,
        count: e.detail.value.count,
        price: e.detail.value.price,
        totalPrice: e.detail.value.totalPrice,
        collectMoney: e.detail.value.collectMoney,
        arrears: e.detail.value.arrears
      }, function (res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/sale/sale',
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
      app.com.post('sale/save', {
        typeId: _this.data.typeId,
        saleDate: _this.data.saleDate,
        weight: e.detail.value.weight,
        count: e.detail.value.count,
        price: e.detail.value.price,
        totalPrice: e.detail.value.totalPrice,
        collectMoney: e.detail.value.collectMoney,
        arrears: e.detail.value.arrears,
        factoryId: _this.data.factoryId,
      }, function (res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
          wx.navigateBack({
            url: '/pages/sale/sale',
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
  //选择产品
  chooseType(e) {
    wx.navigateTo({
      url: '/pages/sale/stock/stock',
    })
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