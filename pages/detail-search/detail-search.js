// pages/detail-search/detail-search.js
import { playerStore } from '../../store/index'

import {
  getSearchHot,
  getSearchSuggest,
  getSearch
} from '../../api/detail-search'

import debounce from '../../utils/debounce'

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    suggestNodes: [],

    searchHot: [], // 热门搜索
    searchSuggest: [], // 搜索建议
    search: [] // 搜索结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    getSearchHot().then((res) => {
      this.setData({
        searchHot: res.result.hots
      })
    })
  },

  // 输入
  handleSearchChange(e) {
    // 1.获取输入的关键字
    const searchValue = e.detail

    // 2.保存关键字
    this.setData({
      searchValue
    })

    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      this.setData({
        searchSuggest: [],
        search: []
      })
      return
    }

    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then((res) => {
      if (!Object.keys(res.result).length) return
      const searchSuggest = res.result.allMatch
      this.setData({
        searchSuggest
      })

      const suggestKeywords = searchSuggest.map((item) => item.keyword)
      const suggestNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = []
        if (keyword.toUpperCase().startsWith(searchValue.toUpperCase())) {
          const key1 = keyword.slice(0, searchValue.length)
          const node1 = {
            name: 'span',
            attrs: {
              style: 'color: #26ce8a; font-size: 14px;'
            },
            children: [
              {
                type: 'text',
                text: key1
              }
            ]
          }
          nodes.push(node1)
          const key2 = keyword.slice(searchValue.length)
          const node2 = {
            name: 'span',
            attrs: {
              style: 'color: #000; font-size: 14px;'
            },
            children: [
              {
                type: 'text',
                text: key2
              }
            ]
          }
          nodes.push(node2)
        } else {
          const node = {
            name: 'span',
            attrs: {
              style: 'color: #000; font-size: 14px;'
            },
            children: [
              {
                type: 'text',
                text: keyword
              }
            ]
          }
          nodes.push(node)
        }
        suggestNodes.push(nodes)
      }
      this.setData({
        suggestNodes
      })
    })
  },

  // 点击keyword
  handleKeywordItemClick(e) {
    // 1.获取关键字
    const keyword = e.currentTarget.dataset.keyword

    // 2.将关键字设置到searchValue中
    this.setData({
      searchValue: keyword
    })

    // 3.发送网络请求
    this.handleSearchAction()
  },

  // 搜索
  handleSearchAction() {
    const searchValue = this.data.searchValue
    getSearch(searchValue).then((res) => {
      this.setData({
        search: res.result.songs
      })
    })
  },

  // 点击歌曲
  handleDetailSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playlist', this.data.search)
    playerStore.setState('playlistIndex', index)
  }
})
