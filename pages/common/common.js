const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    imageUrl: '/img/mt.png',
    load: false,
    show: false,
    size: 10,
    tag: ['我的排产', '我的模具'],
    flag: 0,
    total:0,
    url: '/product/page',
    productDate: "",
    date: '日期选择',
    type: '类型选择',
    typeId: "",
    isUpdate: false,
    factoryId: '1', //工厂ID
    dataId: '', //这个是存放操作某条数据的id，用来匹配数据
    productList: [],
    parductPage: 0,
    productToal: 0,
    mouldList: [],
    mouldPage: 0,
    mouldTotal: 0,
  },
  //重置查询
  reset(e) {
    this.setData({
      date: '日期选择',
      type: '类型选择',
      productDate: "",
      typeId: ''
    })
    this.getList(0)
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      productDate: e.detail.value,
    })
    this.getList(0);
  },
  //获取产品类型列表
  getTypeList() {
    app.com.post('type/list', {}, function (res) {
      if (res.code == 1) {
        _this.setData({
          typeList: res.data
        })
        if (_this.data.typeId != '') {
          for (var j = 0, size = res.data.length; j < size; j++) {
            if (res.data[j].id == _this.data.typeId) {
              _this.setData({
                typeIndex: j
              })
              break;
            }
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  bindTypeChange(e) {
    this.setData({
      type: _this.data.typeList[e.detail.value].name,
      typeId: _this.data.typeList[e.detail.value].id,
    })
    this.getList(0);
  },
  changeTag(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      flag: e.currentTarget.dataset.index
    })
    if (index == 0) {
      _this.setData({
        url: 'product/page',
        page: _this.data.productPage,
        total: _this.data.productTotal,
        list: _this.data.productList,
      })
      if (_this.data.productList.length == 0) {
        _this.getList(0);
      }
    } else {
      _this.setData({
        url: 'mould/myMouldPage',
        page: _this.data.mouldPage,
        total: _this.data.mouldTotal,
        list: _this.data.mouldList,
      })
      if (_this.data.mouldList.length == 0) {
        _this.getMouldList(0);
      }

    }
  },
  navTo(e) {
    app.com.navTo(e)
    this.setData({
      dataId: e.currentTarget.dataset.id,
    })
  },
  navToProduct(e) {
    console.log(e);
    app.com.navTo(e)
    this.setData({
      dataId: e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    if (wx.getStorageSync("user").factoryId != null) {
      this.setData({
        factoryId: wx.getStorageSync("user").factoryId
      })
    }
    _this.getList(0)
    _this.getTypeList();
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
    app.com.post(this.data.url, {
      current: this.data.page,
      size: this.data.size,
      productDate: this.data.productDate,
      typeId: this.data.typeId,
      factoryId: this.data.factoryId,
    }, function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        console.log(re);
        for (let i in re) {
          re[i].createTime = app.com.js_date_time(re[i].createTime)
          re[i].productDate = app.com.js_date_time(re[i].productDate)
        }
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
            productList: arr,
            productPage: _this.data.page,
            productToal: res.data.total,
            total: res.data.total,
            load: false,
            show: true,
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

  getMouldList(type) {
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
    app.com.post(this.data.url, {
      current: this.data.page,
      size: this.data.size,
      factoryId: this.data.factoryId,
    }, function (res) {
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
            mouldList: arr,
            mouldPage: _this.data.page,
            mouldToal: res.data.total,
            total: res.data.total,
            load: false,
            show: true,
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
  onShow: function () {
    if (wx.getStorageSync("isRefresh")) {
      if (_this.data.flag == 0) {
        _this.getList(0);
      } else {
        _this.getMouldList(0);
      }
      wx.removeStorageSync("isRefresh")
    }
    if (wx.getStorageSync("isUpdate")) {
      _this.setData({
        isUpdate: true,
      })
      if (_this.data.flag == 0) {
        _this.getList();
      } else {
        _this.getMouldList();
      }
      wx.removeStorageSync("isUpdate")
    }


  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (_this.data.flag == 0) {
      _this.getList(0);
    } else {
      _this.getMouldList(0);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.list.length < this.data.total) {
      if (_this.data.flag == 0) {
        _this.getList(1);
      } else {
        _this.getMouldList(1);
      }
    }
  },
  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    var urls = [];
    urls.push(currentUrl);
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls:urls,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '杰兴铝材排产仓管系统',
      path: '/pages/index/index'
    }
  }
})