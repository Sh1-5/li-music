// components/detail-song-item/detail-song-item.js
import { playerStore } from '../../store/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0
    },
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick() {
      const id = this.properties.item.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`
      })
      playerStore.dispatch('playMusicWithSongIdAction', {
        id
      })
    }
  }
})
