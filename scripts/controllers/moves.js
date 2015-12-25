"use strict";
/**
 * @ngdoc function
 * @name pokesoApp.controller: MovesController
 * @description
 * # MovesController
 * Controller of the pokesoApp
 */
angular.module('pokesoApp').controller('MovesController', function ($scope, $http, $mdDialog) {

  $scope.selected_type_id = 0;
  $scope.selected_kind_id = 0;
  $scope.is_100percent_kill = false;
  $scope.power_max = 250;
  $scope.power_min = 0;
  $scope.is_100percent_accurate = false;
  $scope.accuracy_max = 100;
  $scope.accuracy_min = 0;
  $scope.pp_max = 50;
  $scope.pp_min = 0;

  $scope.search_result_moves = [];
  $scope.selected_moves = [];

  $scope.searching_poke = false;
  $scope.define_poke_type = false;
  $scope.selected_poke_type1 = 0;
  $scope.selected_poke_type2 = 0;
  $scope.define_poke_ability = false;
  $scope.selected_poke_ability = 0;
  $scope.pokemons = [
    /*
    {
    id:'1'
    name:'妙蛙种子'
    type1:11
    type2:12
    apng:'//url'
    }
    */
  ];

    $scope.selected_item = null;
    $scope.search_move_text = null;
    $scope.query_search = query_search;
    $scope.selected_moves = [];

    function query_search (query) {
      if ($scope.selected_moves.length < 4) {
        var results = query ? $scope.moves.filter(createFilterFor2(query)) : [];
        return results;
      }
    }

    function createFilterFor2(query) {
      return function filterFn(move) {
        return (move.id.indexOf(query) === 0) ||
            (move.name.indexOf(query) === 0);
      };
    }
  $scope.load_moves = function () {
    $http.post(php_prefix + '/get_all_moves.php', {range: 'all'})
      .then(function (response) {
        $scope.moves = response.data;
        $('.cover').addClass('hidden');
      });
  };
  $scope.load_moves();
  $scope.detect_overlap = function () {
    $scope.power_min = Math.min($scope.power_max, $scope.power_min);
    $scope.accuracy_min = Math.min($scope.accuracy_max, $scope.accuracy_min);
    $scope.pp_min = Math.min($scope.pp_max, $scope.pp_min);
  };
  $scope.search_move = function () {
    $scope.search_result_moves = [];
    var i, this_move;
    for (i in $scope.moves) {
      this_move = $scope.moves[i];
      if (($scope.selected_type_id - this_move.type) * $scope.selected_type_id !== 0) {
        continue;
      }
      if (($scope.selected_kind_id - this_move.kind) * $scope.selected_kind_id !== 0) {
        continue;
      }
      if ($scope.is_100percent_kill && this_move.power != -1) {
        continue;
      }
      if (!$scope.is_100percent_kill && ($scope.power_min > this_move.power || $scope.power_max < this_move.power)) {
        continue;
      }
      if ($scope.is_100percent_accurate && this_move.accuracy != -1) {
        continue;
      }
      if (!$scope.is_100percent_accurate && ($scope.accuracy_min > this_move.accuracy || $scope.accuracy_max < this_move.accuracy)) {
        continue;
      }
      if ($scope.pp_min > this_move.pp || $scope.pp_max < this_move.pp) {
        continue;
      }
      $scope.search_result_moves.push($scope.moves[i]);
    }
  };
  $scope.add_move = function (move) {
    if ($scope.selected_moves.length === 4) {
      return;
    }
    var i;
    for (i = 0; i < $scope.selected_moves.length; i++) {
      if ($scope.selected_moves[i].id === move.id) {
        return;
      }
    }
    $scope.selected_moves.push(move);
  };
  $scope.remove_move = function (index) {
    $scope.selected_moves.splice(index, 1);
  };
  $scope.search_poke = function () {
    if ($scope.selected_moves.length === 0) {
      $scope.pokemons = [{
        id: '0',
        name: '请选择技能'
      }];
      return;
    }
    if ($scope.selected_moves[0].id == '0') {
      return;
    }
    $scope.searching_poke = true;
    $scope.pokemons = [];
    var i;
    var data = {};
    data.define_poke_type = $scope.define_poke_type;
    data.selected_poke_type1 = $scope.selected_poke_type1;
    data.selected_poke_type2 = $scope.selected_poke_type2;
    data.define_poke_ability = $scope.define_poke_ability;
    data.selected_poke_ability = $scope.selected_poke_ability;
    data.selected_moves = [];
    for (i = 0; i < $scope.selected_moves.length; i++) {
      data.selected_moves.push($scope.selected_moves[i].id);
    }

    $http.post(php_prefix + '/search_poke.php', data)
      .then(function (response) {
        $scope.pokemons = response.data;
        if ($scope.pokemons.length === 0) {
          $scope.pokemons = [{
            id: '0',
            name: '没有符合要求的PM'
          }];
        }
        $scope.searching_poke = false;
      }, function () {
        alert('发生网络错误,请重试!');
      });
  };
  $scope.show_poke = function (e, i) {

    $mdDialog.show({
      locals: {
        pokemon_id: $scope.pokemons[i].id,
        apng: $scope.apng
      },
      controller: ShowPokeController,
      templateUrl: 'views/show_poke.html',
      parent: angular.element(document.body),
      targetEvent: e,
      clickOutsideToClose: true
    });
  };
});

function ShowPokeController($scope, $mdDialog, $http, pokemon_id, apng) {
  $scope.stats_names = ['HP', '攻击', '防御', '特攻', '特防', '速度'];
  $scope.types = ('任意 普通 格斗 飞行 毒 地面 岩石 虫 幽灵 钢 火 水 草 电 超能力 冰 龙 恶 妖精').split(' ')
    .map(function (cur, index) {
      return {
        id: index,
        name: cur
      };
    });

  $scope.loading_showpoke = true;
  $scope.loading_showpoke_apng = false;
  $scope.apng = apng;
  $http.post(php_prefix + '/show_poke.php', {id: pokemon_id})
    .then(function (response) {
      $scope.pokemon = response.data;
      $scope.loading_showpoke = false;
      animate();
    });

  //TODO
  $scope.show_evolve = false;
  $scope.toggle_show_evolve = function () {
    $scope.show_evolve = !$scope.show_evolve;
  };

  //TODO
  $scope.show_move_menu = false;
  $scope.toggle_show_move_menu = function () {
    $scope.show_move_menu = !$scope.show_move_menu;
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };
}