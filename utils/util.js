/**
 * 工具函数集合
 */

module.exports = {
  /**
   * 格式化日期时间
   * @param {Date} date - 日期对象
   * @param {string} format - 格式模板，默认 'yyyy-MM-dd hh:mm:ss'
   * @returns {string} 格式化后的字符串
   */
  formatTime(date, format = 'yyyy-MM-dd hh:mm:ss') {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
      .replace('hh', hour)
      .replace('mm', minute)
      .replace('ss', second);
  },

  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} yyyy-MM-dd
   */
  formatDate(date) {
    return this.formatTime(date, 'yyyy-MM-dd');
  },

  /**
   * 获取相对时间描述
   * @param {Date|string} date - 日期
   * @returns {string} 相对时间描述
   */
  getRelativeTime(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
      return Math.floor(diff / hour) + '小时前';
    } else if (diff < week) {
      return Math.floor(diff / day) + '天前';
    } else if (diff < month) {
      return Math.floor(diff / week) + '周前';
    } else {
      return this.formatDate(date);
    }
  },

  /**
   * 防抖函数
   * @param {Function} fn - 要执行的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {Function}
   */
  debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },

  /**
   * 节流函数
   * @param {Function} fn - 要执行的函数
   * @param {number} interval - 间隔时间（毫秒）
   * @returns {Function}
   */
  throttle(fn, interval = 300) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  /**
   * 深拷贝
   * @param {*} obj - 要拷贝的对象
   * @returns {*} 拷贝后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item));
    }

    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  /**
   * 对象转查询字符串
   * @param {Object} obj - 对象
   * @returns {string} 查询字符串
   */
  objectToQueryString(obj) {
    return Object.keys(obj)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&');
  },

  /**
   * 查询字符串转对象
   * @param {string} queryString - 查询字符串
   * @returns {Object} 对象
   */
  queryStringToObject(queryString) {
    const obj = {};
    if (!queryString) return obj;

    queryString.replace(/^\?/, '').split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
    return obj;
  },

  /**
   * 检查网络状态
   * @returns {Promise<Object>} 网络状态
   */
  checkNetwork() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: (res) => {
          resolve({
            isConnected: res.networkType !== 'none',
            networkType: res.networkType
          });
        },
        fail: () => {
          resolve({
            isConnected: false,
            networkType: 'unknown'
          });
        }
      });
    });
  },

  /**
   * 显示加载提示
   * @param {string} title - 提示文字
   * @param {boolean} mask - 是否显示透明蒙层
   */
  showLoading(title = '加载中...', mask = true) {
    wx.showLoading({
      title,
      mask
    });
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading();
  },

  /**
   * 显示成功提示
   * @param {string} title - 提示文字
   * @param {number} duration - 持续时间
   */
  showSuccess(title = '成功', duration = 1500) {
    wx.showToast({
      title,
      icon: 'success',
      duration
    });
  },

  /**
   * 显示错误提示
   * @param {string} title - 提示文字
   * @param {number} duration - 持续时间
   */
  showError(title = '失败', duration = 1500) {
    wx.showToast({
      title,
      icon: 'error',
      duration
    });
  },

  /**
   * 显示模态框
   * @param {Object} options - 配置选项
   * @returns {Promise<Object>}
   */
  showModal(options = {}) {
    return new Promise((resolve) => {
      wx.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        confirmColor: options.confirmColor || '#576b95',
        success: (res) => {
          resolve(res);
        }
      });
    });
  },

  /**
   * 显示操作菜单
   * @param {Array<string>} itemList - 菜单项列表
   * @returns {Promise<number>} 选中项的索引
   */
  showActionSheet(itemList) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList,
        success: (res) => {
          resolve(res.tapIndex);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 保存数据到本地
   * @param {string} key - 键名
   * @param {*} data - 数据
   * @returns {boolean} 是否成功
   */
  setStorage(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('保存数据失败:', e);
      return false;
    }
  },

  /**
   * 从本地获取数据
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 数据
   */
  getStorage(key, defaultValue = null) {
    try {
      return wx.getStorageSync(key) || defaultValue;
    } catch (e) {
      console.error('获取数据失败:', e);
      return defaultValue;
    }
  },

  /**
   * 删除本地数据
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  removeStorage(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('删除数据失败:', e);
      return false;
    }
  },

  /**
   * 清除所有本地数据
   * @returns {boolean} 是否成功
   */
  clearStorage() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清除数据失败:', e);
      return false;
    }
  },

  /**
   * 计算钓鱼指数
   * @param {Object} weather - 天气数据
   * @returns {Object} 钓鱼指数
   */
  calculateFishingIndex(weather) {
    let score = 70;
    let level = '良好';
    let tips = '';

    const temp = weather.temperature || 25;
    const pressure = weather.pressure || 1013;
    const humidity = weather.humidity || 65;
    const windSpeed = weather.windSpeed || 3.5;

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

    return {
      score,
      level,
      tips,
      bestTime: '06:00-09:00, 17:00-20:00',
      position: temp >= 25 ? '浅水区、下风口' : '深水区、向阳处',
      targetFish: temp >= 25 ? '草鱼、鲢鳙、鲫鱼' : '鲫鱼、鲤鱼、鳊鱼'
    };
  },

  /**
   * 生成UUID
   * @returns {string} UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * 验证手机号
   * @param {string} phone - 手机号
   * @returns {boolean} 是否有效
   */
  isValidPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  /**
   * 验证邮箱
   * @param {string} email - 邮箱
   * @returns {boolean} 是否有效
   */
  isValidEmail(email) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
  },

  /**
   * 格式化数字（添加千分位）
   * @param {number} num - 数字
   * @returns {string} 格式化后的字符串
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * 保留小数位数
   * @param {number} num - 数字
   * @param {number} digits - 小数位数
   * @returns {number}
   */
  toFixed(num, digits = 2) {
    return parseFloat(num.toFixed(digits));
  },

  /**
   * 获取当前位置
   * @returns {Promise<Object>} 位置信息
   */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            speed: res.speed,
            accuracy: res.accuracy
          });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 选择图片
   * @param {Object} options - 配置选项
   * @returns {Promise<Array>} 图片路径数组
   */
  chooseImage(options = {}) {
    return new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: options.count || 1,
        mediaType: ['image'],
        sourceType: options.sourceType || ['album', 'camera'],
        success: (res) => {
          resolve(res.tempFiles.map(file => file.tempFilePath));
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 预览图片
   * @param {Array<string>} urls - 图片URL数组
   * @param {number} current - 当前显示图片的索引
   */
  previewImage(urls, current = 0) {
    wx.previewImage({
      urls,
      current: urls[current]
    });
  }
};
