// pages/home-video/home-video.js
import { getTopMV } from '../../api/home-video'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMV: [], // MV列表
    hasMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    // 获取MV列表
    const res = await getTopMV()
    this.setData({
      topMV: res.data,
      hasMore: res.hasMore
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    const res = await getTopMV()
    this.setData({
      topMV: res.data,
      hasMore: res.hasMore
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    if (!this.data.hasMore) return
    const res = await getTopMV(this.data.topMV.length)
    this.setData({
      topMV: this.data.topMV.concat(res.data),
      hasMore: res.hasMore
    })
  },

  // 点击MV
  handleVideoItemClick(e) {
    const id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${id}`
    })
  }
})
