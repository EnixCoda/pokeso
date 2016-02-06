'use strict';

angular.module('pokesoApp').controller('SkimController', function ($scope) {
  var init = function () {
    loadData($scope);
    loadGenerationSearcher($scope);

    $scope.checkPM = function(ID) {
      ID = parseInt(ID);
      $scope.pokemon = $scope.pokemons[ID];
      $scope.pokemon.apngs = [];
      var max = 0;
      for (var i = 0; i < $scope.pokemon.baseStats.length; i++) {
        max = Math.max(max, $scope.pokemon.baseStats[i]);
      }
      drawCanvas('statsGraph', [$scope.pokemon], max);
      animateAPNG();
    };
    $scope.randomPM = function() {
      $scope.checkPM(Math.ceil(Math.random() * ($scope.pokemons.length - 1)));
    };
    $scope.$apply();
  };
  loadController.toInit(init);
});