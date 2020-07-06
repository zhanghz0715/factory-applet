const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight: '', //总重量
    count: '',//总支数
    totalPrice: '', //总价
    collectMoney: '0',//收款
    arrears: '0',//欠款
    saleId: '',
    factoryId: '1',
    saleDate: app.com.getNowDate(),
    list:[],//产品列表
    isShow:true,
    signName:"添加产品"

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;
    if (wx.getStorageSync("user").factoryId != null) {
      this.setData({
        factoryId: wx.getStorageSync("user").factoryId
      })
    };
    if (options.id != null) {
      app.com.post('sale/getDetail', {id:options.id}, function(res) {
        if (res.code == 1) {
          _this.setData({
            saleId: options.id,
            weight: res.data.sale.weight,
            totalPrice: res.data.sale.totalPrice,
            count: res.data.sale.count,
            collectMoney: res.data.sale.collectMoney,
            arrears: res.data.sale.arrears,
            list:res.data.list,
            isShow:false,
            signName:"销售产品"
          })

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
      wx.setNavigationBarTitle({
        title: '修改信息'
      })
    }

  },
  addType() {
    if(!_this.data.isShow){
      return;
    }
    if (_this.data.list.length > 0) {
      wx.navigateTo({
        url: '/pages/sale/type/type?list=' + JSON.stringify(_this.data.list),
      })
    } else {
      wx.navigateTo({
        url: '/pages/sale/type/type',
      })
    }
  },
  bindDateChange(e) {
    this.setData({
      saleDate: e.detail.value
    })
  },

  collectMoney(e) {
    if (_this.data.totalPrice != ''&&e.detail.value!='') {
      var arrears = (parseFloat(_this.data.totalPrice) - parseFloat(e.detail.value)).toFixed(2);
      _this.setData({
        arrears: arrears
      })
    }
  },
  /**
   * 收缩核心代码
   */
  kindToggle(e) {
    const id = e.currentTarget.id
    console.log(id);
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      console.log(list[i].id);
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    /**
     * key和value名称一样时，可以省略
     * 
     * list:list=>list
     */
    this.setData({
      list
    })
  },
    /**
   * 删除产品
   */
  deleteType(e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除该项吗？',
      success: function(res) {
        if (res.confirm) {
          const id = e.currentTarget.id
          const list = _this.data.list
          for (let i = 0, len = list.length; i < len; ++i) {
            if (list[i].id === id) {
              list.splice(i, 1);
            }
          }
          _this.setData({
            list
          })
        }
      }
    })
  },

  /**
   * 修改产品
   */
  editType(e) {
    const id = e.currentTarget.id
    const list = _this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        wx.navigateTo({
          url: '/pages/sale/type/type?list=' + JSON.stringify(list) + '&content=' + JSON.stringify(list[i])
        })
      }
    }
  },
  formSubmit(e) {
    if(_this.data.list.length==0){
      wx.showToast({
        title: '请添加产品',
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
      wx.showModal({
        title: '提示',
        content: '销售单一旦生成则不能修改产品信息，请确认是否添加？',
        success: function(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            app.com.post('sale/save', {
              saleDate: _this.data.saleDate,
              weight: e.detail.value.weight,
              count: e.detail.value.count,
              totalPrice: e.detail.value.totalPrice,
              collectMoney: e.detail.value.collectMoney,
              arrears: e.detail.value.arrears,
              factoryId: _this.data.factoryId,
              list: JSON.stringify(_this.data.list)
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})