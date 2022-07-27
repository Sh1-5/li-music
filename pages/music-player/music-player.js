// pages/music-player/music-player.js
import { playerStore, audioContext } from '../../store/index'

const playModeNames = ['order', 'repeat', 'random']

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentSong: {}, // 歌曲详情
    lyric: [], // 歌词

    ct: 0, // 当前时间
    dt: 0,
    currentLyricIndex: 0,
    currentLyric: '', // 当前歌词

    playModeIndex: 0,
    playModeName: 'order',

    isPlaying: false,
    playingName: 'pause',

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setupStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navigationBarHeight = globalData.navigationBarHeight
    const contentHeight = screenHeight - statusBarHeight - navigationBarHeight
    const deviceRadio = globalData.deviceRadio
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })
  },

  handleSwiperChange(e) {
    const currentPage = e.detail.current
    this.setData({
      currentPage
    })
  },

  handleSliderChanging(e) {
    const sliderValue = e.detail.value
    const ct = (this.data.dt * sliderValue) / 100
    this.setData({
      isSliderChanging: true,
      ct
    })
  },

  handleSliderChange(e) {
    // 1.获取slider变化的值
    const sliderValue = e.detail.value

    // 2.计算需要播放的ct
    const ct = (this.data.dt * sliderValue) / 100

    // 3.设置audioContext播放ct位置的音乐
    audioContext.seek(ct / 1000)

    this.setData({
      sliderValue,
      isSliderChanging: false
    })
  },

  setupStoreListener() {
    playerStore.onStates(
      ['currentSong', 'dt', 'lyric'],
      ({ currentSong, dt, lyric }) => {
        if (currentSong) {
          this.setData({
            currentSong
          })
        }
        if (dt) {
          this.setData({
            dt
          })
        }
        if (lyric) {
          this.setData({
            lyric
          })
        }
      }
    )

    playerStore.onStates(
      ['ct', 'currentLyricIndex', 'currentLyric'],
      ({ ct, currentLyricIndex, currentLyric }) => {
        // 时间变化
        if (ct && !this.data.isSliderChanging) {
          const sliderValue = (ct / this.data.dt) * 100
          this.setData({
            ct,
            sliderValue
          })
        }
        // 歌词变化
        if (currentLyricIndex) {
          this.setData({
            currentLyricIndex,
            lyricScrollTop: currentLyricIndex * 35
          })
        }
        if (currentLyric) {
          this.setData({
            currentLyric
          })
        }
      }
    )

    playerStore.onStates(
      ['playModeIndex', 'isPlaying'],
      ({ playModeIndex, isPlaying }) => {
        if (playModeIndex !== undefined) {
          this.setData({
            playModeIndex,
            playModeName: playModeNames[playModeIndex]
          })
        }
        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playingName: isPlaying ? 'pause' : 'resume'
          })
        }
      }
    )
  },

  handleBackClick() {
    wx.navigateBack()
  },

  handleBtnModeClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex > 2) {
      playModeIndex = 0
    }
    playerStore.setState('playModeIndex', playModeIndex)
  },

  handleBtnPauseClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },

  handleBtnPrevClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },

  handleBtnNextClick: function () {
    playerStore.dispatch('changeNewMusicAction')
  }
})
