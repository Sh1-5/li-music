// pages/home-music/home-music.js
import { rankingStore, playerStore } from '../../store/index'

import { getBanner, getTopPlaylist } from '../../api/home-music'

import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000, {
  trailing: true
})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 143.88, // 默认swiper高度

    banner: [], // 轮播图

    recommendSong: [], // 推荐歌曲

    hotPlaylist: [], // 热门歌单
    recommendPlaylist: [], // 推荐歌单

    ranking: {
      newPlay: {}, // 新歌榜
      createPlay: {}, // 原创榜
      risePlay: {} // 飙升榜
    },

    currentSong: {},
    isPlaying: false,
    playAnimState: 'paused'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取轮播图
    getBanner().then((res) => {
      this.setData({
        banner: res.banners
      })
    })

    // 获取推荐歌曲、巅峰榜
    rankingStore.dispatch('getPlayAction')
    rankingStore.onState('recommendPlay', (res) => {
      if (!res.tracks) return
      const recommendSong = res.tracks.slice(0, 6)
      this.setData({
        recommendSong
      })
    })
    rankingStore.onState('newPlay', this.handleRankingObj('newPlay'))
    rankingStore.onState('createPlay', this.handleRankingObj('createPlay'))
    rankingStore.onState('risePlay', this.handleRankingObj('risePlay'))

    playerStore.onStates(
      ['currentSong', 'isPlaying'],
      ({ currentSong, isPlaying }) => {
        if (currentSong)
          this.setData({
            currentSong
          })
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playAnimState: isPlaying ? 'running' : 'paused'
          })
        }
      }
    )

    // 获取热门歌单
    getTopPlaylist().then((res) => {
      this.setData({
        hotPlaylist: res.playlists
      })
    })

    // 获取推荐歌单
    getTopPlaylist('流行').then((res) => {
      this.setData({
        recommendPlaylist: res.playlists
      })
    })
  },

  // 点击搜索
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search'
    })
  },

  // 获取swiper高度
  handleSwiperItemImageLoad() {
    throttleQueryRect('.image').then((res) => {
      this.setData({
        swiperHeight: res[0].height
      })
    })
  },

  // 处理巅峰榜数据
  handleRankingObj(play) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {
        name,
        coverImgUrl,
        playCount,
        songList
      }
      const ranking = {
        ...this.data.ranking,
        [play]: rankingObj
      }
      this.setData({
        ranking
      })
    }
  },

  handleRecommendMoreClick() {
    this.navigateToDetailSongList('recommendPlay')
  },

  handleRankingClick(e) {
    this.navigateToDetailSongList(e.currentTarget.dataset.index)
  },

  navigateToDetailSongList(name) {
    wx.navigateTo({
      url: `/pages/detail-song-list/detail-song-list?ranking=${name}`
    })
  },

  handleSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playlist', this.data.recommendSong)
    playerStore.setState('playlistIndex', index)
  },

  handlePlayBarClick() {
    const id = this.data.currentSong.id
    wx.navigateTo({
      url: `/pages/music-player/music-player?id=${id}`
    })
  },

  handlePlayBtnClick: function () {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  }
})
