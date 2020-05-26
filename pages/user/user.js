const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    size: 10,
    load: false,
    typeId: "",
    total: 0,
    factoryId: wx.getStorageSync("user").factoryId,
    isUpdate: false,
    dataId: '', //这个是存放操作某条数据的id，用来匹配数据
  },
  navTo(e) {
    console.log(e)
    app.com.navTo(e)
    this.setData({
      dataId: e.currentTarget.dataset.id,
    })
  },
  addUser(e) {
    wx.navigateTo({
      url: '/pages/user/add/add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    _this.getList(0)
  },

  getList(type) {
    if (!_this.data.isUpdate) {
      if (type == 0) {
        this.data.page = 1
        this.setData({
          show: false
        })
      } else {
        this.data.page += 1
      }
      this.setData({
        load: true
      })
    }
    app.com.post('user/page', {
      current: this.data.page,
      size: this.data.size,
      factoryId: this.data.factoryId
    }, function(res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        let arr = []
        if (!_this.data.isUpdate) {
          if (type == 0) {
            arr = re
          } else {
            arr = _this.data.list
            for (let i in re) {
              arr.push(re[i])
            }
          }
          _this.setData({
            list: arr,
            total: res.data.total,
            load: false
          })
        } else {
          let content;
          for (let i in re) {
            if (re[i].id == _this.data.dataId) {
              content = re[i];
              break;
            }
          }
          for (var j = 0, size = _this.data.list.length; j < size; ++j) {
            if (_this.data.list[j].id != _this.data.dataId) {
              arr.push(_this.data.list[j])
            } else {
              arr.push(content);
            }
          }
          _this.setData({
            list: arr,
            load: false,
            isUpdate: false,
          })
        }


      } else {
        _this.setData({
          load: false
        })
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync("isUpdate")) {
      console.log(wx.getStorageSync("isUpdate"))
      _this.setData({
        isUpdate: true,
      })
      _this.getList();
      wx.removeStorageSync("isUpdate")
    }
  },
  deleteTap(e) {
    let index = e.currentTarget.dataset.index;
    _this.deleteUser(_this.data.list[index].id, index);
  },
  deleteUser(id, index) {
    wx.showModal({
      title: '提示',
      content: '您确定要删除该用户吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          app.com.post('user/delete', {
            userId: id,
          }, function(res) {
            wx.hideLoading();
            var list = _this.data.list;
            if (res.code == 1) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              list.splice(index, 1);
              _this.setData({
                list: list
              })
            }
          });
        }

      }
    })

  },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    _this.getList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if (this.data.list.length < this.data.total) {
      _this.getList(1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '杰兴铝材排产仓管系统',
      path: '/pages/index/index'
    }
  }
})