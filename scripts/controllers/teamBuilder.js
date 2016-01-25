"use strict";
/**
 * @ngdoc function
 * @name pokesoApp.controller: TeamBuilderController
 * @description
 * # TeamBuilderController
 * Controller of the pokesoApp
 */

angular.module('pokesoApp').controller('TeamBuilderController', function ($scope, $http, $mdBottomSheet) {
  var init = function () {
    loadData($scope);
    loadGenerationSearcher($scope);

    var moveFilter = {};
    moveFilterInit(moveFilter);
    $scope.moveFilter     = moveFilter;
    $scope.detect_overlap = function () {
      moveFilter.power_min    = Math.min(moveFilter.power_max, moveFilter.power_min);
      moveFilter.accuracy_min = Math.min(moveFilter.accuracy_max, moveFilter.accuracy_min);
      moveFilter.pp_min       = Math.min(moveFilter.pp_max, moveFilter.pp_min);
    };
    $scope.search_move    = function () {
      $scope.search_result_moves = [];
      var i, this_move;
      for (i in mainData.moves) {
        this_move = mainData.moves[i];
        if (!this_move) {
          //invalid move, e.g: 0 for moves[0]
          continue;
        }
        if (inArray(this_move.ID, learnSet_poke_move[($scope.current.ID)]) == -1) {
          continue;
        }
        if (moveFilter.selected_type_id && (moveFilter.selected_type_id - this_move.type.ID) * moveFilter.selected_type_id !== 0) {
          continue;
        }
        if (moveFilter.selected_kind_id && (moveFilter.selected_kind_id - this_move.kind.ID) * moveFilter.selected_kind_id !== 0) {
          continue;
        }
        if (moveFilter.powerIndeterminable && !(!isNumber(this_move.power))) {
          continue;
        }
        if (!moveFilter.powerIndeterminable && !(isNumber(this_move.power) && moveFilter.power_min <= this_move.power && this_move.power <= moveFilter.power_max)) {
          continue;
        }
        if (moveFilter.accuracyIndeterminable && !(!isNumber(this_move.accuracy))) {
          continue;
        }
        if (!moveFilter.accuracyIndeterminable && !(isNumber(this_move.accuracy) && moveFilter.accuracy_min <= this_move.accuracy && this_move.accuracy <= moveFilter.accuracy_max)) {
          continue;
        }
        if (!(moveFilter.pp_min <= this_move.PP && this_move.PP <= moveFilter.pp_max)) {
          continue;
        }
        $scope.search_result_moves.push(this_move);
      }
    };

    $scope.team = [];

    $scope.sexs = ['无性别', '♂', '♀', '♂♂', '♀♀'];
    function change_sex(sex) {
      if (sex > 2) {
        return sex;
      }
      return 3 - sex;
    }

    $scope.calculate = function (pokemon) {
      if (pokemon.id === '292') {
        pokemon.stats[0] = 1;
      } else {
        pokemon.stats[0] = Math.floor((pokemon.IV[0] + pokemon.base_stats[0] * 2 + pokemon.base_stat[0] / 4) * pokemon.level / 100 + 10 + pokemon.level); // HP
      }
      for (var i = 1; i < 6; i++) {
        pokemon.stats[i] = Math.floor(((pokemon.IV[i] + pokemon.base_stats[i] * 2 + pokemon.base_stat[i] / 4) * pokemon.level / 100 + 5) * $scope.natures[pokemon.natureID].value[i]);  //ATK//DEF//SPATK//SPDEF//SPD
      }
    };

    $scope.edit_pokemon     = function (ID) {
      ID = parseInt(ID);
      if ($scope.current && $scope.current.ID == ID) {
        return;
      }
      $scope.search_result_moves = [];

      for (var i = 0; i < $scope.team.length; i++) {
        if ($scope.team[i].ID == ID) {
          $scope.current = $scope.team[i];
          animate();
          return;
        }
      }

      if ($scope.team.length === 6) {
        return;
      }

      //copy pokemon;
      var newPokemon = {
            ID:         $scope.pokemons[ID].ID,
            name:       $scope.pokemons[ID].name,
            apng:       $scope.pokemons[ID].apng,
            ability1:   $scope.pokemons[ID].ability1,
            ability2:   $scope.pokemons[ID].ability2,
            abilityd:   $scope.pokemons[ID].abilityd,
            type1:      $scope.pokemons[ID].type1,
            type2:      $scope.pokemons[ID].type2,
            base_stats: $scope.pokemons[ID].base_stats,
            base_stat:  [0, 0, 0, 0, 0, 0],
            IV:         [31, 31, 31, 31, 31, 31],
            stats:      [0, 0, 0, 0, 0, 0],
            level:      100,
            natureID:   1,
            sex:        0,
            moves:      []
          }
        ;
      $scope.team.push(newPokemon);
      $scope.current = newPokemon;
      $scope.calculate(newPokemon);
      animate();
    };
    $scope.remove_from_team = function (index) {
      $scope.team.splice(index, 1);
    };
    $scope.remove_cur       = function () {
      $scope.team.splice(inArray($scope.current, $scope.team), 1);
      $scope.current             = $scope.team.length ? $scope.team[$scope.team.length - 1] : undefined;
      $scope.search_result_moves = [];
      animate();
    };
    $scope.add_move         = function (move) {
      if (!$scope.current || inArray(move, $scope.current.moves) >= 0 || $scope.current.moves.length === 4) {
        return;
      }
      $scope.current.moves.push(move);
    };
    $scope.remove_move      = function (index) {
      $scope.current.moves.splice(index, 1);
    };

    //save as serial
    $scope.serial = {text: ''};
    $scope.save   = function () {
      if ($scope.team.length > 0) {
        $scope.serial.text = '正在压缩...';
        $http.post($scope.serverAddr + '/save_serial.php', {team: $scope.team})
          .then(function (response) {
            $scope.serial.text = $hashdown.encode(response.data, {
              codec: $hashdown.TADPOLE
            });
          });
      }
    };
    $scope.load   = function () {
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
              $scope.current = $scope.team[0];
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
        locals:        {
          this_poke: $scope.current
        },
        templateUrl:   'views/stat_editor.html',
        scope:         $scope,
        controller:    'StatEditorController',
        targetEvent:   $event,
        preserveScope: true,
        //parent:        angular.element(document.getElementById('editorWindow'))
      });
    };
  };
  loadController.toInit(init);
});

angular.module('pokesoApp').controller('StatEditorController', function ($scope) {
  $scope.clear_this_input = function (area, index) {
    area[index] = area[index] === 0 ? null : area[index];
  };

  $scope.on_blur = function (area, index) {
    area[index] = area[index] === null ? 0 : area[index];
    $scope.calculate($scope.current);
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
    var sum = area.reduce(function (prev, current) {
      return prev + current;
    });
    if (sum > 510) {
      area[index] = 0;
      alert('努力值总和不能超过510!');
    }
    $scope.calculate($scope.current);
  };

  $scope.calculate($scope.current);
});