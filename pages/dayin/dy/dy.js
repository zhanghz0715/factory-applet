const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制支重和重量是否显示
    list: [],
    typeList: [],
    typeIndex: 0,
    mouldList: [],
    mouldIndex: 0,
    mould: '请选择模号',
    type: '请选择型号',
    typeId: '',
    mouldId: '',
    theoryWeight: '',
    averageWeight: '',
    cabinetNumber: '',
    length: '',
    count: '',
    weight: '',
    totalWeight: '',
    btnName: '添加排产', //按钮名称
    content: '', //上个页面带过来的内容
    id: '', //上个页面带过来的内容的id
    productId: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    var list;
    var content;
    if (options.list != null) {
      list = JSON.parse(options.list)
      _this.setData({
        list: list,
      })

    }
    if (options.content != null) {
      content = JSON.parse(options.content)
      _this.analyzeData(content)
      _this.setData({
        btnName: '修改排产',
        content: content,
        id: content.id,
      })
      wx.setNavigationBarTitle({
        title: '修改排产'
      })
    }
    if (options.id != null) {
      _this.setData({
        btnName: '修改排产',
        productId: options.id,
        show: true
      })
      wx.setNavigationBarTitle({
        title: '修改排产'
      })
      _this.getDetail(options.id)
    }
  },
  // 监听输入
  watchCount: function(event) {
    _this.setData({
      count: event.detail.value
    })
    if (_this.data.weight != "") {
      _this.setData({
        totalWeight: parseFloat(_this.data.weight) * parseInt(event.detail.value)
      })
    }
  },
  // 监听输入
  watchWeight: function(event) {
    var totalWeight = parseInt(parseFloat(event.detail.value) * parseInt(_this.data.count))
    _this.setData({
      weight: event.detail.value,
      totalWeight: totalWeight
    })
  },

  analyzeData(content) {
    var list = content.pages;
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].name == '柜号' && list[i].value != '') {
        _this.setData({
          cabinetNumber: list[i].value
        })
      } else if (list[i].name == '产品型号' && list[i].value != '') {
        _this.setData({
          type: list[i].value,
          typeId: list[i].id,
        })
      } else if (list[i].name == '模号' && list[i].value != '') {
        _this.setData({
          mould: list[i].value,
          mouldId: list[i].id,
        })
      } else if (list[i].name == '长度' && list[i].value != '') {
        _this.setData({
          length: list[i].value
        })
      } else if (list[i].name == '理论支重' && list[i].value != '') {
        _this.setData({
          theoryWeight: list[i].value
        })
      } else if (list[i].name == '平均支重' && list[i].value != '') {
        _this.setData({
          averageWeight: list[i].value
        })
      } else if (list[i].name == '支数' && list[i].value != '') {
        _this.setData({
          count: list[i].value
        })
      }
    }
  },
  //获取详情
  getDetail(id) {
    app.com.post('product/getDetail', {
      id: id
    }, function(res) {
      if (res.code == 1) {
        _this.setData({
          cabinetNumber: res.data.cabinetNumber,
          type: res.data.typeName,
          typeId: res.data.typeId,
          mould: res.data.mouldName,
          mouldId: res.data.mouldId,
          length: res.data.length,
          theoryWeight: res.data.theoryWeight,
          averageWeight: res.data.averageWeight,
          count: res.data.count,
          weight: res.data.weight,
          totalWeight: res.data.totalWeight,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  onShow: function() {
    _this.getTypeList();
    _this.getMouldList();
  },
  //获取产品类型列表
  getTypeList() {
    app.com.post('type/list', {}, function(res) {
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
      theoryWeight: _this.data.typeList[e.detail.value].weight,
      averageWeight: _this.data.typeList[e.detail.value].averageWeight
    })
  },
  //获取模具列表
  getMouldList() {
    app.com.post('mould/list', {}, function(res) {
      if (res.code == 1) {
        _this.setData({
          mouldList: res.data
        })
        if (_this.data.mouldId != '') {
          for (var j = 0, size = res.data.length; j < size; j++) {
            if (res.data[j].id == _this.data.mouldId) {
              _this.setData({
                mouldIndex: j
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
  bindMouldChange(e) {
    _this.setData({
      mould: _this.data.mouldList[e.detail.value].name,
      mouldId: _this.data.mouldList[e.detail.value].id
    })
  },
  //选择产品
  chooseType() {
    wx.navigateTo({
      url: '/pages/type/type?isChoose=true',
    })
  },
  formSubmit(e) {
    if (e.detail.value.cabinetNumber == '') {
      wx.showToast({
        title: '请填写柜号',
        icon: 'none'
      })
      return;
    }
    if (_this.data.typeId == '') {
      wx.showToast({
        title: '请选择产品型号',
        icon: 'none'
      })
      return;
    }
    if (_this.data.mouldId == '') {
      wx.showToast({
        title: '请选择模号',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.length == '') {
      wx.showToast({
        title: '请输入长度',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.theoryWeight == '') {
      wx.showToast({
        title: '请输入理论支重',
        icon: 'none'
      })
      return;
    }
    if (e.detail.value.count == '') {
      wx.showToast({
        title: '请输入支数',
        icon: 'none'
      })
      return;
    }
    if (_this.data.productId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('product/update', {
        id: _this.data.productId,
        cabinetNumber: e.detail.value.cabinetNumber,
        typeId: _this.data.typeId,
        mouldId: _this.data.mouldId,
        length: e.detail.value.length,
        theoryWeight: e.detail.value.theoryWeight,
        averageWeight: e.detail.value.averageWeight,
        count: e.detail.value.count,
        weight: e.detail.value.weight,
        totalWeight: e.detail.value.totalWeight,
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.switchTab({
            url: '/pages/banzu/banzu',
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
      var id = 0;
      var list = _this.data.list;
      if (_this.data.list.length != 0) {
        id = parseInt(list[list.length - 1].id) + 1;
      }
      var content = {
        id: String(id),
        name: _this.data.type,
        open: false,
        pages: [{
            id: '',
            name: '柜号',
            value: e.detail.value.cabinetNumber
          },
          {
            id: _this.data.typeId,
            name: '产品型号',
            value: _this.data.type,
          },
          {
            id: _this.data.mouldId,
            name: '模号',
            value: _this.data.mould,
          },
          {
            id: '',
            name: '长度',
            value: e.detail.value.length
          },
          {
            id: '',
            name: '理论支重',
            value: e.detail.value.theoryWeight
          },
          {
            id: '',
            name: '平均支重',
            value: e.detail.value.averageWeight
          },
          {
            id: '',
            name: '支数',
            value: e.detail.value.count
          }
        ]
      };
      if (_this.data.content != '') {
        for (var i = 0, size = list.length; i < size; i++) {
          if (list[i].id == _this.data.id) {
            list[i] = content;
          }
        }
        _this.setData({
          list: list
        })
      } else {
        _this.data.list.push(content);
      }

      var pages = getCurrentPages();
      if (pages.length > 1) {
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
          list: _this.data.list
        });
        wx.navigateBack({
          delta: 1, // 返回上一级页面。
          success: function() {
            console.log('成功！')
          }
        })
      }
    }



  },

})