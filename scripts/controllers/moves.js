"use strict";
/**
 * @ngdoc function
 * @name pokesoApp.controller: MovesController
 * @description
 * # MovesController
 * Controller of the pokesoApp
 */
angular.module('pokesoApp').controller('MovesController', function ($scope, $http, $mdDialog) {
  var init = function () {
    loadData($scope);
    $scope.loaded = true;
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
    $scope.pokemons_can_learn = [];

    $scope.selected_item = null;
    $scope.search_move_text = null;
    $scope.selected_moves = [];
    $scope.query_search = function (query) {
      function createFilterFor2(query) {
        return function filterFn(move) {
          if (parseInt(move) == move) {
            return false;
          }
          return ((move.ID).toString().indexOf(query) === 0) || (move.name.indexOf(query) >= 0);
        };
      }
      if ($scope.selected_moves.length < 4) {
        return query ? mainData.moves.filter(createFilterFor2(query)) : [];
      }
    };

    $scope.detect_overlap = function () {
      $scope.power_min = Math.min($scope.power_max, $scope.power_min);
      $scope.accuracy_min = Math.min($scope.accuracy_max, $scope.accuracy_min);
      $scope.pp_min = Math.min($scope.pp_max, $scope.pp_min);
    };

    $scope.search_move = function () {
      $scope.search_result_moves = [];
      var i, this_move;
      for (i in mainData.moves) {
        this_move = mainData.moves[i];
        if (this_move == parseInt(this_move)) {
          continue;
        }
        if (!this_move.kind) {
          continue;
        }
        if (($scope.selected_type_id - this_move.type.ID) * $scope.selected_type_id !== 0) {
          continue;
        }
        if (($scope.selected_kind_id - this_move.kind.ID) * $scope.selected_kind_id !== 0) {
          continue;
        }
        if ($scope.is_100percent_kill && this_move.power != '-') {
          continue;
        }
        if (!$scope.is_100percent_kill && ($scope.power_min > this_move.power || $scope.power_max < this_move.power)) {
          continue;
        }
        if ($scope.is_100percent_accurate && this_move.accuracy != '-') {
          continue;
        }
        if (!$scope.is_100percent_accurate && ($scope.accuracy_min > this_move.accuracy || $scope.accuracy_max < this_move.accuracy)) {
          continue;
        }
        if ($scope.pp_min > this_move.pp || $scope.pp_max < this_move.pp) {
          continue;
        }
        $scope.search_result_moves.push(mainData.moves[i]);
      }
    };

    $scope.add_move = function (move) {
      if ($scope.selected_moves.length === 4) {
        return;
      }
      for (var i = 0; i < $scope.selected_moves.length; i++) {
        if ($scope.selected_moves[i].ID == move.ID) {
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
        $scope.pokemons_can_learn = [{
          ID: '0',
          name: '请选择技能'
        }];
        return;
      }
      $scope.pokemons_can_learn = [];

      var pokemonIDs = [];
      for (var i = 0; i < $scope.selected_moves.length; i++) {
        pokemonIDs = pokemonIDs.concat(learnSet_move_poke[$scope.selected_moves[i].ID]);
      }
      var counter = {};
      var learnable_pokemons = [];
      for (var i = 0; i < pokemonIDs.length; i++) {
        counter[pokemonIDs[i]] = counter[pokemonIDs[i]] == undefined ? 1 : counter[pokemonIDs[i]] + 1;
        if (counter[pokemonIDs[i]] == $scope.selected_moves.length) {
          learnable_pokemons.push($scope.pokemons[pokemonIDs[i]]);
        }
      }
      if ($scope.define_poke_type) {
        var _learnable_pokemons = [];
        for (var i = 0; i < learnable_pokemons.length; i++) {
          switch ($scope.selected_poke_type2) {
            case -1:
              if ((learnable_pokemons[i].type1 == $scope.selected_poke_type1 && learnable_pokemons[i].type2 == null) || (learnable_pokemons[i].type2 == $scope.selected_poke_type1 && learnable_pokemons[i].type1 == null)) _learnable_pokemons.push(learnable_pokemons[i]);
              break;
            case 0:
              if (learnable_pokemons[i].type1 == $scope.selected_poke_type1 || learnable_pokemons[i].type2 == $scope.selected_poke_type1) _learnable_pokemons.push(learnable_pokemons[i]);
              break;
            default:
              if ((learnable_pokemons[i].type1 == $scope.selected_poke_type1 && learnable_pokemons[i].type2 == $scope.selected_poke_type2) || (learnable_pokemons[i].type2 == $scope.selected_poke_type1 && learnable_pokemons[i].type1 == $scope.selected_poke_type2)) _learnable_pokemons.push(learnable_pokemons[i]);
          }
        }
        learnable_pokemons = _learnable_pokemons;
      }
      if ($scope.define_poke_ability) {
        var _learnable_pokemons = [];
        for (var i = 0; i < learnable_pokemons.length; i++) {
          if (learnable_pokemons[i].ability1 == $scope.selected_poke_ability || learnable_pokemons[i].ability2 == $scope.selected_poke_ability || learnable_pokemons[i].ability3 == $scope.selected_poke_ability) _learnable_pokemons.push(learnable_pokemons[i]);
        }
        learnable_pokemons = _learnable_pokemons;
      }
      $scope.pokemons_can_learn = learnable_pokemons;

      if ($scope.pokemons_can_learn.length === 0) {
        $scope.pokemons_can_learn = [{
          ID: '0',
          name: '没有符合要求的PM'
        }];
      }
    };

    $scope.show_poke = function (e, i) {
      $mdDialog.show({
        targetEvent: e,
        locals: {
          pokemon: $scope.pokemons_can_learn[i],
          load_apng: $scope.apng.load,
        },
        controller: ShowPokeController,
        templateUrl: 'views/show_poke.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
    };

    $scope.$apply();
  };
  loadController.toInit(init);
});
function ShowPokeController($scope, $mdDialog, pokemon, load_apng) {
  loadData($scope);
  $scope.typeColors   = typeColors;
  $scope.pokemon      = pokemon;
  $scope.pokemon.apng = storageAddr + pokemon.ID + '.png';
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