const app = getApp();

Page({
  data: {
    records: [],
    stats: {
      totalCount: 0,
      totalWeight: '0.00',
      totalFish: 0,
      bestWeight: '0.00'
    },
    showModal: false,
    isEditing: false,
    editingId: null,
    formData: {
      date: '',
      time: '',
      location: '',
      weather: '晴',
      fishList: [{ name: '', count: '', weight: '' }],
      note: ''
    },
    weatherOptions: ['晴', '多云', '阴', '小雨', '大雨', '风'],
    dateRange: [],
    dateIndex: [0, 0, 0, 0, 0]
  },

  onLoad() {
    this.initDateRange();
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  onPullDownRefresh() {
    this.loadRecords();
    wx.stopPullDownRefresh();
  },

  // 初始化日期选择器数据
  initDateRange() {
    const years = [];
    const months = [];
    const days = [];
    const hours = [];
    const minutes = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    // 年份（前后5年）
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i + '年');
    }

    // 月份
    for (let i = 1; i <= 12; i++) {
      months.push(i + '月');
    }

    // 日期
    for (let i = 1; i <= 31; i++) {
      days.push(i + '日');
    }

    // 小时
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0') + '时');
    }

    // 分钟
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i.toString().padStart(2, '0') + '分');
    }

    this.setData({
      dateRange: [years, months, days, hours, minutes]
    });

    // 设置默认日期时间
    this.setDefaultDateTime();
  },

  // 设置默认日期时间
  setDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = Math.floor(now.getMinutes() / 5) * 5;

    this.setData({
      'formData.date': `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      'formData.time': `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      dateIndex: [5, month - 1, day - 1, hour, minute / 5]
    });
  },

  // 加载记录
  loadRecords() {
    try {
      const records = wx.getStorageSync('fishing_records') || [];
      const formattedRecords = this.formatRecords(records);
      const stats = this.calculateStats(records);

      this.setData({
        records: formattedRecords,
        stats: stats
      });
    } catch (e) {
      console.error('加载记录失败:', e);
    }
  },

  // 格式化记录数据
  formatRecords(records) {
    return records.map(record => {
      const date = new Date(record.createTime);
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // 计算总重量
      let totalWeight = 0;
      let totalCount = 0;
      if (record.fishList && record.fishList.length > 0) {
        record.fishList.forEach(fish => {
          totalCount += parseInt(fish.count) || 0;
          totalWeight += parseFloat(fish.weight) || 0;
        });
      }

      return {
        ...record,
        month: month,
        day: day,
        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        totalWeight: totalWeight > 0 ? totalWeight.toFixed(2) : '',
        totalCount: totalCount
      };
    });
  },

  // 计算统计数据
  calculateStats(records) {
    let totalCount = records.length;
    let totalWeight = 0;
    let totalFish = 0;
    let bestWeight = 0;

    records.forEach(record => {
      if (record.fishList && record.fishList.length > 0) {
        record.fishList.forEach(fish => {
          const count = parseInt(fish.count) || 0;
          const weight = parseFloat(fish.weight) || 0;

          totalFish += count;
          totalWeight += weight;

          if (weight > bestWeight) {
            bestWeight = weight;
          }
        });
      }
    });

    return {
      totalCount: totalCount,
      totalWeight: totalWeight.toFixed(2),
      totalFish: totalFish,
      bestWeight: bestWeight.toFixed(2)
    };
  },

  // 显示添加弹窗
  showAddModal() {
    this.setDefaultDateTime();
    this.setData({
      showModal: true,
      isEditing: false,
      editingId: null,
      'formData.location': '',
      'formData.weather': '晴',
      'formData.fishList': [{ name: '', count: '', weight: '' }],
      'formData.note': ''
    });
  },

  // 隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false
    });
  },

  // 阻止冒泡
  preventBubble() {
    // 阻止事件冒泡
  },

  // 日期选择变化
  onDateChange(e) {
    const value = e.detail.value;
    const year = this.data.dateRange[0][value[0]].replace('年', '');
    const month = this.data.dateRange[1][value[1]].replace('月', '').padStart(2, '0');
    const day = this.data.dateRange[2][value[2]].replace('日', '').padStart(2, '0');
    const hour = this.data.dateRange[3][value[3]].replace('时', '');
    const minute = this.data.dateRange[4][value[4]].replace('分', '');

    this.setData({
      'formData.date': `${year}-${month}-${day}`,
      'formData.time': `${hour}:${minute}`,
      dateIndex: value
    });
  },

  // 钓点输入
  onLocationInput(e) {
    this.setData({
      'formData.location': e.detail.value
    });
  },

  // 选择天气
  selectWeather(e) {
    this.setData({
      'formData.weather': e.currentTarget.dataset.weather
    });
  },

  // 添加鱼种
  addFish() {
    const fishList = this.data.formData.fishList;
    fishList.push({ name: '', count: '', weight: '' });
    this.setData({
      'formData.fishList': fishList
    });
  },

  // 删除鱼种
  removeFish(e) {
    const index = e.currentTarget.dataset.index;
    const fishList = this.data.formData.fishList;
    fishList.splice(index, 1);
    this.setData({
      'formData.fishList': fishList.length > 0 ? fishList : [{ name: '', count: '', weight: '' }]
    });
  },

  // 鱼种输入
  onFishInput(e) {
    const index = e.currentTarget.dataset.index;
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const key = `formData.fishList[${index}].${field}`;

    this.setData({
      [key]: value
    });
  },

  // 备注输入
  onNoteInput(e) {
    this.setData({
      'formData.note': e.detail.value
    });
  },

  // 保存记录
  saveRecord() {
    const formData = this.data.formData;

    // 验证数据
    if (!formData.location.trim()) {
      wx.showToast({
        title: '请输入钓点位置',
        icon: 'none'
      });
      return;
    }

    // 验证渔获信息
    const validFishList = formData.fishList.filter(fish => fish.name.trim() !== '');
    if (validFishList.length === 0) {
      wx.showToast({
        title: '请至少添加一种鱼',
        icon: 'none'
      });
      return;
    }

    const record = {
      date: formData.date,
      time: formData.time,
      location: formData.location,
      weather: formData.weather,
      fishList: validFishList,
      note: formData.note,
      createTime: new Date().toISOString()
    };

    try {
      let records = wx.getStorageSync('fishing_records') || [];

      if (this.data.isEditing) {
        // 编辑模式
        const index = records.findIndex(r => r.id === this.data.editingId);
        if (index !== -1) {
          records[index] = { ...records[index], ...record };
        }
      } else {
        // 新增模式
        record.id = Date.now();
        records.unshift(record);
      }

      wx.setStorageSync('fishing_records', records);

      wx.showToast({
        title: this.data.isEditing ? '修改成功' : '添加成功',
        icon: 'success'
      });

      this.hideModal();
      this.loadRecords();
    } catch (e) {
      console.error('保存记录失败:', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // 编辑记录
  editRecord(e) {
    const id = e.currentTarget.dataset.id;
    const records = wx.getStorageSync('fishing_records') || [];
    const record = records.find(r => r.id === id);

    if (record) {
      this.setData({
        showModal: true,
        isEditing: true,
        editingId: id,
        'formData.date': record.date,
        'formData.time': record.time,
        'formData.location': record.location,
        'formData.weather': record.weather,
        'formData.fishList': record.fishList.length > 0 ? record.fishList : [{ name: '', count: '', weight: '' }],
        'formData.note': record.note || ''
      });
    }
  },

  // 删除记录
  deleteRecord(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmColor: '#da3633',
      success: (res) => {
        if (res.confirm) {
          try {
            let records = wx.getStorageSync('fishing_records') || [];
            records = records.filter(r => r.id !== id);
            wx.setStorageSync('fishing_records', records);

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });

            this.loadRecords();
          } catch (e) {
            console.error('删除记录失败:', e);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
