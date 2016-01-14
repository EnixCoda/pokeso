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

  $scope.define_poke_type = false;
  $scope.selected_poke_type1 = 0;
  $scope.selected_poke_type2 = 0;
  $scope.define_poke_ability = false;
  $scope.selected_poke_ability = 0;
  $scope.pokemons = [];

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
      return (move.id.indexOf(query) === 0) || (move.name.indexOf(query) === 0);
    };
  }

  $scope.moves = _move;

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
    $scope.pokemons = [];
    var data = {
      search: function () {
        var pokemonids = [];
        for (var i = 0; i < this.selected_moves.length; i++) {
          pokemonids = pokemonids.concat(_learn_set_move_to_poke[this.selected_moves[i]]);
        }
        var counter = {};
        var learnable_pokemons = [];
        for (var i = 0; i < pokemonids.length; i++) {
          counter[pokemonids[i]] = counter[pokemonids[i]] == undefined ? 1 : counter[pokemonids[i]] + 1;
          if (counter[pokemonids[i]] == this.selected_moves.length) {
            learnable_pokemons.push(_pokemons[pokemonids[i]]);
          }
        }
        if (this.define_poke_type) {
          var _learnable_pokemons = [];
          for (var i = 0; i < learnable_pokemons.length; i++) {
            switch (this.selected_poke_type2) {
              case -1:
                if ((learnable_pokemons[i].type1 == this.selected_poke_type1 && learnable_pokemons[i].type2 == null) || (learnable_pokemons[i].type2 == this.selected_poke_type1 && learnable_pokemons[i].type1 == null)) _learnable_pokemons.push(learnable_pokemons[i]);
                break;
              case 0:
                if (learnable_pokemons[i].type1 == this.selected_poke_type1 || learnable_pokemons[i].type2 == this.selected_poke_type1) _learnable_pokemons.push(learnable_pokemons[i]);
                break;
              default:
                if ((learnable_pokemons[i].type1 == this.selected_poke_type1 && learnable_pokemons[i].type2 == this.selected_poke_type2) || (learnable_pokemons[i].type2 == this.selected_poke_type1 && learnable_pokemons[i].type1 == this.selected_poke_type2)) _learnable_pokemons.push(learnable_pokemons[i]);
            }
          }
          learnable_pokemons = _learnable_pokemons;
        }
        if (this.define_poke_ability) {
          var _learnable_pokemons = [];
          for (var i = 0; i < learnable_pokemons.length; i++) {
            if (learnable_pokemons[i].ability1 == this.selected_poke_ability || learnable_pokemons[i].ability2 == this.selected_poke_ability || learnable_pokemons[i].ability3 == this.selected_poke_ability) _learnable_pokemons.push(learnable_pokemons[i]);
          }
          learnable_pokemons = _learnable_pokemons;
        }
        return learnable_pokemons;
      }
    };
    data.define_poke_type = $scope.define_poke_type;
    data.selected_poke_type1 = $scope.selected_poke_type1;
    data.selected_poke_type2 = $scope.selected_poke_type2;
    data.define_poke_ability = $scope.define_poke_ability;
    data.selected_poke_ability = $scope.selected_poke_ability;
    data.selected_moves = [];
    for (var i = 0; i < $scope.selected_moves.length; i++) {
      data.selected_moves.push($scope.selected_moves[i].id);
    }

    $scope.pokemons = data.search();
    if ($scope.pokemons.length === 0) {
      $scope.pokemons = [{
        id: '0',
        name: '没有符合要求的PM'
      }];
    }
  };
  $scope.show_poke = function (e, i) {
    $mdDialog.show({
      targetEvent: e,
      locals: {
        pokemon_id: $scope.pokemons[i].id,
        load_apng: $scope.apng.load,
      },
      controller: ShowPokeController,
      templateUrl: 'views/show_poke.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true
    });
  };
});

function ShowPokeController($scope, $mdDialog, $http, pokemon_id, load_apng) {
  $scope.stats_names = _stats_names;
  $scope.types = _types;

  $scope.pokemon      = _pokemons[pokemon_id];
  $scope.pokemon.apng = storageAddr + pokemon_id + '.png';
  $scope.load_apng    = load_apng;

  animate();

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