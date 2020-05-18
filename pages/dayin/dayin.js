const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    no: '',
    page: 0,
    cai: false,
    total_fee: 0,
    address: '',
    date: app.com.getNowDate(),
    list: []
  },

  navTo(e) {
    app.com.navTo(e)
  },
  addProduct() {
    if (_this.data.list.length > 0) {
      wx.navigateTo({
        url: '/pages/dayin/dy/dy?list=' + JSON.stringify(_this.data.list),
      })
    } else {
      wx.navigateTo({
        url: '/pages/dayin/dy/dy',
      })
    }

  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 收缩核心代码
   */
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
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
   * 删除
   */
  deleteProduct(e) {
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
   * 修改
   */
  editProduct(e) {
    const id = e.currentTarget.id
    const list = _this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        wx.navigateTo({
          url: '/pages/dayin/dy/dy?list=' + JSON.stringify(list) + '&content=' + JSON.stringify(list[i])
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this

  },
  onShow() {

  },
  formSubmit(e) {
    wx.switchTab({
      url: '/pages/banzu/banzu',
    })
    wx.setStorageSync('isRefresh', true);
    let list = _this.data.list;
    if (list.length == 0) {
      wx.showToast({
        title: '请先录入排产计划',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    app.com.post('product/save', {
      productDate: _this.data.date,
      machine: e.detail.value.machine,
      monitor: e.detail.value.monitor,
      openMachine: e.detail.value.openMachine,
      topNote: e.detail.value.topNote,
      postNote: e.detail.value.postNote,
      list: JSON.stringify(_this.data.list)
    }, function(res) {
      wx.hideLoading()
      if (res.code == 1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.switchTab({
          url: '/pages/banzu/banzu',
        })
        wx.setStorageSync('isRefresh', true);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },
  tempUp() {
    app.com.post('file/temp', {
      id: this.data.file.id
    }, function(res) {

    })
  },
  wxpay(msg) {
    app.com.wxpay(msg)
  },
  switch1Change(e) {
    this.setData({
      cai: e.detail.value
    })
    this.init()
  },


})