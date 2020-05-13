const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
   
  },
  formSubmit(e){
    let formId = e.detail.formId
    let mu = e.detail.value.mu
    if(this.data.address == ''){
      wx.showToast({
        title: '请选择地址',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '发布中',
        mask:true
      })
      app.com.post('help/add',{
        openid: wx.getStorageSync("user").openid, 
        wx_id:wx.getStorageSync("user").id,
        mu:this.data.address,
        a_id: wx.getStorageSync("area").pk_id,
        form_id:formId,
        title:'快递代取',
        des:this.data.kdtype[this.data.flag].la+' '+e.detail.value.des,
        total_fee: this.data.kdtype[this.data.flag].price
      },function(res){
        if(res.code == 1){
          wx.showToast({
            title: '发布成功',
          })
          _this.wxpay(res)
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
    }
  },
  wxpay(msg){
    app.com.wxpay(msg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})