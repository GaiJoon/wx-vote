const app = getApp();

// pages/consultation/consultation.js
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

    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    //获取请求域
    var URL = app.globalData.domain;

    //判断用户是否授权登录过
    wx.login({
      timeout: '300',
      success: function(res) {
        // console.log(r);
        var URL = app.globalData.domain;
        var code = res.code; //登录凭证
        wx.request({
          data: {
            'code': code,
          },
          url: URL + '/user/getuser',
          method: 'POST',
          success: function(res) {
            console.log(res)
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
            'content-type': 'application/json', // 默认值
          },
          fail: function(res) {
            console.log('error')
          }
        })

      },
      fail: function() {
        wx.showToast({
          title: '自动登录失败,请手动登录',
          icon: 'loading',
          duration: 3000
        });
        that.setData({
          showModal: true
        });
      }

    })

   


  },
  /**
   * 跳转详情页
   */
  details: function(event) {
    // console.log(event)
    var that = this;
    var Id = event.currentTarget.dataset.id;

    wx.navigateTo({
      url: "consultation-detail/consultation-detail?id=" + Id,
      success: function() {
        // console.log('succes');
      }
    })
  },

  /**
   * 获取用户信息
   */
  onGotUserInfo: function(e) {

    this.setData({
      showModal: false
    });
    var that = this;
    var userdata = e.detail.rawData;
    console.log(userdata);
    wx.login({
      success: function(res) {
        var URL = app.globalData.domain;
        var code = res.code; //登录凭证
        wx.request({
          data: {
            'code': code,
            'userdata': userdata,
          },
          url: URL + '/user/getuser',
          method: 'POST',
          success: function(res) {
            // console.log(res);
            wx.setStorage({
              key: 'access_token',
              data: res.data.access_token
            })

            //加载页面数据
            that.showData(res,that);
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
      fail: function() {
        callback(false)
      }


    })

  },
  /**
   * 模态框拒绝方法
   */
  cancel: function() {
    this.setData({
      showModal: true,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },
  /**
   * 页面数据
   */

  showData:function(res,that){

    // var that= this;
    var URL = app.globalData.domain;
    // console.log(res);
      //加载页面数据
    wx.request({
      method: 'get',
      url: URL + '/information',
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${res.data.access_token}`
      },
      success: res => {
        // console.log(current.data.totalPages)
        wx.hideLoading();
        //将值写入数据集合
        const entities = res.data.data;
        that.setData({
          entities,
          isLoading: false,
          totalPages: res.data.meta.pagination.total_pages,
          currentPage: 1,
        })
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '自动登录失败,请手动登录',
          icon: 'loading',
          duration: 3000
        });
        that.setData({
          showModal: true
        });
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
      url: URL + '/information?page=' + currentPage,
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