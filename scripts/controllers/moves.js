"use strict";

angular.module('pokesoApp').controller('MovesController', function ($scope, $http, $mdDialog) {
  var init = function () {
    loadData($scope);
    $scope.loaded = true;

    var moveFilter = {};
    moveFilterInit(moveFilter);
    $scope.moveFilter = moveFilter;
    $scope.selected_moves = [];

    $scope.detect_overlap = function () {
      moveFilter.power_min = Math.min(moveFilter.power_max, moveFilter.power_min);
      moveFilter.accuracy_min = Math.min(moveFilter.accuracy_max, moveFilter.accuracy_min);
      moveFilter.pp_min = Math.min(moveFilter.pp_max, moveFilter.pp_min);
    };
    $scope.search_move = function () {
      $scope.search_result_moves = [];
      var i, this_move;
      for (i in mainData.moves) {
        this_move = mainData.moves[i];
        if (!this_move) {
          //invalid move, e.g: 0 for moves[0]
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
      for (i = 0; i < $scope.selected_moves.length; i++) {
        pokemonIDs = pokemonIDs.concat(learnSet_move_poke[$scope.selected_moves[i].ID]);
      }
      var counter = {};
      var learnable_pokemons = [];
      for (i = 0; i < pokemonIDs.length; i++) {
        counter[pokemonIDs[i]] = counter[pokemonIDs[i]] == undefined ? 1 : counter[pokemonIDs[i]] + 1;
        if (counter[pokemonIDs[i]] == $scope.selected_moves.length) {
          learnable_pokemons.push($scope.pokemons[parseInt(pokemonIDs[i])]);
        }
      }
      if (moveFilter.define_poke_type && moveFilter.selected_poke_type1.ID) {
        var _learnable_pokemons = [];
        for (var i = 0; i < learnable_pokemons.length; i++) {
          var selected_poke_type1 = moveFilter.selected_poke_type1;
          var selected_poke_type2 = moveFilter.selected_poke_type2;
          switch (parseInt(selected_poke_type2.ID)) {
            case -1:
              if (learnable_pokemons[i].type1.ID == selected_poke_type1.ID && learnable_pokemons[i].type2.ID == 0)
                _learnable_pokemons.push(learnable_pokemons[i]);
              break;
            case 0:
              if (learnable_pokemons[i].type1.ID == selected_poke_type1.ID
                ||learnable_pokemons[i].type2.ID == selected_poke_type1.ID)
                _learnable_pokemons.push(learnable_pokemons[i]);
              break;
            default:
              if ((learnable_pokemons[i].type1.ID == selected_poke_type1.ID && learnable_pokemons[i].type2.ID == selected_poke_type2.ID)
                ||(learnable_pokemons[i].type2.ID == selected_poke_type1.ID && learnable_pokemons[i].type1.ID == selected_poke_type2.ID))
                _learnable_pokemons.push(learnable_pokemons[i]);
              break;
          }
        }
        learnable_pokemons = _learnable_pokemons;
      }
      if (moveFilter.define_poke_ability) {
        var _learnable_pokemons = [];
        for (i = 0; i < learnable_pokemons.length; i++) {
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
      $scope = $scope === this.$parent ? this.$parent : $scope;
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
      $mdDialog.show({
        targetEvent: e,
        locals: {
          pokemon: $scope.pokemons_can_learn[i],
          load_apng: $scope.apng.load
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