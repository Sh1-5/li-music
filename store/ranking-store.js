import { HYEventStore } from 'hy-event-store'

import { getPlaylistDetail } from '../api/home-music'

const rankingStore = new HYEventStore({
  state: {
    recommendPlay: {},
    newPlay: {},
    createPlay: {},
    risePlay: {}
  },
  actions: {
    // 3778678：热歌榜
    // 3779629：新歌榜
    // 2884035：原创榜
    // 19723756：飙升榜
    getPlayAction(ctx) {
      getPlaylistDetail().then((res) => {
        ctx.recommendPlay = res.playlist
      })
      getPlaylistDetail(3779629).then((res) => {
        ctx.newPlay = res.playlist
      })
      getPlaylistDetail(2884035).then((res) => {
        ctx.createPlay = res.playlist
      })
      getPlaylistDetail(19723756).then((res) => {
        ctx.risePlay = res.playlist
      })
    }
  }
})

export { rankingStore }
