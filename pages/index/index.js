const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const app = getApp();

Page({
  data: {
    loading: false,
    weather: {
      temperature: 25,
      description: '晴',
      humidity: 65,
      windSpeed: 3.5,
      pressure: 1013
    },
    location: {
      city: '北京市',
      latitude: 39.9042,
      longitude: 116.4074
    },
    updateTime: '',
    fishingIndex: {
      score: 85,
      level: '极佳',
      bestTime: '06:00-09:00, 17:00-20:00',
      position: '深水区、水草边缘',
      targetFish: '鲫鱼、鲤鱼、草鱼',
      tips: '今日气压稳定，水温适宜，是钓鱼的好时机。建议选择背风向阳处，使用腥香型饵料。'
    },
    suggestions: [
      {
        icon: '🌅',
        title: '出钓时间',
        desc: '清晨6-9点和傍晚5-8点是最佳出钓时段，鱼类活跃度高。'
      },
      {
        icon: '🎣',
        title: '钓具选择',
        desc: '建议使用4.5-5.4米手竿，主线1.5号，子线0.8号。'
      },
      {
        icon: '🪱',
        title: '饵料推荐',
        desc: '今日推荐：红虫、蚯蚓、商品饵（腥香型）。'
      },
      {
        icon: '⚠️',
        title: '注意事项',
        desc: '注意防晒，备好饮用水和防蚊用品，安全第一。'
      }
    ]
  },

  onLoad() {
    this.updateTime();
    this.getLocationAndWeather();
  },

  onShow() {
    this.updateTime();
  },

  onPullDownRefresh() {
    this.getLocationAndWeather();
    wx.stopPullDownRefresh();
  },

  // 更新时间
  updateTime() {
    const now = new Date();
    const timeStr = util.formatTime(now);
    this.setData({
      updateTime: `更新于 ${timeStr}`
    });
  },

  // 获取位置和天气（先用IP定位，快）
  getLocationAndWeather() {
    this.setData({ loading: true });
    
    // 第一步：IP网络定位（1-2秒）
    this.getIPLocation();
  },

  // IP网络定位
  getIPLocation() {
    wx.request({
      url: 'https://ipapi.co/json/?lang=zh-CN',
      timeout: 3000,
      success: (res) => {
        const data = res.data;
        if (data && data.latitude && data.longitude) {
          const cityName = data.city || data.region || '当前位置';
          console.log('IP定位成功:', cityName, data.latitude, data.longitude);
          this.setData({
            'location.city': cityName,
            'location.latitude': data.latitude,
            'location.longitude': data.longitude
          });
          this.fetchWeather({
            latitude: data.latitude,
            longitude: data.longitude
          });
          this.setData({ loading: false });
          return;
        }
        this.fallbackToGPS();
      },
      fail: () => {
        this.fallbackToGPS();
      }
    });
  },

  // IP定位失败，用GPS
  fallbackToGPS() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const location = {
          latitude: res.latitude,
          longitude: res.longitude,
          city: '当前位置'
        };
        this.setData({ location: location });
        this.fetchWeather(location);
      },
      fail: () => {
        wx.showToast({ title: '定位失败，使用默认', icon: 'none' });
        this.fetchWeather(this.data.location);
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  // 获取天气数据
  fetchWeather(location) {
    api.getWeather({
      latitude: location.latitude,
      longitude: location.longitude,
      success: (res) => {
        if (res && res.data) {
          this.setData({
            weather: {
              temperature: res.data.temperature || 25,
              description: res.data.description || '晴',
              humidity: res.data.humidity || 65,
              windSpeed: res.data.windSpeed || 3.5,
              pressure: res.data.pressure || 1013
            }
          });
          this.calculateFishingIndex(res.data);
        }
      },
      fail: (err) => {
        console.error('获取天气失败:', err);
        // 使用模拟数据计算钓鱼指数
        this.calculateFishingIndex(this.data.weather);
      }
    });
  },

  // 计算钓鱼指数
  calculateFishingIndex(weatherData) {
    let score = 70;
    let level = '良好';
    let tips = '';

    const temp = weatherData.temperature || 25;
    const pressure = weatherData.pressure || 1013;
    const humidity = weatherData.humidity || 65;
    const windSpeed = weatherData.windSpeed || 3.5;

    // 温度评分 (15-28度最佳)
    if (temp >= 15 && temp <= 28) {
      score += 15;
    } else if (temp >= 10 && temp <= 32) {
      score += 8;
    } else {
      score -= 5;
    }

    // 气压评分 (1000-1025最佳)
    if (pressure >= 1000 && pressure <= 1025) {
      score += 10;
    } else if (pressure >= 990 && pressure <= 1035) {
      score += 5;
    } else {
      score -= 10;
    }

    // 湿度评分 (50-80%最佳)
    if (humidity >= 50 && humidity <= 80) {
      score += 5;
    }

    // 风速评分 (小于5m/s最佳)
    if (windSpeed < 3) {
      score += 5;
    } else if (windSpeed > 8) {
      score -= 10;
    }

    // 限制分数范围
    score = Math.max(0, Math.min(100, score));

    // 确定等级
    if (score >= 90) {
      level = '极佳';
      tips = '今日钓鱼条件完美！气压稳定，水温适宜，是爆护的好时机！';
    } else if (score >= 75) {
      level = '优秀';
      tips = '钓鱼条件很好，建议早出钓，选择合适钓位会有不错的收获。';
    } else if (score >= 60) {
      level = '良好';
      tips = '钓鱼条件尚可，注意选择合适的时间段和钓位。';
    } else if (score >= 40) {
      level = '一般';
      tips = '钓鱼条件一般，建议调整钓法和饵料，耐心等待。';
    } else {
      level = '较差';
      tips = '今日钓鱼条件不佳，建议改日出钓或选择室内钓场。';
    }

    // 根据温度调整目标鱼种和建议
    let targetFish = '鲫鱼、鲤鱼';
    let bestTime = '06:00-09:00, 17:00-20:00';
    let position = '深水区、水草边缘';

    if (temp >= 25) {
      targetFish = '草鱼、鲢鳙、鲫鱼';
      position = '浅水区、下风口';
      tips += ' 天气炎热，建议选择早晚时段，注意防暑。';
    } else if (temp <= 15) {
      targetFish = '鲫鱼、鲤鱼、鳊鱼';
      position = '深水区、向阳处';
      tips += ' 天气较凉，建议选择中午前后，向阳深水区。';
    }

    this.setData({
      fishingIndex: {
        score,
        level,
        bestTime,
        position,
        targetFish,
        tips
      }
    });
  },

  // 刷新天气
  refreshWeather() {
    wx.showLoading({ title: '刷新中...' });
    this.getLocationAndWeather();
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 跳转到相机页面
  goToCamera() {
    wx.switchTab({
      url: '/pages/camera/camera'
    });
  },

  // 跳转到装备页面
  goToEquipment() {
    wx.switchTab({
      url: '/pages/equipment/equipment'
    });
  },

  // 跳转到记录页面
  goToRecords() {
    wx.switchTab({
      url: '/pages/records/records'
    });
  }
});
