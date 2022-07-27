import request from '../utils/request'

// 热门搜索
export const getSearchHot = () => {
  return request.get('/search/hot')
}

// 搜索建议
export const getSearchSuggest = (keywords) => {
  return request.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

// 搜索结果
export const getSearch = (keywords) => {
  return request.get('/search', {
    keywords
  })
}
