const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    typeIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    
  },
  onShow: function() {
    _this.getTypeList();

  },
  getTypeList() {
    app.com.post('type/list', {}, function(res) {
      if (res.code == 1) {
        _this.setData({
          typeList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }

})