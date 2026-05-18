App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    location: null,
    weatherData: null,
    fishingRecords: []
  },

  onLaunch() {
    console.log('智能钓鱼助手启动');
    this.getSystemInfo();
    this.loadRecords();
  },

  onShow() {
    console.log('应用显示');
  },

  onHide() {
    console.log('应用隐藏');
  },

  onError(msg) {
    console.error('应用错误:', msg);
  },

  // 获取系统信息
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
        console.log('系统信息:', res);
      },
      fail: (err) => {
        console.error('获取系统信息失败:', err);
      }
    });
  },

  // 加载钓鱼记录
  loadRecords() {
    try {
      const records = wx.getStorageSync('fishing_records') || [];
      this.globalData.fishingRecords = records;
      console.log('已加载记录数:', records.length);
    } catch (e) {
      console.error('加载记录失败:', e);
      this.globalData.fishingRecords = [];
    }
  },

  // 保存钓鱼记录
  saveRecord(record) {
    try {
      const records = wx.getStorageSync('fishing_records') || [];
      record.id = Date.now();
      record.createTime = new Date().toISOString();
      records.unshift(record);
      wx.setStorageSync('fishing_records', records);
      this.globalData.fishingRecords = records;
      return true;
    } catch (e) {
      console.error('保存记录失败:', e);
      return false;
    }
  },

  // 删除记录
  deleteRecord(id) {
    try {
      let records = wx.getStorageSync('fishing_records') || [];
      records = records.filter(r => r.id !== id);
      wx.setStorageSync('fishing_records', records);
      this.globalData.fishingRecords = records;
      return true;
    } catch (e) {
      console.error('删除记录失败:', e);
      return false;
    }
  },

  // 获取用户位置
  getLocation(callback) {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        if (callback) callback(null, this.globalData.location);
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        if (callback) callback(err, null);
      }
    });
  }
});
