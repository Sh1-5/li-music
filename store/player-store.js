const audioContext = wx.getBackgroundAudioManager()

import { HYEventStore } from 'hy-event-store'

import { getSongDetail, getSongLyric } from '../api/music-player'

import parseLyric from '../utils/parse-lyric'

const playerStore = new HYEventStore({
  state: {
    // 播放相关
    isFirstPlay: true,
    isStoping: false,

    id: 0, // 歌曲id
    currentSong: {}, // 歌曲详情
    dt: 0, // 歌曲时长
    lyric: [], // 所有歌词

    ct: 0, // 当前时间
    currentLyricIndex: 0,
    currentLyric: '', // 当前歌词

    isPlaying: false,

    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    playlist: [],
    playlistIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (id === ctx.id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      }

      ctx.id = id
      ctx.currentSong = {}
      ctx.dt = 0
      ctx.lyric = []

      ctx.ct = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyric = ''

      ctx.isPlaying = true

      // 1.请求数据
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0]
        ctx.dt = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      getSongLyric(id).then((res) => {
        const lyricString = res.lrc.lyric
        const lyric = parseLyric(lyricString)
        ctx.lyric = lyric
      })

      // 2.播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 3.audioContext的事件监听
      if (ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const ct = audioContext.currentTime * 1000

        // 2.根据当前时间修改ct
        ctx.ct = ct

        // 3.根据当前时间去查找显示的歌词
        if (!ctx.lyric.length) return
        let i = 0
        for (; i < ctx.lyric.length; i++) {
          if (ctx.lyric[i].time > ct) {
            break
          }
        }

        const index = i - 1
        if (ctx.currentLyricIndex !== index) {
          ctx.currentLyric = ctx.lyric[index].text
          ctx.currentLyricIndex = index
        }
      })

      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
      if (ctx.isStoping) {
        audioContext.seek(ctx.ct)
        ctx.isStoping = false
      }
    },

    changeNewMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playlistIndex

      // 2.根据不同的播放模式获取下一首歌的索引
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playlist.length - 1
          if (index === ctx.playlist.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playlist.length)
          break
      }

      // 3.获取歌曲
      let currentSong = ctx.playlist[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        // 记录最新的索引
        ctx.playlistIndex = index
      }

      // 4.播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', {
        id: currentSong.id,
        isRefresh: true
      })
    }
  }
})

export { playerStore, audioContext }
