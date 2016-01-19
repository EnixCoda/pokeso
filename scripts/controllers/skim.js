'use strict';

angular.module('pokesoApp').controller('SkimController', function ($scope) {
  var init = function () {
    loadData($scope);
    $scope.search_key = '';
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
          if (this_poke.ID.indexOf(key) > -1 || this_poke.name.indexOf(key) > -1) {
            $scope.searched_pokemons.push(this_poke);
          }
        }
      }
    };
    $scope.checkPM = function(ID) {
      ID = parseInt(ID);
      $scope.pokemon = $scope.pokemons[ID];
      $scope.pokemon.apngs = [];
      var max = 0;
      for (var i = 0; i < $scope.pokemon.base_stats.length; i++) {
        max = Math.max(max, $scope.pokemon.base_stats[i]);
      }
      draw_canvas('stats_displayer', [$scope.pokemon], max);
      animate();
    };
    $scope.randomPM = function() {

      $scope.checkPM(Math.ceil(Math.random() * 721));
    };
    $scope.searched_pokemons = $scope.pokemons;
    $scope.$apply();
  };
  loadController.toInit(init);
});