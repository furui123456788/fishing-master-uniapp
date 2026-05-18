/**
 * API 请求封装
 * 用于与后端服务通信
 */

const API_BASE_URL = 'https://api.example.com'; // 替换为实际的API地址

// 请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url.startsWith('http') ? options.url : API_BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      timeout: options.timeout || 10000,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          console.error('请求失败:', res);
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('请求错误:', err);
        reject(err);
      }
    });
  });
};

module.exports = {
  /**
   * 获取天气数据
   * @param {Object} params - 请求参数
   * @param {number} params.latitude - 纬度
   * @param {number} params.longitude - 经度
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  getWeather(params) {
    const API_KEY = '9b39ba30bae0edf33003ffc37d234116';
    
    wx.request({
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${params.latitude}&lon=${params.longitude}&appid=${API_KEY}&units=metric&lang=zh_cn`,
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const weatherData = {
            code: 200,
            data: {
              temperature: Math.round(res.data.main.temp),
              description: res.data.weather[0]?.description || '晴',
              humidity: res.data.main.humidity,
              windSpeed: res.data.wind?.speed || 0,
              pressure: res.data.main.pressure,
              windDirection: this.getWindDirection(res.data.wind?.deg),
              visibility: res.data.visibility ? (res.data.visibility / 1000).toFixed(1) : 10,
              sunrise: new Date(res.data.sys.sunrise * 1000).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
              sunset: new Date(res.data.sys.sunset * 1000).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
            },
            message: 'success'
          };
          if (params.success) params.success(weatherData);
        } else {
          console.error('天气API错误:', res);
          if (params.fail) params.fail(new Error('获取天气失败'));
        }
      },
      fail: (err) => {
        console.error('天气请求失败:', err);
        // 失败时使用模拟数据
        const mockData = {
          code: 200,
          data: {
            temperature: 25,
            description: '晴',
            humidity: 65,
            windSpeed: 3.5,
            pressure: 1013,
            windDirection: '东北',
            visibility: 10,
            sunrise: '06:15',
            sunset: '18:45'
          },
          message: 'mock'
        };
        if (params.success) params.success(mockData);
      }
    });
  },

  // 风向角度转文字
  getWindDirection(deg) {
    if (!deg) return '无风';
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(deg / 45) % 8;
    return directions[index] + '风';
  },

  /**
   * 获取钓鱼指数
   * @param {Object} params - 请求参数
   * @param {number} params.latitude - 纬度
   * @param {number} params.longitude - 经度
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  getFishingIndex(params) {
    setTimeout(() => {
      const mockData = {
        code: 200,
        data: {
          score: Math.floor(Math.random() * 40) + 60, // 60-100分
          level: ['较差', '一般', '良好', '优秀', '极佳'][Math.floor(Math.random() * 5)],
          bestTime: '06:00-09:00, 17:00-20:00',
          position: '深水区、水草边缘',
          targetFish: '鲫鱼、鲤鱼、草鱼',
          tips: '今日气压稳定，水温适宜，是钓鱼的好时机。',
          factors: {
            temperature: { score: 85, desc: '适宜' },
            pressure: { score: 90, desc: '稳定' },
            humidity: { score: 75, desc: '适中' },
            wind: { score: 80, desc: '微风' }
          }
        },
        message: 'success'
      };

      if (params.success) {
        params.success(mockData);
      }
    }, 600);
  },

  /**
   * AI浮漂识别
   * @param {Object} params - 请求参数
   * @param {string} params.imageBase64 - 图片base64数据
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  recognizeFloat(params) {
    setTimeout(() => {
      const results = [
        { type: 'normal', text: '正常', movement: '静止', confidence: 95 },
        { type: 'warning', text: '轻微动作', movement: '微动', confidence: 82 },
        { type: 'bite', text: '咬钩！', movement: '下沉', confidence: 91 },
        { type: 'bite', text: '咬钩！', movement: '上顶', confidence: 88 }
      ];

      const mockData = {
        code: 200,
        data: results[Math.floor(Math.random() * results.length)],
        message: 'success'
      };

      if (params.success) {
        params.success(mockData);
      }
    }, 300);
  },

  /**
   * 获取装备推荐
   * @param {Object} params - 请求参数
   * @param {string} params.scene - 钓鱼场景
   * @param {string} params.fishType - 目标鱼种
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  getEquipmentRecommendation(params) {
    setTimeout(() => {
      const mockData = {
        code: 200,
        data: {
          rods: [
            { name: '推荐鱼竿A', spec: '4.5米，28调', price: '¥299', reason: '适合当前场景' },
            { name: '推荐鱼竿B', spec: '5.4米，37调', price: '¥459', reason: '性价比高' }
          ],
          lines: [
            { name: '尼龙主线', spec: '2.0号', price: '¥25' },
            { name: '碳素子线', spec: '1.0号', price: '¥18' }
          ],
          hooks: [
            { name: '伊势尼', spec: '5号', price: '¥12' }
          ],
          baits: [
            { name: '商品饵', spec: '腥香型', price: '¥28' },
            { name: '红虫', spec: '鲜活', price: '¥15' }
          ]
        },
        message: 'success'
      };

      if (params.success) {
        params.success(mockData);
      }
    }, 400);
  },

  /**
   * 保存钓鱼记录
   * @param {Object} params - 请求参数
   * @param {Object} params.data - 记录数据
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  saveFishingRecord(params) {
    // 实际项目中应发送到服务器
    // 这里使用本地存储
    try {
      let records = wx.getStorageSync('fishing_records') || [];
      params.data.id = Date.now();
      params.data.createTime = new Date().toISOString();
      records.unshift(params.data);
      wx.setStorageSync('fishing_records', records);

      if (params.success) {
        params.success({ code: 200, message: '保存成功' });
      }
    } catch (e) {
      if (params.fail) {
        params.fail(e);
      }
    }
  },

  /**
   * 获取钓鱼记录列表
   * @param {Object} params - 请求参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  getFishingRecords(params) {
    try {
      let records = wx.getStorageSync('fishing_records') || [];
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      if (params.success) {
        params.success({
          code: 200,
          data: {
            list: records.slice(start, end),
            total: records.length,
            page: page,
            pageSize: pageSize
          },
          message: 'success'
        });
      }
    } catch (e) {
      if (params.fail) {
        params.fail(e);
      }
    }
  },

  /**
   * 用户登录
   * @param {Object} params - 请求参数
   * @param {string} params.code - 微信登录code
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   */
  login(params) {
    request({
      url: '/auth/login',
      method: 'POST',
      data: {
        code: params.code
      }
    }).then(data => {
      // 保存token
      if (data.token) {
        wx.setStorageSync('token', data.token);
      }
      if (params.success) params.success(data);
    }).catch(err => {
      if (params.fail) params.fail(err);
    });
  },

  /**
   * 上传图片
   * @param {Object} params - 请求参数
   * @param {string} params.filePath - 图片路径
   * @param {Function} params.success - 成功回调
   * @param {Function} params.fail - 失败回调
   * @param {Function} params.progress - 进度回调
   */
  uploadImage(params) {
    const uploadTask = wx.uploadFile({
      url: API_BASE_URL + '/upload/image',
      filePath: params.filePath,
      name: 'file',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (params.success) params.success(data);
      },
      fail: (err) => {
        if (params.fail) params.fail(err);
      }
    });

    if (params.progress) {
      uploadTask.onProgressUpdate((res) => {
        params.progress(res.progress);
      });
    }

    return uploadTask;
  }
};
