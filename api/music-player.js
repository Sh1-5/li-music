import request from '../utils/request'

// 歌曲详情
export const getSongDetail = (ids) => {
  return request.get('/song/detail', {
    ids
  })
}

// 歌词
export const getSongLyric = (id) => {
  return request.get('/lyric', {
    id
  })
}
