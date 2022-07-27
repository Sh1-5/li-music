import request from '../utils/request'

// MV排行
export const getTopMV = (offset = 0, limit = 10) => {
  return request.get('/top/mv', {
    offset,
    limit
  })
}
