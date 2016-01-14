'use strict';

/**
 * @ngdoc function
 * @name pokesoApp.controller:SkimController
 * @description
 * # SkimController
 * Controller of the pokesoApp
 */
angular.module('pokesoApp').controller('SkimController', function ($scope, $http) {
  $scope.pokemon = null
  $scope.checkPM = function(id) {
    $scope.pokemon = _pokemons[id];
    $scope.pokemon.apngs      = [];

    var max=0;
    for (var i = 0; i < $scope.pokemon.base_stats.length; i++) {
      max = Math.max(max, $scope.pokemon.base_stats[i]);
    };
    $scope.draw_canvas('stats_displayer', [$scope.pokemon], max);
    animate();
  }

  $scope.randomPM = function() {
    $scope.checkPM(Math.ceil(Math.random()*721));
  }

  $scope.search_key = '';
  $scope.searched_pokemons = _poke_basic;
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

});
