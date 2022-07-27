// pages/detail-song-list/detail-song-list.js
import { rankingStore, playerStore } from '../../store/index'

import { getPlaylistDetail } from '../../api/home-music'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ranking: '',
    playlistInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const ranking = options.ranking
    const id = options.id
    if (ranking) {
      this.setData({
        ranking
      })
      rankingStore.onState(ranking, this.getRankingDataHandler)
    } else {
      getPlaylistDetail(id).then((res) => {
        this.setData({
          playlistInfo: res.playlist
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)
    }
  },

  getRankingDataHandler(res) {
    this.setData({
      playlistInfo: res
    })
  },

  // 点击某首歌曲
  handleDetailSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playlist', this.data.playlistInfo.tracks)
    playerStore.setState('playlistIndex', index)
  }
})
