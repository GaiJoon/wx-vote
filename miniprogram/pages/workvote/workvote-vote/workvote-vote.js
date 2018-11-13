// pages/workvote/workvote-vote/workvote-vote.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected: 'true',
    showModal: false,
  },
  /**
   * 模态框拒绝方法
   */
  cancel: function() {
    this.setData({
      showModal: false,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showLoading({
      title: '加载中',
    })
    var URL = app.globalData.domain;
    var work_id = options.id;
    var group_id = options.group_id;
    console.log(options);

    //加载页面数据
   
    var that = this;
    wx.request({
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      url: URL + '/groups/' + group_id + '/works/' + work_id,
      success: res => {
        console.log(res.data.meta.time == "no");
        wx.hideLoading();
        const data = res.data.data;
        var contents = data.content;
        if (res.data.meta.click == "no"){
          console.log('asda');
          that.setData({
            collected: false
          })
          
        }
        if (res.data.meta.time == "no"){
          that.setData({
            collected: '305',
          })
        }
        
        console.log(that.data.collected);
        WxParse.wxParse('content', 'html', contents, that, 0)
        this.setData({
          title: data.title,
          conver: data.cover,
          introduction: data.introduction,
          members: data.members,
          id: data.id,
          group_id: data.group_id,
        })
      },
      fail: error => {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 3000
        });

      },

    })

  },


  /**
   * 投票方法
   */
  voteTap: function(event) {
    var that = this;
    var Id = event.currentTarget.dataset.id;
    var URL = app.globalData.domain;
    var access_token = wx.getStorageSync('access_token');

    if (access_token) {
      wx.request({
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
        },
        url: URL + '/works/'+Id,
        success: res => {
          console.log(res);
          that.setData({
            collected: false,
          })
        }
      })
    } else {
      that.setData({
        showModal: true,
      })
    }
  },

  /**
   * 跳转到投票详情
   */
  voteItem: function(event) {
    var Id = event.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: "../workvote-item/workvote-item?id=" + Id,
      success: function() {
        console.log('succes');
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})