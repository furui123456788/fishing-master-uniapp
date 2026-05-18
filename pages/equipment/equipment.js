Page({
  data: {
    selectedScene: '',
    selectedFish: '',
    scenes: [
      { id: 'pond', name: '池塘', icon: '🏞️' },
      { id: 'river', name: '河流', icon: '🌊' },
      { id: 'lake', name: '湖泊', icon: '🏖️' },
      { id: 'reservoir', name: '水库', icon: '💧' },
      { id: 'sea', name: '海钓', icon: '🌊' },
      { id: 'night', name: '夜钓', icon: '🌙' }
    ],
    fishTypes: [
      { id: 'crucian', name: '鲫鱼', icon: '🐟' },
      { id: 'carp', name: '鲤鱼', icon: '🐠' },
      { id: 'grasscarp', name: '草鱼', icon: '🐡' },
      { id: 'silvercarp', name: '鲢鳙', icon: '🦈' },
      { id: 'bream', name: '鳊鱼', icon: '🐟' },
      { id: 'catfish', name: '鲶鱼', icon: '🐋' },
      { id: 'blackbass', name: '鲈鱼', icon: '🐟' },
      { id: 'snakehead', name: '黑鱼', icon: '🐍' }
    ],
    recommendation: null
  },

  onLoad() {
    // 默认选择第一个场景和鱼种
    this.setData({
      selectedScene: 'pond',
      selectedFish: 'crucian'
    });
    this.generateRecommendation();
  },

  // 选择场景
  selectScene(e) {
    const scene = e.currentTarget.dataset.scene;
    this.setData({
      selectedScene: scene
    });
    this.generateRecommendation();
  },

  // 选择鱼种
  selectFish(e) {
    const fish = e.currentTarget.dataset.fish;
    this.setData({
      selectedFish: fish
    });
    this.generateRecommendation();
  },

  // 生成装备推荐
  generateRecommendation() {
    const { selectedScene, selectedFish } = this.data;
    
    if (!selectedScene || !selectedFish) {
      return;
    }

    const recommendation = this.getRecommendationData(selectedScene, selectedFish);
    this.setData({
      recommendation
    });
  },

  // 获取推荐数据
  getRecommendationData(scene, fish) {
    // 基础推荐数据
    const baseRecommendations = {
      // 鲫鱼
      crucian: {
        rods: [
          { name: '鲫鱼专用竿', spec: '3.6-4.5米，37调', price: '¥150-300' },
          { name: '综合台钓竿', spec: '4.5米，28调', price: '¥200-500' }
        ],
        lines: [
          { name: '尼龙主线', spec: '1.0-1.5号', price: '¥15-30' },
          { name: '碳素子线', spec: '0.6-0.8号', price: '¥12-25' }
        ],
        hooks: [
          { name: '袖钩', spec: '3-5号', price: '¥8-15' },
          { name: '伊豆钩', spec: '2-4号', price: '¥10-18' }
        ],
        baits: [
          { name: '红虫', spec: '鲜活，中号', price: '¥10-20/盒' },
          { name: '蚯蚓', spec: '大号红蚯蚓', price: '¥5-10/盒' },
          { name: '鲫鱼商品饵', spec: '腥香型', price: '¥15-30/包' }
        ],
        accessories: [
          { name: '浮漂', spec: '长尾细脚，1-3号', price: '¥20-50' },
          { name: '铅皮座', spec: '中号，含铅皮', price: '¥5-10' },
          { name: '八字环', spec: '小号，强力型', price: '¥3-8' }
        ],
        tips: [
          '鲫鱼喜欢在水草边缘、障碍物附近活动，选择钓位时注意这些区域',
          '饵料以腥香为主，可根据水温调整腥香比例',
          '钓鲫鱼以钓底为主，浮漂调钓要灵敏',
          '提竿时机要把握好，浮漂下顿或上顶时及时提竿'
        ]
      },
      // 鲤鱼
      carp: {
        rods: [
          { name: '鲤鱼竿', spec: '4.5-5.4米，28调', price: '¥300-800' },
          { name: '大物竿', spec: '5.4米，19调', price: '¥500-1500' }
        ],
        lines: [
          { name: '尼龙主线', spec: '2.0-3.0号', price: '¥20-40' },
          { name: '大力马子线', spec: '1.0-1.5号', price: '¥25-45' }
        ],
        hooks: [
          { name: '伊势尼', spec: '5-8号', price: '¥12-20' },
          { name: '新关东', spec: '1-3号', price: '¥15-25' }
        ],
        baits: [
          { name: '玉米粒', spec: '嫩玉米或发酵玉米', price: '¥10-15' },
          { name: '红薯饵', spec: '蒸熟红薯加蜂蜜', price: '自制' },
          { name: '鲤鱼商品饵', spec: '谷物香型', price: '¥20-40/包' }
        ],
        accessories: [
          { name: '大物浮漂', spec: '吃铅3-5克', price: '¥30-80' },
          { name: '失手绳', spec: '5-10米', price: '¥15-30' },
          { name: '抄网', spec: '大口径，加深网兜', price: '¥50-150' }
        ],
        tips: [
          '鲤鱼警惕性高，钓点要保持安静，避免大声喧哗',
          '饵料以谷物香、甜香为主，可适当添加蜂蜜或红糖',
          '钓鲤鱼要有耐心，守钓是常用方法',
          '中鱼后要及时牵离钓点，防止惊窝'
        ]
      },
      // 草鱼
      grasscarp: {
        rods: [
          { name: '草鱼竿', spec: '5.4-6.3米，28调', price: '¥400-1000' },
          { name: '综合大物竿', spec: '6.3米，19调', price: '¥800-2000' }
        ],
        lines: [
          { name: '尼龙主线', spec: '3.0-4.0号', price: '¥25-50' },
          { name: '碳素子线', spec: '2.0-3.0号', price: '¥20-40' }
        ],
        hooks: [
          { name: '伊势尼', spec: '7-10号', price: '¥15-25' },
          { name: '千又钩', spec: '2-4号', price: '¥18-30' }
        ],
        baits: [
          { name: '嫩玉米', spec: '新鲜玉米粒', price: '¥5-10' },
          { name: '青草', spec: '韭菜、麦苗等', price: '野外采集' },
          { name: '草鱼商品饵', spec: '草腥香型', price: '¥20-35/包' }
        ],
        accessories: [
          { name: '大浮漂', spec: '吃铅4-6克', price: '¥35-90' },
          { name: '海竿', spec: '配渔轮，远投', price: '¥200-600' },
          { name: '铃铛', spec: '海竿报警用', price: '¥5-15' }
        ],
        tips: [
          '草鱼喜欢在水面或中层活动，可选择浮钓或半水钓',
          '饵料以植物性为主，嫩玉米是首选',
          '发现草鱼在水面游动时，可采用浮钓方式',
          '夏季早晚是钓草鱼的最佳时段'
        ]
      },
      // 鲢鳙
      silvercarp: {
        rods: [
          { name: '鲢鳙竿', spec: '5.4-7.2米，28调', price: '¥500-1200' },
          { name: '远投竿', spec: '配大型渔轮', price: '¥600-1800' }
        ],
        lines: [
          { name: '尼龙主线', spec: '3.0-5.0号', price: '¥30-60' },
          { name: 'PE线', spec: '2.0-3.0号', price: '¥40-80' }
        ],
        hooks: [
          { name: '鲢鳙钩', spec: '专用钩，带弹簧', price: '¥15-30' },
          { name: '爆炸钩', spec: '组钩，6-8号', price: '¥12-25' }
        ],
        baits: [
          { name: '酸酵饵', spec: '发酵酸臭味', price: '¥15-25' },
          { name: '草莓饵', spec: '香甜型', price: '¥20-30' },
          { name: '鲢鳙商品饵', spec: '浮钓专用', price: '¥25-40/包' }
        ],
        accessories: [
          { name: '大肚漂', spec: '远投浮漂', price: '¥20-50' },
          { name: '水怪笼', spec: '装饵料用', price: '¥10-20' },
          { name: '打窝器', spec: '定点打窝', price: '¥15-35' }
        ],
        tips: [
          '鲢鳙是滤食性鱼类，采用浮钓法效果最佳',
          '饵料要求雾化好，味型以酸臭或香甜为主',
          '钓层要根据水温和鱼情灵活调整',
          '发现浮漂有动作不要急于提竿，等黑漂或大幅度下沉再提'
        ]
      },
      // 鳊鱼
      bream: {
        rods: [
          { name: '综合竿', spec: '4.5-5.4米，37调', price: '¥200-600' }
        ],
        lines: [
          { name: '尼龙主线', spec: '1.5-2.0号', price: '¥15-30' },
          { name: '子线', spec: '1.0-1.2号', price: '¥12-25' }
        ],
        hooks: [
          { name: '袖钩', spec: '4-6号', price: '¥8-15' },
          { name: '海夕钩', spec: '2-4号', price: '¥10-18' }
        ],
        baits: [
          { name: '玉米粒', spec: '嫩玉米', price: '¥5-10' },
          { name: '麦粒', spec: '煮熟麦粒', price: '自制' },
          { name: '商品饵', spec: '谷物香型', price: '¥15-30' }
        ],
        accessories: [
          { name: '浮漂', spec: '中长身，2-4号', price: '¥20-50' }
        ],
        tips: [
          '鳊鱼喜欢在中下层活动，可钓离底',
          '饵料以植物性为主，玉米粒效果很好',
          '鳊鱼群居，找到鱼群后往往连竿',
          '提竿要轻，鳊鱼嘴薄，容易脱钩'
        ]
      },
      // 鲶鱼
      catfish: {
        rods: [
          { name: '鲶鱼竿', spec: '2.1-2.7米，硬调', price: '¥300-800' },
          { name: '路亚竿', spec: 'M调，配水滴轮', price: '¥400-1200' }
        ],
        lines: [
          { name: 'PE线', spec: '2.0-4.0号', price: '¥40-80' },
          { name: '碳线', spec: '3.0-5.0号', price: '¥50-100' }
        ],
        hooks: [
          { name: '丸世钩', spec: '8-12号', price: '¥15-25' },
          { name: '路亚钩', spec: '曲柄钩，加强型', price: '¥20-40' }
        ],
        baits: [
          { name: '泥鳅', spec: '活饵，中号', price: '¥15-30' },
          { name: '鸡肝', spec: '新鲜鸡肝', price: '¥5-10' },
          { name: '路亚饵', spec: '软虫、米诺', price: '¥20-60' }
        ],
        accessories: [
          { name: '夜光漂', spec: '夜钓专用', price: '¥25-60' },
          { name: '铃铛', spec: '报警器', price: '¥5-15' },
          { name: '头灯', spec: '夜钓照明', price: '¥30-100' }
        ],
        tips: [
          '鲶鱼是夜行性鱼类，夜钓效果最佳',
          '钓点选择深水区、桥墩下、乱石堆',
          '饵料以腥味为主，活饵效果最好',
          '鲶鱼吃钩猛，提竿要及时有力'
        ]
      },
      // 鲈鱼
      blackbass: {
        rods: [
          { name: '路亚竿', spec: 'ML-M调，1.98-2.4米', price: '¥500-2000' }
        ],
        lines: [
          { name: 'PE线', spec: '1.0-2.0号', price: '¥50-120' },
          { name: '碳线', spec: '2.0-3.0号前导线', price: '¥40-80' }
        ],
        hooks: [
          { name: '曲柄钩', spec: '2-4号', price: '¥15-30' },
          { name: '三本钩', spec: '配硬饵用', price: '¥10-25' }
        ],
        baits: [
          { name: '软虫', spec: 'T尾、卷尾', price: '¥20-50' },
          { name: '米诺', spec: '浮水、沉水', price: '¥30-80' },
          { name: 'VIB', spec: '全泳层', price: '¥25-60' },
          { name: '铅笔', spec: '水面系', price: '¥35-90' }
        ],
        accessories: [
          { name: '路亚钳', spec: '取钩用', price: '¥30-80' },
          { name: '控鱼器', spec: '控鱼、取钩', price: '¥50-150' },
          { name: '假饵盒', spec: '收纳用', price: '¥25-60' }
        ],
        tips: [
          '鲈鱼是掠食性鱼类，路亚钓法效果最佳',
          '选择有结构的地方，如石头、水草、倒树等',
          '根据水层选择不同泳层的假饵',
          '操控假饵要模拟小鱼逃窜的动作'
        ]
      },
      // 黑鱼
      snakehead: {
        rods: [
          { name: '雷强竿', spec: 'H调，2.1-2.4米', price: '¥400-1500' }
        ],
        lines: [
          { name: 'PE线', spec: '3.0-6.0号', price: '¥60-150' },
          { name: '编织线', spec: '4-8号', price: '¥80-200' }
        ],
        hooks: [
          { name: '雷蛙钩', spec: '配雷蛙用', price: '¥20-40' },
          { name: '曲柄钩', spec: '配软虫用', price: '¥15-30' }
        ],
        baits: [
          { name: '雷蛙', spec: '大小号各备', price: '¥25-60' },
          { name: '软虫', spec: 'T尾、卷尾', price: '¥20-50' },
          { name: '小鱼', spec: '活饵', price: '¥10-20' }
        ],
        accessories: [
          { name: '雷蛙盒', spec: '收纳雷蛙', price: '¥20-50' },
          { name: '路亚钳', spec: '取钩必备', price: '¥40-100' },
          { name: '手套', spec: '防咬伤', price: '¥20-50' }
        ],
        tips: [
          '黑鱼攻击性强，雷强钓法是首选',
          '选择水草密集区、浮萍区等障碍物多的水域',
          '雷蛙要抛到草洞或草边，慢慢拖入水中',
          '中鱼后要快速将鱼拉出水面，防止钻草'
        ]
      }
    };

    // 场景调整
    const sceneAdjustments = {
      pond: { rodLength: '3.6-4.5米', note: '池塘钓' },
      river: { rodLength: '4.5-5.4米', note: '河流钓' },
      lake: { rodLength: '5.4-6.3米', note: '湖泊钓' },
      reservoir: { rodLength: '5.4-7.2米', note: '水库钓' },
      sea: { rodLength: '2.7-3.6米', note: '海钓' },
      night: { rodLength: '4.5-5.4米', note: '夜钓' }
    };

    const baseRec = baseRecommendations[fish] || baseRecommendations.crucian;
    const adjustment = sceneAdjustments[scene] || sceneAdjustments.pond;

    // 根据场景调整推荐
    const recommendation = {
      ...baseRec,
      rods: baseRec.rods.map(rod => ({
        ...rod,
        spec: rod.spec.replace(/\d+\.\d+-\d+\.\d+米/, adjustment.rodLength),
        name: rod.name + `(${adjustment.note})`
      }))
    };

    return recommendation;
  }
});
