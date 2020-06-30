const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplier: '', //供应商
    name: '', //型号
    type: '选择产品', //产品
    typeId: '', //产品ID
    status: '', //状态
    mouldId: '',
    imageUrl: '',
    imageId: '', //存在数据库的图片ID
    oxidation:'',//氧化情况
    remark:'',//备注
    factoryId: '1',
    isLocalImg: false,
    isUpdate:false

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
    }
    if (options.id != null) {
      _this.getDeatil(options.id);
      wx.setNavigationBarTitle({
        title: '修改模具'
      })
    }
  },
  getDeatil(id) {
    wx.showLoading({
      title: '加载中',
    })

    app.com.post('mould/getDetail', {
      mouldId: id
    }, function(res) {
      wx.hideLoading()
      if (res.code == 1) {
        var content = res.data;
        _this.setData({
          supplier: content.supplier, //供应商
          name: content.name, //型号
          type: content.typeName, //产品
          typeId: content.typeId, //产品ID
          status: content.status, //状态
          mouldId: content.id,
          imageUrl: content.image,
          imageId: content.imageId, //存在数据库的图片ID，
          oxidation:content.oxidation,
          remark:content.remark,
          isUpdate:true
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  chooseType() {
    wx.navigateTo({
      url: '/pages/type/type?isChoose=true',
    })
  },
  choose(e) {
    let name = e.currentTarget.dataset.name
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          imageUrl: tempFilePaths[0]
        })
        _this.upload(name)
      }
    })
  },
  upload(name) {
    if (this.data[name] != '' && this.data[name].indexOf('tmp') > 0) {
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      wx.uploadFile({
        url: app.com.API + 'image/save',
        filePath: this.data[name],
        name: 'file',
        success(res) {
          let red = JSON.parse(res.data)
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'none'
          });
          _this.setData({
            imageId: red.data,
            isLocalImg: true,
          })
        }
      })
    } else {
      wx.showToast({
        title: '请选择图后再上传',
        icon: 'none'
      })
    }
  },
  radioChange(e) {
    _this.setData({
      status: e.detail.value
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
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请填写型号',
        icon: 'none'
      })
      return;
    }
    if (_this.data.typeId == '') {
      wx.showToast({
        title: '请选择产品',
        icon: 'none'
      })
      return;
    }
    if (_this.data.mouldId != '') {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('mould/update', {
        id: _this.data.mouldId,
        name: e.detail.value.name,
        typeId: _this.data.typeId,
        supplier: e.detail.value.supplier,
        status:_this.data.status,
        oxidation: e.detail.value.oxidation,
        remark:e.detail.value.remark,
        imageId: _this.data.imageId
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1, // 返回上一级页面。
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
      app.com.post('mould/save', {
        name: e.detail.value.name,
        typeId: _this.data.typeId,
        supplier: e.detail.value.supplier,
        imageId: _this.data.imageId,
        remark:e.detail.value.remark,
        factoryId: _this.data.factoryId
      }, function(res) {
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1, // 返回上一级页面。
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