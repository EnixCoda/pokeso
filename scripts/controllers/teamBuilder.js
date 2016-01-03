"use strict";
/**
 * @ngdoc function
 * @name pokesoApp.controller: TeamBuilderController
 * @description
 * # TeamBuilderController
 * Controller of the pokesoApp
 */

angular.module('pokesoApp').controller('TeamBuilderController', function ($scope, $http, $mdBottomSheet) {

  $scope.search_key = '';
  $scope.searched_pokemons = $scope.pokemons.slice(1);
  $scope.search = function () {
    var i, key = $scope.search_key;
    var this_poke;
    $scope.searched_pokemons = [];
    if (key === '') {
      for (i in $scope.generation_index[$scope.generation]) {
        $scope.searched_pokemons.push($scope.pokemons[$scope.generation_index[$scope.generation][i]]);
      }
    } else {
      for (i in $scope.generation_index[$scope.generation]) {
        this_poke = $scope.pokemons[$scope.generation_index[$scope.generation][i]];
        if (this_poke.id.indexOf(key) > -1 || this_poke.name.indexOf(key) > -1) {
          $scope.searched_pokemons.push(this_poke);
        }
      }
    }
  };
//moves
  $scope.selected_type_id = -2;
  $scope.selected_kind_id = -2;
  $scope.is_100percent_kill = false;
  $scope.power_min = 0;
  $scope.power_max = 250;
  $scope.is_100percent_accurate = false;
  $scope.accuracy_min = 0;
  $scope.accuracy_max = 100;
  $scope.pp_min = 0;
  $scope.pp_max = 50;

  $scope.detect_overlap = function () {
    $scope.power_min = Math.min($scope.power_max, $scope.power_min);
    $scope.accuracy_min = Math.min($scope.accuracy_max, $scope.accuracy_min);
    $scope.pp_min = Math.min($scope.pp_max, $scope.pp_min);
  };
  $scope.moves = [];
  $scope.search_move = function () {
    if ($scope.cur === null) {
      return;
    }
    var data = {};
    data.poke_id = $scope.cur.id;
    data.selected_type_id = $scope.selected_type_id;
    data.selected_kind_id = $scope.selected_kind_id;
    data.is_100percent_kill = $scope.is_100percent_kill;
    data.power_max = $scope.power_max;
    data.power_min = $scope.power_min;
    data.is_100percent_accurate = $scope.is_100percent_accurate;
    data.accuracy_max = $scope.accuracy_max;
    data.accuracy_min = $scope.accuracy_min;
    data.pp_max = $scope.pp_max;
    data.pp_min = $scope.pp_min;
    $http.post($scope.serverAddr + '/search_move_team.php', data)
      .then(function (response) {
        $scope.moves = response.data;
      }, function () {
        console.log('加载失败!请尝试刷新!');
      });
  };

//team
  $scope.team = [];
  $scope.remove_from_team = function (index) {
    $scope.team.splice(index, 1);
  };
  /*
    {
      id:'1',
      name:'妙蛙种子',
      type1:'13',
      type2:'14',

      //new:
      abilities:[
      {id:0, name:'', description:''}, {}, {}
      ],
      moves:[
      {id:0, name:''}, {}, {}, {}
      ],
      selected_ability_index:(1/2/3),
      item:{id:0, name:'', description:''},
      IV:[31, 31, 31, 31, 31, 31],
      base_stat:[0, 0, 0, 0, 0, 0],
      nature:0, //save in js
      sex:0 //0:none, 1:male, 2:female, -x:lock
    }
  */

//cur
  $scope.sexs = ['无性别', '♂', '♀', '♂♂', '♀♀'];
  function change_sex(sex) {
    if (sex > 2) {
      return sex;
    }
    return 3 - sex;
  }

  $scope.calculate = function (pokemon) {
    var i;
    if (pokemon.id === '292') {
      pokemon.stats[0] = 1;
    } else {
      pokemon.stats[0] = Math.floor((pokemon.IV[0] + pokemon.base_stats[0] * 2 + pokemon.base_stat[0] / 4) * pokemon.level / 100 + 10 + pokemon.level); // HP
    }
    for (i = 1; i < 6; i++) {
      pokemon.stats[i] = Math.floor(((pokemon.IV[i] + pokemon.base_stats[i] * 2 + pokemon.base_stat[i] / 4) * pokemon.level / 100 + 5) * $scope.natures[pokemon.nature].value[i]);  //ATK//DEF//SPATK//SPDEF//SPD
    }
  };

  $scope.cur = null;
  $scope.edit_pokemon = function (id) {
    if ($scope.team.length > 0 && $scope.cur.id == id) {
      return;
    }
    $scope.moves = [];
    //a new one?
    var i;
    for (i = 0; i < $scope.team.length; i++) {
      if ($scope.team[i].id === id) {
        $scope.cur = $scope.team[i];
        animate();
        return;
      }
    }
    //if it's new
    if ($scope.team.length === 6) {
      return;
    }

    $http.post($scope.serverAddr + '/get_one_poke.php', {id: id})
      .then(function (response) {
        $scope.team.push(response.data);
        $scope.cur = $scope.team[$scope.team.length - 1];
        $scope.calculate($scope.cur);
        animate();
      });
  };
  $scope.remove_cur = function () {
    $scope.team.splice($.inArray($scope.cur, $scope.team), 1);
    $scope.cur = $scope.team[$scope.team.length - 1];
    $scope.moves = [];
    animate();
  };
  $scope.add_move = function (move) {
    if ($scope.cur == null || $.inArray(move, $scope.cur.moves) >= 0 || $scope.cur.moves.length === 4) {
      return;
    }
    $scope.cur.moves.push(move);
  };
  $scope.remove_move = function (index) {
    $scope.cur.moves.splice(index, 1);
  };

//save as serial
  $scope.serial = {text: ''};
  $scope.save = function () {
    if ($scope.team.length > 0) {
      $scope.serial.text = '正在压缩...';
      $http.post($scope.serverAddr + '/save_serial.php', {team: $scope.team})
        .then(function (response) {
          var encoded = $hashdown.encode(response.data, {
              codec: $hashdown.TADPOLE
            });
          $scope.serial.text = encoded;
        });
    }
  };
  $scope.load = function () {
    if ($scope.serial.text !== '') {
      var decoded;
      if (decoded = $hashdown.decode($scope.serial.text).text) {
        $http.post($scope.serverAddr + '/load_serial.php', {serial: decoded})
          .then(function (response) {
            $scope.team = response.data;
            var i;
            for (i in $scope.team) {
              $scope.calculate($scope.team[i]);
            }
            $scope.cur = $scope.team[0];
            animate();
          });
      } else {
        alert('错误的编码!');
      }
    }
  };

//open stat editor
  $scope.open_editor = function ($event) {
    $mdBottomSheet.show({
      locals: {
        this_poke: $scope.cur
      },
      templateUrl: 'views/stat_editor.html',
      scope: $scope,
      controller: 'StatEditorController',
      targetEvent: $event,
      preserveScope: true,
      parent: null
    });
  };

  $(document).ready(function(){
    $('.cover').addClass('hidden');
  });
});

angular.module('pokesoApp').controller('StatEditorController', function ($scope) {
  $scope.clear_this_input = function (area, index) {
    area[index] = area[index] === 0 ? null : area[index];
  };
  $scope.on_blur = function (area, index) {
    area[index] = area[index] === null ? 0 : area[index];
    $scope.calculate($scope.cur);
  };
  $scope.stat_change = function (area, index) {
    if (area[index] === null) {
      return;
    }
    if (area[index] > 252) {
      area[index] = 252;
      alert('单项努力值不能超过252!');
    }
    if (area[index] < 0) {
      area[index] = 0;
      alert('不能为负数!');
    }
    var sum = area.reduce(function (prev, cur) {
        return prev + cur;
      });
    if (sum > 510) {
      area[index] = 0;
      alert('努力值总和不能超过510!');
    }
    $scope.calculate($scope.cur);
  };
  $scope.calculate($scope.cur);
});