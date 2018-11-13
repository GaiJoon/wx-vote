// pages/workvote/workvote.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false, //模态框
    entities: [], //数据集合
    totalPages: 0, //总页数
    currentPage: 1, //当前页数
    isLoading: true, //显示弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
              that.showData(res,that);
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
   * 跳转详情页
   */
  Detail: function(event) {
    // console.log(event)

    var Id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "workvote-detail/workvote-detail?id=" + Id,
      success: function() {
        console.log('succes');
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },
  /**
   * 页面数据加载
   */
  showData:function(res,that){
    var URL = app.globalData.domain;
    // console.log(wx.getStorageSync('access_token'));
    wx.request({
      url: URL + '/groups',
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      success: res => {
        //将值写入数据集合
        const entities = res.data.data;
        that.setData({
          entities,
          isLoading: false,
          totalPages: res.data.meta.pagination.total_pages,
          currentPage: 1,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 把data数据取出
    let {
      currentPage,
      totalPages,
      isLoading
    } = this.data
    //判断
    if (currentPage >= totalPages || isLoading) {
      return
    }

    this.setData({
      isLoading: true
    })
    //页数加1
    currentPage = currentPage + 1
    var URL = app.globalData.domain;
    console.log(currentPage);
    var that = this;
    // 请求下一页数据
    wx.request({
      url: URL + '/groups?page=' + currentPage,
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      success: res => {
        //在次写入数组
        const entities = [...this.data.entities, ...res.data.data]
        that.setData({
          entities,
          currentPage,
          isLoading: false,
          totalPages: res.data.meta.pagination.total_pages,
        })
      }
    })
  },
})