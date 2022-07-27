// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认歌单'
    },
    playlist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePlaylistItem(e) {
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-song-list/detail-song-list?id=${item.id}`
      })
    }
  }
})
