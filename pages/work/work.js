const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: app.com.getNowDate(), //日期
    supplier: '', //供应商
    mould: '请选择模号', //模号
    mouldId: '', //模号ID
    shift: '', //班组
    weight: '', //支重
    length: '', //棒长
    count: '', //棒数
    totalWeight: '', //生产重量
    oxidation: '', //氧化
    situation: '', //上机情况
    userMouldId: ''

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this

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
  formSubmit(e) {
    if (e.detail.value.supplier == '') {
      wx.showToast({
        title: '请填写供应商',
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
    if (e.detail.value.shift == '') {
      wx.showToast({
        title: '请填写班组',
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
    if (e.detail.value.lenght == '') {
      wx.showToast({
        title: '请填写棒长',
        icon: 'none'
      })
      return;
    }
    if (_this.data.userMouldId != '') {
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
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('userMould/save', {
        productDate: _this.data.date,
        supplier: e.detail.value.supplier,
        mouldId: _this.data.mouldId,
        shift: e.detail.value.shift,
        weight: e.detail.value.weight,
        lenght: e.detail.value.lenght,
        count: e.detail.value.count,
        count: e.detail.value.count,
        totalWeight: e.detail.value.totalWeight,
        oxidation: e.detail.value.oxidation,
        situation: e.detail.value.situation,
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
          wx.setStorageSync('isUpdate', true);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
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
    _this.getMouldList();

  },


})