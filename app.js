// app.js
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navigationBarHeight: 44,
    deviceRadio: 0
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.deviceRadio = info.screenHeight / info.screenWidth

    // 默认登录
    // 1.获取token
    // 2.判断token有效性
    // 3.判断session有效性

    // 没有token/token无效/session无效
    this.loginAction()
  },

  loginAction() {
    // 1.获取code
    // 2.获取token
    // 3.存储token
  }
})
