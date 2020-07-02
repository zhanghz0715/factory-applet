const app = getApp()
let _this;
Page({

      /**
       * 页面的初始数据
       */
      data: {
        list: [],
        type: '请选择产品',
        typeId: '',
        count: '',
        weight: '',
        totalWeight: '',
        stock: '',
        price: '', //单价
        totalPrice: '', //总价
        tempStock: '',
        btnName: '添加产品', //按钮名称
        content: '', //上个页面带过来的内容
        id: '', //上个页面带过来的内容的id
        saleTypeId: ''

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
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
            btnName: '修改产品',
            content: content,
            id: content.id,
          })
          wx.setNavigationBarTitle({
            title: '修改产品'
          })
        }
        if (options.id != null) {
          _this.setData({
            btnName: '修改产品',
            saleTypeId: options.id,
            show: true
          })
          wx.setNavigationBarTitle({
            title: '修改产品'
          })
          _this.getDetail(options.id)
        }
      },
      // 监听输入
      watchCount: function (event) {
        _this.setData({
          count: event.detail.value
        })
        if (_this.data.totalWeight != "") {
          _this.setData({
            weight: (parseFloat(_this.data.totalWeight) / parseInt(event.detail.value)).toFixed(3)
          })
        }
        if (_this.data.tempStock != "") {
          _this.setData({
            stock: parseInt(_this.data.tempStock) - parseInt(event.detail.value)
          })
        }
        if (event.detail.value == '') {
          _this.setData({
            stock: parseInt(_this.data.tempStock)
          })
        }
      },
      // 监听输入
      watchPrice: function (event) {
        _this.setData({
          price: event.detail.value
        })
        if (_this.data.price != "" && _this.data.totalWeight != '') {
            _this.setData({
              totalPrice: (parseFloat(_this.data.totalWeight)* parseFloat(event.detail.value)).toFixed(2)
            })
          }
        },
        // 监听输入
        watchWeight: function (event) {
            _this.setData({
              totalWeight: event.detail.value
            })
            if (_this.data.count != "") {
              _this.setData({
                weight: (parseFloat(event.detail.value) / parseInt(_this.data.count)).toFixed(3)
              })
            }
          },

          analyzeData(content) {
            var list = content.pages;
            for (let i = 0, len = list.length; i < len; ++i) {
              if (list[i].name == '产品' && list[i].value != '') {
                _this.setData({
                  type: list[i].value,
                  typeId: list[i].id,
                })
              } else if (list[i].name == '总重' && list[i].value != '') {
                _this.setData({
                  totalWeight: list[i].value
                })
              } else if (list[i].name == '实际支重' && list[i].value != '') {
                _this.setData({
                  weight: list[i].value
                })
              } else if (list[i].name == '支数' && list[i].value != '') {
                _this.setData({
                  count: list[i].value
                })
              } else if (list[i].name == '库存' && list[i].value != '') {
                _this.setData({
                  stock: list[i].value
                })
              } else if (list[i].name == '单价' && list[i].value != '') {
                _this.setData({
                  price: list[i].value
                })
              } else if (list[i].name == '总价' && list[i].value != '') {
                _this.setData({
                  totalPrice: list[i].value
                })
              }
            }
          },
          //获取详情
          getDetail(id) {
            app.com.post('sale/type/getDetail', {
              id: id
            }, function (res) {
              if (res.code == 1) {
                _this.setData({
                  type: res.data.typeName,
                  typeId: res.data.typeId,
                  count: res.data.count,
                  weight: res.data.weight,
                  totalWeight: res.data.totalWeight,
                  stock: res.data.stock
                })
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            })
          },
          onShow: function () {},
          //选择产品
          chooseType() {
            wx.navigateTo({
              url: '/pages/type/type?isChoose=true',
            })
          },
          formSubmit(e) {
            if (_this.data.typeId == '') {
              wx.showToast({
                title: '请选择产品',
                icon: 'none'
              })
              return;
            }
            if (_this.data.totalWeight == '') {
              wx.showToast({
                title: '请输入总重',
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
            if (e.detail.value.price == '') {
              wx.showToast({
                title: '请输入单价',
                icon: 'none'
              })
              return;
            }
            if (e.detail.value.totalPrice == '') {
              wx.showToast({
                title: '请输入总价',
                icon: 'none'
              })
              return;
            }
            if (_this.data.saleTypeId != '') {

            } else {
              if(_this.data.list.length>0){
                var isHas = false;
                for(var i=0;i<_this.data.list.length;i++){
                  var pages = _this.data.list[i].pages;
                  var typeId= pages[0].id;
                  if(_this.data.typeId == typeId){
                    isHas = true;
                  }
                }
                if(isHas){
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '该产品已经存在，不能重复添加!',
                    success: function(res) {
                      if (res.confirm) {
                       
                      } else if (res.cancel) {
                        //点击取消按钮
                      }
                    }
                  })
                  return;
                }
              }
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
                    id: _this.data.typeId,
                    name: '产品',
                    value: _this.data.type,
                  },
                  {
                    id: '',
                    name: '支数',
                    value: e.detail.value.count
                  },
                  {
                    id: '',
                    name: '总重',
                    value: e.detail.value.totalWeight
                  },
                  {
                    id: '',
                    name: '实际支重',
                    value: e.detail.value.weight
                  },
                  {
                    id: '',
                    name: '库存',
                    value: e.detail.value.stock
                  },
                  {
                    id: '',
                    name: '单价',
                    value: e.detail.value.price
                  },
                  {
                    id: '',
                    name: '总价',
                    value: e.detail.value.price
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
                  list: _this.data.list,

                });
                wx.navigateBack({
                  delta: 1, // 返回上一级页面。
                  success: function () {
                    console.log('成功！')
                  }
                })
              }
            }



          },

      })