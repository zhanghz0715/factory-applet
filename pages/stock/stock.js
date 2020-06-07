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
    tag: ['原料', '产品'],
    url: '/material/page',
    factoryId: '1',
    isUpdate: false,
    product: '', //生产用量
    material: '', //原料
    waste: '', //废料
    surplus: '', //剩余量
    dataId:'',//所选项的ID
    materialList:[],
    materialPage:0,
    materialToal: 0,
    stockList:[],
    stockPage:0,
    stockTotal:0,
    name:''//产品名称

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
      flag: e.currentTarget.dataset.index,
    })
    if (index == 0) {
      this.setData({
        page: _this.data.materialPage,
        total:_this.data.materialToal,
        list:_this.data.materialList,
        url: 'material/page'
      })
      if (_this.data.materialList.length==0){
        _this.getList(0);
      }
    } else{
      this.setData({
        page: _this.data.stockPage,
        total: _this.data.stockTotal,
        list: _this.data.stockList,
        url: 'stock/page'
      })
      if (_this.data.stockList.length == 0) {
        _this.getStock(0);
      }

    } 
  },
  getList(type) {
    if (!_this.data.isUpdate) {
      if (type == 0) {
        this.data.page = 1
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
      type:'1'
    }, function(res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        for (let i in re) {
          re[i].createTime = app.com.js_date_time(re[i].createTime)
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
            materialList:arr,
            materialPage:_this.data.page,
            materialToal: res.data.total,
            total: res.data.total,
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
  
  getStock(type) {
    if (!_this.data.isUpdate) {
      if (type == 0) {
        this.data.page = 1
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
      name: _this.data.name
    }, function (res) {
      wx.stopPullDownRefresh()
      if (res.code == 1) {
        let re = res.data.records
        for (let i in re) {
          re[i].createTime = app.com.js_date_time(re[i].createTime)
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
            stockList: arr,
            stockPage: _this.data.page,
            stockTotal: res.data.total,
            total: res.data.total,
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
  //监听搜索框
  searchInput(e){
    let search = e.detail.value
    _this.setData({
      name: search
    })
    _this.getStock(0)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    _this.getInfo();
    if (wx.getStorageSync("isRefresh")) {
      if(_this.data.flag==0){
        _this.getList(0);
      }else{
        _this.getStock(0);
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
        _this.getStock();
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
  addMaterial(e){
    wx.navigateTo({
      url: '/pages/stock/material/material',
    })
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (_this.data.flag == 0) {
      _this.getList(0);
    } else {
      _this.getStock(0);
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
        _this.getStock(1);
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