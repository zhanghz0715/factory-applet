const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    load: false,
    flag: 0,
    size: 10,
    tag: ['销售', '应收款'],
    url: '/sale/page',
    factoryId: '1',
    isUpdate: false,
    dataId:'',//所选项的ID
    saleDate:'',
    date:'选择日期',//选择日期
    saleNumber:'',//销售日期
    saleList: [],
    salelPage: 0,
    saleToal: 0,
    arrearsList: [],
    arrearsPage: 0,
    arrearsTotal: 0,
    
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
    _this.getList(0)
  },
  navTo(e) {
    app.com.navTo(e)
    this.setData({
      dataId: e.currentTarget.dataset.id,
    })
  },
  //tab的切换
  changeTag(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      flag: e.currentTarget.dataset.index
    })
    if (index == 0) {
      this.setData({
        page: _this.data.salePage,
        total: _this.data.saleToal,
        list: _this.data.saleList,
      })
      if (_this.data.saleList.length == 0) {
        _this.getList(0);
      }
    } else {
      this.setData({
        page: _this.data.arrearsPage,
        total: _this.data.arrearsTotal,
        list: _this.data.arrearsList,
      })
      if (_this.data.arrearsList.length == 0) {
        _this.getArrearsList(0);
      }

    } 
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
      factoryId: this.data.factoryId,
      saleNumber:this.data.saleNumber,
      saleDate:this.data.saleDate
    }, function(res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        for (let i in re) {
          re[i].createTime = app.com.js_date_time(re[i].createTime),
          re[i].saleDate = app.com.js_date_time(re[i].saleDate)
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
            total: res.data.total,
            saleList: arr,
            salePage: _this.data.page,
            saleTotal: res.data.total,
            load: false,
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
  getArrearsList(type) {
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
      isArrears:1
    }, function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        for (let i in re) {
          re[i].createTime = app.com.js_date_time(re[i].createTime),
          re[i].saleDate = app.com.js_date_time(re[i].saleDate)
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
            total: res.data.total,
            arrearsList: arr,
            arrearsPage: _this.data.page,
            arrearsTotal: res.data.total,
            load: false,
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
  onShow: function() {
    _this.getInfo();
    if (wx.getStorageSync("isRefresh")) {
      if (_this.data.flag == 0) {
        _this.getList(0);
      } else {
        _this.getArrearsList(0);
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
        _this.getArrearsList();
      }

      wx.removeStorageSync("isUpdate")
    }

  },
  //获取库存信息
  getInfo() {
    app.com.get('material/info', {
        factoryId: this.data.factoryId
      },
      function(res) {
        console.log(res);
        if(res.code==1){
          _this.setData({
            product: res.data.product, //生产用量
            material: res.data.material, //原料
            waste: res.data.waste, //废料
            surplus: res.data.surplus, //剩余量
          })
        }
      });
  },
  addSale(e){
    wx.navigateTo({
      url: '/pages/sale/add/add',
    })
  },
  setNumber(e){
    _this.setData({
      saleNumber:e.detail.value,
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      saleDate: e.detail.value,
    })
  },

  search(e){
    _this.getList(0);
  },
  reset(e){
    _this.setData({
      saleNumber:'',
      date: '选择日期',
      saleDate: ''
    })
    _this.getList(0);

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (_this.data.flag == 0) {
      _this.getList(0);
    } else {
      _this.getArrearsList(0);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if (this.data.list.length < this.data.total) {
      if (_this.data.flag == 0) {
        _this.getList(1);
      } else {
        _this.getArrearsList(1);
      }
    }
  },

  deleteTap(e) {
    let index = e.currentTarget.dataset.index;
    _this.deleteMaterial(_this.data.list[index].id, index);
  },
  deleteMaterial(id, index) {
    wx.showModal({
      title: '提示',
      content: '您确定要删除该条信息吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          app.com.post('material/delete', {
            materialId: id,
          }, function (res) {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '杰兴铝材排产仓管系统',
      path: '/pages/index/index'
    }
  }
})