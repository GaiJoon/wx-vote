// pages/contactUs/contactUs.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false, //模态框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var URL = app.globalData.domain;
    var that = this;
    wx.login({
      success: function (res) {
        var URL = app.globalData.domain;
        var code = res.code; //登录凭证
        wx.request({
          data: {
            'code': code,
          },
          url: URL + '/user/getuser',
          method: 'POST',
          success: function (res) {
            // console.log(res);
            if (!res.data.access_token) {
              wx.hideLoading();
              that.setData({
                showModal: true
              });
            } else {
              wx.setStorage({
                key: 'access_token',
                data: res.data.access_token
              })
              //加载页面数据
              that.showData(res, that);
            }

          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          fail: error => {
            wx.showToast({
              title: '服务器错误',
              icon: 'loading',
              duration: 3000
            });

          },
        })
      },
      fail: function () {
        callback(false)
      }


    })
    
  },
  /**
   * 呼叫
   */
  phone: function() {
    console.log('asdddd');
    wx.showModal({
      "title": "呼叫",
      "content": "400-700-1307",
      "confirmText": "呼叫",
      "success": function() {
        wx.makePhoneCall({
          "phoneNumber": "400-700-1307",
        })
      },
      "fail": function() {
        console.log("asdasd");
      }

    })
  },

  /**
   * 页面加载数据
   */
  showData:function(res,that){
    var URL = app.globalData.domain;
    // console.log(wx.getStorageSync('access_token'));
    //加载页面数据
    wx.request({
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      url: URL + '/aboutus',
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        that.setData({
          title: res.data.data[0].title,
          cover: res.data.data[0].cover,
          introduction: res.data.data[0].introduction,
          address: res.data.data[0].address,
          phone: res.data.data[0].phone,
        })
      }
    })
  },
 

  /**
   * 获取用户信息
   */
  onGotUserInfo: function (e) {

    this.setData({
      showModal: false
    });
    var that = this;
    var userdata = e.detail.rawData;
    console.log(userdata);
    wx.login({
      success: function (res) {
        var URL = app.globalData.domain;
        var code = res.code; //登录凭证
        wx.request({
          data: {
            'code': code,
            'userdata': userdata,
          },
          url: URL + '/user/getuser',
          method: 'POST',
          success: function (res) {
            // console.log(res);
            wx.setStorage({
              key: 'access_token',
              data: res.data.access_token
            })

            //加载页面数据
            that.showData(res, that);
          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          fail: error => {
            wx.showToast({
              title: '服务器错误',
              icon: 'loading',
              duration: 3000
            });

          },
        })
      },
      fail: function () {
        callback(false)
      }


    })

  },
})