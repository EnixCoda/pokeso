"use strict";

angular.module('pokesoApp').controller('MainController', function ($scope, $http, $mdSidenav, localStorageService) {
  window.onload = function () {
    loadController.init($scope);
    if (localStorageService.isSupported) {
      var localMainData = localStorageService.get('mainDataJSON');
      var localLearnSet = localStorageService.get('learnSetJSON');
    } else {
      alert('您的浏览器不支持本地存储数据，可能导致页面加载缓慢！\n' +
        '建议使用Chrome, FireFox, Safari。')
    }
    if (!localStorageService.isSupported
      || !localMainData || !localLearnSet
      || localMainData.updateDate != '20160202') {
      $http({method: 'GET', url: serverAddr + 'data/mainData.json'})
        .then(
          function successCallback (response) {
            mainData = response.data;
            if (localStorageService.isSupported) {
              localStorageService.set('mainDataJSON', mainData);
            }
            loadController.questSucceeded('A');
          },
          function errorCallback () {
            loadController.fail();
          }
        );
      $http({method: 'GET', url: serverAddr + 'data/learnSet.json'})
        .then(
          function successCallback (response) {
            learnSet = response.data;
            if (localStorageService.isSupported) {
              localStorageService.set('learnSetJSON', learnSet);
            }
            loadController.questSucceeded('B');
          },
          function errorCallback () {
            loadController.fail();
          }
        );
    } else {
      mainData = localMainData;
      loadController.questSucceeded('A');
      learnSet = localLearnSet;
      loadController.questSucceeded('B');
    }
  };

  $scope.apng = {load: !isMobile()};

  $scope.MainFunctions = [
    {
      name:         '欢迎来到口袋搜',
      link:         '#/about',
      description:  ['想成为口袋妖怪大师吗？', '也许这里能帮你', ''],
      constructing: false,
      enterable:    true
    },
    {
      name:         '简易图鉴',
      link:         '#/skim',
      description:  ['随便点点', '随便看看'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '技能筛选',
      link:         '#/moves',
      description:  ['最强的技能，最猛的PM', '挑选掌握强力技能的PM'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '战队编辑',
      link:         '#/team_builder',
      description:  ['打造你的冠军梦之队', '并与他人分享'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '个体值计算',
      link:         '#/IV_calculator',
      description:  ['该功能来自Arty2/ivcalc@GitHub, 由wiki.52poke.com汉化'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '伤害计算',
      link:         '#/damage_calculator',
      description:  ['该功能来自pokemon showdown'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '种族值对比',
      link:         '#/base_stats',
      description:  ['详细的种族值对比', '最直观的图形化种族值对比'],
      constructing: false,
      enterable:    true
    },
    {
      name:         '模拟对战',
      link:         '#/battle_emulate',
      description:  ['自由设置PM与道具', '战前热身，百战不殆'],
      constructing: true,
      enterable:    true
    },
    {
      name:         '下一个功能',
      link:         '#/suggestion',
      description:  ['正(hai)在(mei)策(xiang)划(hao)', '说说你喜欢的和你不喜欢的', '顺便说说你想要的功能'],
      constructing: false,
      enterable:    true
    }
  ];

  $scope.typeColors = typeColors;

  (function setBalls () {
    function ballDuplicate (ball, index) {
      for (var i = 0; i < $scope.MainFunctions.length; i++) {
        if ($scope.MainFunctions[i].ball && $scope.MainFunctions[i].ball == ball && i != index) {
          return true;
        }
      }
      return false;
    }

    var ball;
    for (var i = 0; i < $scope.MainFunctions.length; i++) {
      ball = Math.ceil(Math.random() * 26);//1~26
      while (ballDuplicate(ball, i)) {
        ball = Math.ceil(Math.random() * 26);//1~26
      }
      $scope.MainFunctions[i].ball = ball;
    }
  })();

  (function getHomeApngUrls () {
    var amount = $scope.MainFunctions.length;
    for (var i = 0; i < amount; i++) {
      $scope.MainFunctions[i].apng = storageAddr + ("000" + Math.ceil(Math.random() * 721)).substr(-3) + ".png";
    }
    animateAPNG();
  })();

  $scope.toggleAnimation = function () {
    APNG.ifNeeded().then(function () {
      var images = document.querySelectorAll(".apng-image");
      for (var i = 0; i < images.length; i++) {
        if ($scope.apng.load) {
          APNG.animateImage(images[i]);
        } else {
          APNG.releaseCanvas(images[i]);
        }
      }
    });
  };

  $scope.closeSideNav = function () {
    $mdSidenav('leftSideNav').close();
  };

  $scope.openSideNav = function () {
    $mdSidenav('leftSideNav').open();
    $scope.userHideSideNav = false;
  };
});