//index.js
//获取应用实例
const app = getApp()
let _this;
Page({
  data: {
    imgurls: [],
    isFirst: true,
    list: [],
    server: []
  },
  navTo(e) {
    if (wx.getStorageSync("user").username == '' || wx.getStorageSync("user").username == null || wx.getStorageSync("user").username == undefined) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      let name = e.currentTarget.dataset.name
      let index = e.currentTarget.dataset.index
      if (name == '排产录入') {
        wx.navigateTo({
          url: '/pages/dayin/dayin?index=' + index,
        })
      } else if (name == '模具管理') {
        wx.navigateTo({
          url: '/pages/mould/mould?index=' + index,
        })
      } else if (name == '账号管理') {
        wx.navigateTo({
          url: '/pages/user/user?index=' + index,
        })
      } else if (name == '产品管理') {
        wx.navigateTo({
          url: '/pages/type/type?index=' + index,
        })
      } else if (name == '财务管理') {
        wx.navigateTo({
          url: '/pages/sale/sale?index=' + index,
        })
      } else if (name == '库存管理') {
        wx.navigateTo({
          url: '/pages/stock/stock?index=' + index,
        })
      }  else if (name == '废料管理') {
        wx.navigateTo({
          url: '/pages/waste/waste?index=' + index,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '服务暂停中',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#6887e1'
        })

      }
    }
  },
  onLoad: function(options) {
    _this = this;
    app.com.post('set/getValue', null, function (res) {
      if (res.data == '1') {
        let uinfo = wx.getStorageSync("user");
        uinfo.name = '1';
        uinfo.username = '1';
        uinfo.id='6927d87812ab421f9c56a116940fab37';
        uinfo.factoryId='1';
        wx.setStorageSync("user", uinfo)
        wx.setStorageSync("show", false);
        _this.getServer(wx.getStorageSync('user').id)
        _this.setData({
          isFirst: false
        })
      }else{
        wx.setStorageSync("show", true);
        _this.login()
      }
    })
    
  },
  login() {
    wx.showLoading({
      title: '加载中',
      task: true
    })
    app.login(function(res) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (_this.data.isFirst) {
        _this.getServer(wx.getStorageSync('user').id)
        _this.setData({
          isFirst: false
        })
       
      }
    })
  },
  onPullDownRefresh() {
    this.login()
    this.getServer(wx.getStorageSync('user').id)
  },
  onShow() {
    if (_this.data.list.length == 0&&wx.getStorageSync('user')!='') {
      _this.getServer(wx.getStorageSync('user').id)
    }
  },
  getServer(id) {
    app.com.post('menu/list', {
      userId: id
    }, function(res) {
      if (res.code == 1) {
        wx.setStorageSync("server", res.data)
        _this.setData({
          list: res.data
        })

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '杰兴铝材排产仓管系统',
      path: '/pages/index/index'
    }
  }

})