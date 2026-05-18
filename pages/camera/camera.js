Page({
  data: {
    devicePosition: 'back',
    flash: 'off',
    zoom: 1,
    maxZoom: 10,
    showGrid: true,
    
    // 标记位置
    markerX: 187.5,
    markerY: 250,
    isDragging: false,
    
    // 识别状态
    isRecognizing: false,
    confidence: 0,
    
    // 识别结果
    recognitionResult: null,
    recognitionTime: '',
    
    // 触摸记录
    touchStartX: 0,
    touchStartY: 0,
    markerStartX: 0,
    markerStartY: 0,
    
    // 识别定时器
    recognitionTimer: null,
    frameCount: 0
  },

  onLoad() {
    // 获取系统信息计算标记初始位置
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;
    
    this.setData({
      markerX: screenWidth / 2,
      markerY: screenHeight * 0.25,
      maxZoom: systemInfo.platform === 'ios' ? 10 : 5
    });

    // 检查相机权限
    this.checkCameraAuth();
  },

  onUnload() {
    this.stopRecognition();
  },

  // 检查相机权限
  checkCameraAuth() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              console.log('相机授权成功');
            },
            fail: () => {
              wx.showModal({
                title: '需要相机权限',
                content: '请在设置中开启相机权限以使用AI识别功能',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        }
      }
    });
  },

  // 相机初始化完成
  onCameraInit() {
    console.log('相机初始化完成');
    wx.showToast({
      title: '相机就绪',
      icon: 'success',
      duration: 1000
    });
  },

  // 相机错误
  onCameraError(e) {
    console.error('相机错误:', e.detail);
    wx.showToast({
      title: '相机出错: ' + e.detail.errMsg,
      icon: 'none',
      duration: 2000
    });
  },

  // 相机关闭
  onCameraStop() {
    console.log('相机关闭');
    this.stopRecognition();
  },

  // 切换闪光灯
  toggleFlash() {
    const flashModes = ['off', 'on', 'auto', 'torch'];
    const currentIndex = flashModes.indexOf(this.data.flash);
    const nextIndex = (currentIndex + 1) % flashModes.length;
    
    this.setData({
      flash: flashModes[nextIndex]
    });
    
    wx.showToast({
      title: flashModes[nextIndex] === 'off' ? '闪光灯关闭' : 
             flashModes[nextIndex] === 'on' ? '闪光灯开启' :
             flashModes[nextIndex] === 'auto' ? '自动闪光' : '常亮模式',
      icon: 'none',
      duration: 1000
    });
  },

  // 切换前后摄像头
  toggleCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  // 切换网格显示
  toggleGrid() {
    this.setData({
      showGrid: !this.data.showGrid
    });
  },

  // 缩放变化
  onZoomChange(e) {
    this.setData({
      zoom: e.detail.value
    });
  },

  // 标记触摸开始
  onMarkerTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      isDragging: true,
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      markerStartX: this.data.markerX,
      markerStartY: this.data.markerY
    });
  },

  // 标记触摸移动
  onMarkerTouchMove(e) {
    if (!this.data.isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.touchStartX;
    const deltaY = touch.clientY - this.data.touchStartY;
    
    // 获取相机区域尺寸
    const query = wx.createSelectorQuery();
    query.select('.camera-wrapper').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const rect = res[0];
        let newX = this.data.markerStartX + deltaX;
        let newY = this.data.markerStartY + deltaY;
        
        // 限制在相机区域内
        newX = Math.max(60, Math.min(rect.width - 60, newX));
        newY = Math.max(60, Math.min(rect.height - 60, newY));
        
        this.setData({
          markerX: newX,
          markerY: newY
        });
      }
    });
  },

  // 标记触摸结束
  onMarkerTouchEnd() {
    this.setData({
      isDragging: false
    });
  },

  // 重置标记位置
  resetMarker() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      markerX: systemInfo.windowWidth / 2,
      markerY: systemInfo.windowHeight * 0.25,
      zoom: 1
    });
    wx.showToast({
      title: '标记已重置',
      icon: 'success'
    });
  },

  // 切换识别状态
  toggleRecognition() {
    if (this.data.isRecognizing) {
      this.stopRecognition();
    } else {
      this.startRecognition();
    }
  },

  // 开始识别
  startRecognition() {
    this.setData({
      isRecognizing: true,
      recognitionResult: null,
      confidence: 0,
      frameCount: 0
    });

    // 模拟识别过程
    this.simulateRecognition();
    
    wx.showToast({
      title: '开始识别',
      icon: 'success'
    });
  },

  // 停止识别
  stopRecognition() {
    if (this.data.recognitionTimer) {
      clearInterval(this.data.recognitionTimer);
    }
    this.setData({
      isRecognizing: false,
      recognitionTimer: null
    });
  },

  // 模拟识别过程（实际项目中应调用AI接口）
  simulateRecognition() {
    const recognitionTypes = [
      { type: 'normal', text: '正常', movement: '静止' },
      { type: 'warning', text: '轻微动作', movement: '微动' },
      { type: 'bite', text: '咬钩！', movement: '下沉' },
      { type: 'bite', text: '咬钩！', movement: '上顶' },
      { type: 'warning', text: '试探', movement: '点动' }
    ];

    this.data.recognitionTimer = setInterval(() => {
      if (!this.data.isRecognizing) return;
      
      this.data.frameCount++;
      
      // 模拟识别结果
      if (this.data.frameCount % 5 === 0) {
        const randomResult = recognitionTypes[Math.floor(Math.random() * recognitionTypes.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        this.setData({
          recognitionResult: randomResult,
          confidence: confidence,
          recognitionTime: this.formatTime(new Date())
        });

        // 如果是咬钩，震动提醒
        if (randomResult.type === 'bite') {
          wx.vibrateShort({ type: 'heavy' });
          wx.showModal({
            title: '有鱼咬钩！',
            content: '检测到浮漂异常动作，建议提竿！',
            showCancel: false,
            confirmText: '知道了'
          });
        }
      }
    }, 500);
  },

  // 拍照
  takePhoto() {
    const cameraContext = wx.createCameraContext();
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempImagePath,
          success: () => {
            wx.showToast({
              title: '照片已保存',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.error('保存照片失败:', err);
            // 如果保存到相册失败，预览图片
            wx.previewImage({
              urls: [res.tempImagePath]
            });
          }
        });
      },
      fail: (err) => {
        console.error('拍照失败:', err);
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        });
      }
    });
  },

  // 格式化时间
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
});
