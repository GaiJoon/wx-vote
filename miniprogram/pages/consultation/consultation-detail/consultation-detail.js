var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
// pages/consultation/consultation-detail/consultation-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var URL = app.globalData.domain;
    // console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    //加载页面数据
    wx.request({
      header:{
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      url: URL + '/information/'+options.id,
      method: 'get',
      success: res => {
        wx.hideLoading();
        var contents = res.data.data.content;
        console.log(contents);
        WxParse.wxParse('content', 'html', contents, that, 0)
        that.setData({
          author: res.data.data.author,
          cover: res.data.data.cover,
          created_at: res.data.data.created_at,
          title: res.data.data.title,
          views: res.data.data.views,

        })
      },
      fail: error => {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 3000
        });

      }

    })
  },
})