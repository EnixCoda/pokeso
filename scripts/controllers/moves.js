"use strict";

angular.module('pokesoApp').controller('MovesController', function ($scope, $http, $mdDialog) {
  var init = function () {
    loadData($scope);
    $scope.loaded = true;

    var moveFilter       = MoveFilter.new();
    $scope.moveFilter    = moveFilter;
    $scope.selectedMoves = [];

    $scope.detectOverlap = moveFilter.detectOverlap;

    $scope.searchMove = function () {
      $scope.searchResultMoves = moveFilter.searchMove();
    };

    $scope.querySearch = function (query) {
      function createFilterFor2 (query) {
        return function filterFn (move) {
          if (parseInt(move) == move) {
            return false;
          }
          return ((move.ID).toString().indexOf(query) === 0) || (move.name.indexOf(query) >= 0);
        };
      }

      if ($scope.selectedMoves.length < 4) {
        return query ? mainData.moves.filter(createFilterFor2(query)) : [];
      }
    };

    $scope.addMove = function (move) {
      if ($scope.selectedMoves.length === 4) {
        return;
      }
      for (var i = 0; i < $scope.selectedMoves.length; i++) {
        if ($scope.selectedMoves[i].ID == move.ID) {
          return;
        }
      }
      $scope.selectedMoves.push(move);
    };

    $scope.removeMove = function (index) {
      $scope.selectedMoves.splice(index, 1);
    };

    $scope.searchPoke = function () {
      if ($scope.selectedMoves.length === 0) {
        $scope.pokemonsCanLearn = [{
          ID:   '0',
          name: '请选择技能'
        }];
        return;
      }
      $scope.pokemonsCanLearn = [];

      var pokemonIDs = [];
      for (i = 0; i < $scope.selectedMoves.length; i++) {
        pokemonIDs = pokemonIDs.concat(learnSetDictMovePoke[$scope.selectedMoves[i].ID]);
      }
      var counter           = {};
      var learnablePokemons = [];
      for (i = 0; i < pokemonIDs.length; i++) {
        counter[pokemonIDs[i]] = counter[pokemonIDs[i]] == undefined ? 1 : counter[pokemonIDs[i]] + 1;
        if (counter[pokemonIDs[i]] == $scope.selectedMoves.length) {
          learnablePokemons.push($scope.pokemons[parseInt(pokemonIDs[i])]);
        }
      }
      if (moveFilter.definePokeType && moveFilter.selectedPokeType1.ID) {
        var allLearnablePokemons = [];
        for (var i = 0; i < learnablePokemons.length; i++) {
          var selectedPokeType1 = moveFilter.selectedPokeType1;
          var selectedPokeType2 = moveFilter.selectedPokeType2;
          switch (parseInt(selectedPokeType2.ID)) {
            case -1:
              if (learnablePokemons[i].type1.ID == selectedPokeType1.ID && learnablePokemons[i].type2.ID == 0) {
                allLearnablePokemons.push(learnablePokemons[i]);
              }
              break;
            case 0:
              if (learnablePokemons[i].type1.ID == selectedPokeType1.ID
                || learnablePokemons[i].type2.ID == selectedPokeType1.ID) {
                allLearnablePokemons.push(learnablePokemons[i]);
              }
              break;
            default:
              if ((learnablePokemons[i].type1.ID == selectedPokeType1.ID && learnablePokemons[i].type2.ID == selectedPokeType2.ID)
                || (learnablePokemons[i].type2.ID == selectedPokeType1.ID && learnablePokemons[i].type1.ID == selectedPokeType2.ID)) {
                allLearnablePokemons.push(learnablePokemons[i]);
              }
              break;
          }
        }
        learnablePokemons = allLearnablePokemons;
      }
      learnablePokemons = learnablePokemons.sort(
        function (p1, p2) {
          if (parseInt(p1.ID) > parseInt(p2.ID)) return 1;
          if (parseInt(p1.ID) < parseInt(p2.ID)) return -1;
          if (parseInt(p1.ID) == parseInt(p2.ID)) return 0;
        });
      if (moveFilter.definePokeAbility) {
        var learnablePokemonsWithAbility = [];
        for (i = 0; i < learnablePokemons.length; i++) {
          if (learnablePokemons[i].ability1 == moveFilter.selectedPokeAbility
            || learnablePokemons[i].ability2 == moveFilter.selectedPokeAbility
            || learnablePokemons[i].ability3 == $scope.selectedPokeAbility) {
            learnablePokemonsWithAbility.push(learnablePokemons[i]);
          }
        }
        learnablePokemons = learnablePokemonsWithAbility;
      }
      $scope.pokemonsCanLearn = learnablePokemons.length ? learnablePokemons : [{
        ID:   '0',
        name: '没有符合要求的PM'
      }];
    };

    $scope.showPoke = function (event, ID) {
      function ShowPokeController ($scope, $mdDialog, pokemon, loadAPNG) {
        loadData($scope);
        $scope.pokemon  = pokemon;
        $scope.loadAPNG = loadAPNG;
        animateAPNG();

        //TODO
        $scope.showEvolve       = false;
        $scope.toggleShowEvolve = function () {
          $scope.showEvolve = !$scope.showEvolve;
        };

        $scope.hide = function () {
          $mdDialog.hide();
        };
      }

      if ($scope.pokemonsCanLearn[ID].ID == 0) {
        return;
      }
      $mdDialog.show({
        targetEvent:         event,
        locals:              {
          pokemon:  $scope.pokemonsCanLearn[ID],
          loadAPNG: $scope.apng.load
        },
        controller:          ShowPokeController,
        templateUrl:         'views/show_poke.html',
        clickOutsideToClose: true
      });
    };

    $scope.$apply();
  };
  loadController.toInit(init);
});