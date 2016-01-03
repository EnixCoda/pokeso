"use strict";
/*global
animate, APNG
*/
/**
 * @ngdoc function
 * @name pokesoApp.controller: MainController
 * @description
 * # MainCtroller
 * Controller of the pokesoApp
 */

angular.module('pokesoApp').controller('MainController', function ($scope, $http) {
  $scope.storageAddr = '//poke.so/storage/';
  $scope.serverAddr = '//poke.so/server/'

  $scope.MainFunctions = [
    {
      name: '欢迎来到口袋搜',
      link: '#/about',
      description: ['想成为口袋妖怪大师吗？', '也许这里能帮你', ''],
      constructing: false,
      enterable: true
    },
    {
      name: '简易图鉴',
      link: '#/skim',
      description: ['随便点点','随便看看'],
      constructing: false,
      enterable: true
    },
    {
      name: '技能筛选',
      link: '#/moves',
      description: ['最强的技能，最猛的PM', '挑选掌握强力技能的PM'],
      constructing: false,
      enterable: true
    },
    {
      name: '战队编辑',
      link: '#/team_builder',
      description: ['打造你的冠军梦之队', '并与他人分享'],
      constructing: false,
      enterable: true
    },
    {
      name: '个体值计算',
      link: '#/IV_calculator',
      description: ['该功能来自Arty2/ivcalc@GitHub, 由wiki.52poke.com汉化'],
      constructing: false,
      enterable: true
    },
    {
      name: '伤害计算',
      link: '#/damage_calculator',
      description: ['该功能来自pokemon showdown'],
      constructing: false,
      enterable: true
    },
    {
      name: '种族值对比',
      link: '#/base_stats',
      description: ['详细的种族值对比', '最直观的图形化种族值对比'],
      constructing: false,
      enterable: true
    },
    {
      name: '模拟对战',
      link: '#/battle_emulate',
      description: ['自由设置PM与道具', '战前热身，百战不殆'],
      constructing: true,
      enterable: true
    },
    {
      name: '下一个功能',
      link: '#/suggestion',
      description: ['正(hai)在(mei)策(xiang)划(hao)', '说说你喜欢的和你不喜欢的', '顺便说说你想要的功能'],
      constructing: false,
      enterable: true
    }
  ];

  $scope.stats_names = ['HP', '攻击', '防御', '特攻', '特防', '速度'];

  $scope.types = ('任意 普通 格斗 飞行 毒 地面 岩石 虫 幽灵 钢 火 水 草 电 超能力 冰 龙 恶 妖精').split(' ')
    .map(function (cur, index) {
      return {
        id: index,
        name: cur
      };
    });

  $scope.kinds = ('任意 物理 特殊 变化').split(' ')
    .map(function (cur, index) {
      return {
        id: index,
        name: cur
      };
    });

  $scope.abilities = ('任意 恶臭 毛毛雨 加速 甲虫盔甲 结实 湿气 柔软 沙里隐身 静电 蓄电 储水 迟钝 乐天 复眼 失眠 变色 免疫 延烧 鳞粉 我行我素 吸盘 威吓 影子游戏 蛇皮 奇异守护 漂浮 孢子 同步 透明体 自然恢复 避雷针 天恩 轻快 叶绿素 发光 追踪 大力士 毒刺 精神力 岩浆防护 水幕 磁力 隔音 雨盘 沙流 气压 肥脂 早起 火焰体 逃走 锐利目光 怪力剪刀 捡拾 懒惰 活力 迷人身躯 阳性 阴性 天气预报 黏着 脱皮 毅力 神奇鱗片 黏液 新绿 猛火 激流 预感 石头 旱灾 狮蚁 元气 白色烟雾 瑜珈神力 贝壳盔甲 气闸 蹒跚 电气引擎 斗争心 不屈之心 雪里隐身 贪吃鬼 愤怒穴道 杂技 耐热 单纯 干燥皮肤 下载 铁拳 毒疗 适应力 连续攻击 湿润身体 太阳能量 飞毛腿 一般皮肤 狙击手 魔法防御 无防御 慢出 技术员 叶片防御 笨拙 革新 强运 引爆 预知危险 预知梦 后知后觉 有色眼镜 过滤 错失先机 胆量 引水 冰冻身体 坚石 降雪 采蜜 看穿 舍身 多元系 花之礼 惡夢 偷盗恶习 全力攻击 性情乖僻 紧张感 不服输 软弱 诅咒身体 治愈之心 同伴守护 碎甲 重合金 轻合金 多重鳞片 毒暴走 热暴走 收获 超感知 心智不定 防尘 毒手 再生力 鸽胸 挖沙 奇迹皮肤 分析 幻觉 替代品 穿透 木乃伊 自信过剩 正义之心 颤抖 魔法反射 草食 恶作剧之心 砂之力 铁刺荆棘 不倒翁模式 胜利之星 涡轮高温 兆级电压 芳香之幕 花幕 頰囊 变幻自在 毛皮外衣 术士 防弹 好胜 下顎結實 冰凍皮膚 甜幕 对战切换 疾风之翼 超級發射器 草之毛皮 共生 坚硬爪子 妖精皮肤 滑溜溜 天空皮膚 亲子爱 黑暗气氛 妖精气氛 气氛破坏 起始之海 终结大地 变化气流').split(' ')
    .map(function (cur, index) {
      return {
        id: index,
        name: cur
      };
    });

  $scope.natures = [
    {
      name: '努力',
      value: [ 1,     1,     1,     1,     1,     1],
    },
    {
      name: '孤独',
      value: [ 1,   1.1,   0.9,     1,     1,     1],
    },
    {
      name: '勇敢',
      value: [ 1,   1.1,     1,     1,     1,   0.9],
    },
    {
      name: '固执',
      value: [ 1,   1.1,     1,   0.9,     1,     1],
    },
    {
      name: '调皮',
      value: [ 1,   1.1,     1,     1,   0.9,     1],
    },
    {
      name: '大胆',
      value: [ 1,     1,   1.1,     1,     1,     1],
    },
    {
      name: '直率',
      value: [ 1,     1,     1,     1,     1,     1],
    },
    {
      name: '悠闲',
      value: [ 1,     1,   1.1,     1,     1,   0.9],
    },
    {
      name: '淘气',
      value: [ 1,     1,   1.1,   0.9,     1,     1],
    },
    {
      name: '乐天',
      value: [ 1,     1,   1.1,     1,   0.9,     1],
    },
    {
      name: '胆小',
      value: [ 1,   0.9,     1,     1,     1,   1.1],
    },
    {
      name: '急躁',
      value: [ 1,     1,   0.9,     1,     1,   1.1],
    },
    {
      name: '认真',
      value: [ 1,     1,     1,     1,     1,     1],
    },
    {
      name: '开朗',
      value: [ 1,     1,     1,   0.9,     1,   1.1],
    },
    {
      name: '天真',
      value: [ 1,     1,     1,     1,   0.9,   1.1],
    },
    {
      name: '保守',
      value: [ 1,   0.9,     1,   1.1,     1,     1],
    },
    {
      name: '稳重',
      value: [ 1,     1,   0.9,   1.1,     1,     1],
    },
    {
      name: '冷静',
      value: [ 1,     1,     1,   1.1,     1,   0.9],
    },
    {
      name: '害羞',
      value: [ 1,     1,     1,     1,     1,     1],
    },
    {
      name: '马虎',
      value: [ 1,     1,     1,   1.1,   0.9,     1],
    },
    {
      name: '沉着',
      value: [ 1,   0.9,     1,     1,   1.1,     1],
    },
    {
      name: '温顺',
      value: [ 1,     1,   0.9,     1,   1.1,     1],
    },
    {
      name: '狂妄',
      value: [ 1,     1,     1,     2,   1.1,   0.9],
    },
    {
      name: '慎重',
      value: [ 1,     1,     1,   0.9,   1.1,     1],
    },
    {
      name: '浮躁',
      value: [ 1,     1,     1,     1,     1,     1],
    },
  ];

  $scope.type_background_colors = ('#ffffff #a8a878 #c03028 #a890f0 #a040a0 #e0c068 #b8a038 #a8b820 #705898 #b8b8d0 #f08030 #6890f0 #78c850 #f8d030 #f85888 #98d8d8 #7038f8 #705848 #ee99ac').split(' ')
    .map(function (cur) {
      return {
        'background-color': cur
      };
    });

  function ball_duplicate (ball, index) {
    var f;
    for (f in $scope.MainFunctions) {
      if ($scope.MainFunctions[f].ball != null && $scope.MainFunctions[f].ball == ball && f != index) {
        return true;
      }
    }
    return false;
  }
  function set_balls() {
    var i, ball;
    for (i = 0; i < $scope.MainFunctions.length; i++) {
      ball = Math.ceil(Math.random() * 26);//1~26
      while (ball_duplicate(ball, i)) {
        ball = Math.ceil(Math.random() * 26);//1~26
      }
      $scope.MainFunctions[i].ball = ball;
    }
  }
  set_balls();
  function isMobile() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    var isiPhone = u.indexOf('iPhone') > -1;
    if (isiPhone || isAndroid) {
      return true;
    }
    return false;
  }
  $scope.apng = {load: true};
  if (isMobile()) {
    $scope.apng.load = false;
  }
  function get_home_apng_urls() {
    $http.post($scope.serverAddr + '/get_random_apng_urls.php', {amount: $scope.MainFunctions.length})
      .then(function (response) {
        var i;
        for (i in $scope.MainFunctions) {
          $scope.MainFunctions[i].apng = response.data[i];
        }
        animate();
      });
  }
  get_home_apng_urls();

  $scope.toggle_animation = function () {
    APNG.ifNeeded().then(function () {
      var images = document.querySelectorAll(".apng-image");
      var i;
      for (i = 0; i < images.length; i++) {
        if ($scope.apng.load) {
          APNG.animateImage(images[i]);
        } else {
          APNG.releaseCanvas(images[i]);
          $('.apng-image').remove();
        }
      }
    });
  };

  $scope.move_colors = ['#a8a878', 'c03028', 'a890f0', 'a040a0', 'e0c068', 'b8a038', 'a8b820', '705898', 'b8b8d0', 'f08030', '6890f0', '78c850', 'f8d030', 'f85888', '98d8d8', '7038f8', '705848', 'ee99ac'];

  $scope.pokemons = [];
  $http.post($scope.serverAddr + '/get_all_poke.php')
    .then(function (response) {
      $scope.pokemons = response.data;
    }, function () {
      alert('加载PM列表失败!请尝试刷新!');
    });

  $scope.colors = ['#4caf50', '#ffc10d', '#f44336', '#9c27b0', '#2196f3', '#888888'];

  $scope.draw_canvas = function(elementId, data, max) {
    var i, x, y, v;
    var t = 0.017453293;

    var new_canvas = document.getElementById(elementId);
    new_canvas.width = 512;
    new_canvas.height = 512;
    var new_canvas_context = new_canvas.getContext('2d');
    new_canvas_context.globalAlpha = 0.5;
    new_canvas.fillStyle = '#aaaaaa';

    var width = new_canvas.width * 88 / 100;
    //cross lines
    new_canvas_context.beginPath();
    for (i = 0; i < 3; i++) {
      x = Math.cos((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
      y = Math.sin((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
      new_canvas_context.moveTo(x, y);
      new_canvas_context.lineTo(new_canvas.width - x, new_canvas.width - y);
    }
    new_canvas_context.stroke();

    //out circle
    new_canvas_context.beginPath();
    new_canvas_context.arc(new_canvas.width / 2, new_canvas.width / 2, width / 2, 0, 2 * Math.PI);
    new_canvas_context.stroke();

    //pokemon stats
    var index;
    var base_stats;
    var positions;
    var value;
    for (index in data) {
      new_canvas_context.fillStyle = $scope.colors[index];
      base_stats = data[index].base_stats;
      positions = [];
      i = 0;
      for (value in base_stats) {
        v = parseInt(base_stats[value], 10);
        x = v / max * Math.cos((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
        y = v / max * Math.sin((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
        positions.push({x: x, y: y});
        i++;
      }
      new_canvas_context.beginPath();
      new_canvas_context.moveTo(positions[0].x, positions[0].y);
      for (i = 1; i <= 6; i++) {
        new_canvas_context.lineTo(positions[i % 6].x, positions[i % 6].y);
      }
      new_canvas_context.fill();
    }

    //write stat names
    var name;
    new_canvas_context.fillStyle = "#000000";
    new_canvas_context.font = '1.5em 黑体';
    for (i = 0; i < $scope.stats_names.length; i++) {
      name = $scope.stats_names[i];
      x = Math.cos((-90 + i * 60) * t) * (width * (1.06 + 0.03)) / 2 + new_canvas.width / 2;
      y = Math.sin((-90 + i * 60) * t) * (width * (1.06 + 0.03)) / 2 + new_canvas.width / 2;
      x -= new_canvas_context.measureText(name).width / 2;
      y += 5;
      new_canvas_context.fillText(name, x, y);
    }

    //ruler
    new_canvas_context.globalAlpha = 0.8;
    new_canvas_context.fillStyle = "#ffffff";
    var r = 30;
    new_canvas_context.fillText('0', new_canvas.width / 2, new_canvas.width / 2 + width / 25);

    //inner circles
    while (r < max) {
      for (i = 0; i < 6; i++) {
        new_canvas_context.beginPath();
        new_canvas_context.arc(new_canvas.width / 2, new_canvas.width / 2, width / 2 * r / max, (i * 60 - 30) * t - 0.03, (i * 60 - 30) * t + 0.03);
        new_canvas_context.stroke();
      }
      new_canvas_context.fillText(r.toString(), width / 2 * r / max * Math.cos(-Math.PI / 6) + new_canvas.width / 2, width / 2 * r / max * Math.sin(-Math.PI / 6) + new_canvas.width / 2 + width / 25);
      r += 30;
    }
  }

  $scope.start_gen = [0, 1, 152, 252, 387, 494, 650, 721];
  $scope.generation = 0;
  $scope.generations = ('全部 第一世代 第二世代 第三世代 第四世代 第五世代 第六世代').split(' ')
    .map(function (cur, index) {
      return {
        index: index,
        name: cur
      };
    });
  $scope.generation_index = [[], [], [], [], [], [], [], []];//[1~721], [1~151], [152~251], ...
  function generate_generations () {
    var i, j;
    for (i = 1; i < 721; i++) {
      $scope.generation_index[0].push(i);
    }
    for (i = 1; i < $scope.start_gen.length - 1; i++) {
      for (j = $scope.start_gen[i]; j < $scope.start_gen[i + 1]; j++) {
        $scope.generation_index[i].push(j);
      }
    }
  }
  generate_generations();
});