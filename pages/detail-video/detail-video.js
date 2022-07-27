// pages/detail-video/detail-video.js
import { getMVUrl, getMVDetail, getSimiMV } from '../../api/detail-video'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mvUrl: {}, // url
    mvDetail: {}, // 详情
    simiMV: [] // 相似MV
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData(options.id)
  },

  // 获取页面数据
  getPageData(id) {
    getMVUrl(id).then((res) => {
      this.setData({
        mvUrl: res.data
      })
    })
    getMVDetail(id).then((res) => {
      this.setData({
        mvDetail: res.data
      })
    })
    getSimiMV(id).then((res) => {
      this.setData({
        simiMV: res.mvs
      })
    })
  },

  // 点击相似MV
  hanldeSimiVideoItemClick(e) {
    const id = e.currentTarget.dataset.item.id
    wx.redirectTo({
      url: `/pages/detail-video/detail-video?id=${id}`
    })
  }
})
