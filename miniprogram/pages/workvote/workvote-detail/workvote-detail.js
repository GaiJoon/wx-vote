const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    entities: [], //数据集合
    totalPages: 0, //总页数
    currentPage: 1, //当前页数
    isLoading: true, //显示弹框
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    var URL = app.globalData.domain;
    var Id = options.id;

    this.setData({
      id: Id,
    })
    wx.request({
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      url: URL + '/groups/' + Id + '/works',
      success: res => {
        console.log(res);
        wx.hideLoading();
        const entities = res.data.data;
        this.setData({
          id: Id,
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
   * 跳转到作品列表
   */
  Detail: function(event) {
    // console.log(event);
    var Id = event.currentTarget.dataset.id;
    var Group_id = event.currentTarget.dataset.group;
    // console.log(Group_id);
    wx.navigateTo({
      url: '../workvote-vote/workvote-vote?id=' + Id + '&group_id=' + Group_id,
      success: function() {
        console.log('succes');
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;
    var URL = app.globalData.domain;
    var Id = this.data.id
    wx.request({
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      url: URL + '/groups/' + Id + '/works',
      success: res => {
        console.log(res);

        wx.hideLoading();
        const entities = res.data.data;

        this.setData({
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
    var Id = this.data.id;
    var that = this;
    // 请求下一页数据
    wx.request({
      url: URL + '/groups/' + Id + '/works?page=' + currentPage,
      method: 'get',
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': `Bearer ${wx.getStorageSync('access_token')}`
      },
      success: res => {
        console
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