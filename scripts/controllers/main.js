"use strict";

angular.module('pokesoApp').controller('MainController', function ($scope, $http) {
  loadController.init($scope);
  $http({method: 'GET', url: serverAddr + 'data/mainData.json'})
    .then(
      function successCallback(response) {
        mainData = response.data;
        loadController.questSucceeded('A');
      },
      function errorCallback(response) {
        loadController.fail();
      }
    );
  $http({method: 'GET', url: serverAddr + 'data/learnSet.json'})
    .then(
      function successCallback(response) {
        learnSet = response.data;
        loadController.questSucceeded('B');
      },
      function errorCallback(response) {
        loadController.fail();
      }
    );
  $http({method: 'GET', url: serverAddr + 'data/otherData.json'})
    .then(
      function successCallback (response) {
        otherData = response.data;
        loadController.questSucceeded('C');
      },
      function errorCallback (response) {
        loadController.fail();
      }
    );

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
  $scope.type_background_colors = ('#ffffff #a8a878 #c03028 #a890f0 #a040a0 #e0c068 #b8a038 #a8b820 #705898 #b8b8d0 #f08030 #6890f0 #78c850 #f8d030 #f85888 #98d8d8 #7038f8 #705848 #ee99ac').split(' ')
    .map(function (cur) {
      return {
        'background-color': cur
      };
    });
  $scope.move_colors = ('#a8a878 c03028 a890f0 a040a0 e0c068 b8a038 a8b820 705898 b8b8d0 f08030 6890f0 78c850 f8d030 f85888 98d8d8 7038f8 705848 ee99ac').split(' ');

  (function set_balls() {
    function ball_duplicate (ball, index) {
      for (var i = 0; i < $scope.MainFunctions.length; i++) {
        if ($scope.MainFunctions[i].ball != null && $scope.MainFunctions[i].ball == ball && i != index) {
          return true;
        }
      }
      return false;
    }
    var ball;
    for (var i = 0; i < $scope.MainFunctions.length; i++) {
      ball = Math.ceil(Math.random() * 26);//1~26
      while (ball_duplicate(ball, i)) {
        ball = Math.ceil(Math.random() * 26);//1~26
      }
      $scope.MainFunctions[i].ball = ball;
    }
  })();

  $scope.apng = {load: true};
  $scope.apng.load = !isMobile();

  (function get_home_apng_urls() {
      var amount = $scope.MainFunctions.length;
      for (var i = 0; i < amount; i++) {
        $scope.MainFunctions[i].apng = storageAddr + ("000" + Math.ceil(Math.random() * 721)).substr(-3) + ".png";
      }
      animate();
  })();

  $scope.toggle_animation = function () {
    APNG.ifNeeded().then(function () {
      var images = document.querySelectorAll(".apng-image");
      for (var i = 0; i < images.length; i++) {
        if ($scope.apng.load) {
          APNG.animateImage(images[i]);
        } else {
          APNG.releaseCanvas(images[i]);
          $('.apng-image').remove();
        }
      }
    });
  };

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
  (function generate_generations () {
    for (var i = 1; i < 721; i++) {
      $scope.generation_index[0].push(i);
    }
    for (var i = 1; i < $scope.start_gen.length - 1; i++) {
      for (var j = $scope.start_gen[i]; j < $scope.start_gen[i + 1]; j++) {
        $scope.generation_index[i].push(j);
      }
    }
  })();

});