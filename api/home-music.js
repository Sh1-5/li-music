import request from '../utils/request'

// 轮播图
export const getBanner = () => {
  return request.get('/banner', {
    type: 2
  })
}

// 歌单详情
export const getPlaylistDetail = (id = 3778678) => {
  return request.get('/playlist/detail', {
    id
  })
}

// 歌单
export const getTopPlaylist = (cat = '全部', limit = 6, offset = 0) => {
  return request.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}
