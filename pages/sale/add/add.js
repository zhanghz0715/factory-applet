const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeId:'',//产品ID
    type:'选择产品',//产品名称
    weight: '', //重量
    count:'',//销售数量
    price: '', //单价
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
        price: options.price,
        totalPrice: options.totalPrice,
        count:options.count,
        collectMoney:options.collectMoney,
        arrears:options.arrears,
        type:options.typeName,
        typeId:options.typeId
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
  // 监听输入
  watchCount: function (event) {
    _this.setData({
      count: event.detail.value
    })
    if (_this.data.price != '' && _this.data.weight != '') {
      _this.setData({
        totalPrice: (parseFloat(_this.data.weight) * parseFloat(_this.data.price) * parseFloat(event.detail.value)).toFixed(2)
      })
    }

  },
  watchTotal: function (event) {
    if (_this.data.count != '' && _this.data.weight != '') {
      var totalPrice = (parseFloat(_this.data.weight) * parseFloat(_this.data.count)* parseFloat(event.detail.value)).toFixed(2);
      _this.setData({
        totalPrice:totalPrice,
        arrears:totalPrice 
      })
    }
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
    if (e.detail.value.type == '') {
      wx.showToast({
        title: '请选择产品',
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
    if (e.detail.value.count == '') {
      wx.showToast({
        title: '请填写销售支数',
        icon: 'none'
      })
      return;
    }
    console.log(e)
    if (e.detail.value.price == '') {
      wx.showToast({
        title: '请填写单价',
        icon: 'none'
      })
      return;
    }

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