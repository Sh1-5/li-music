import request from '../utils/request'

// MV地址
export const getMVUrl = (id) => {
  return request.get('/mv/url', {
    id
  })
}

// MV详情
export const getMVDetail = (mvid) => {
  return request.get('/mv/detail', {
    mvid
  })
}

// 相似MV
export const getSimiMV = (mvid) => {
  return request.get('/simi/mv', {
    mvid
  })
}
