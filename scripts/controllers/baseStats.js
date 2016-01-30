"use strict";

angular.module('pokesoApp').controller('BaseStatsController', function ($scope) {
  var init = function () {
    loadData($scope);
    loadGenerationSearcher($scope);

    $scope.cards = [];
    $scope.showCards = [];
    function drawCanvasPrepare() {
      var cardsToShow = [], values, max = 0;
      for (var i = 0; i < $scope.cards.length; i++) {
        values = $scope.cards[i].baseStats;
        for (var j = 0; j < values.length; j++) {
          max = Math.max(values[j], max);
        }
        if ($scope.showCards[i]) {
          cardsToShow.push($scope.cards[i]);
        }
      }
      drawCanvas('statsGraph', cardsToShow, max);
    }

    $scope.backgroundColors = canvasColors;
    $scope.maxCardLength    = 6;
    $scope.addCard          = function (ID) {
      if ($scope.cards.length < $scope.maxCardLength) {
        ID = parseInt(ID);
        for (var i = 0; i < $scope.cards.length; i++) {
          if (parseInt($scope.cards[i].ID) == ID) {
            return;
          }
        }
        $scope.cards.push($scope.pokemons[ID]);
        $scope.showCards.push(true);
        drawCanvasPrepare();
        animateAPNG();
      }
    };

    $scope.delCard = function (index) {
      $scope.cards.splice(index, 1);
      $scope.showCards.splice(index, 1);
      drawCanvasPrepare();
    };

    $scope.toggleShowCard = function (index) {
      $scope.cards[index].show = !$scope.cards[index].show;
      $scope.showCards[index] = !$scope.showCards[index];
      drawCanvasPrepare();
    };

  };
  loadController.toInit(init);
});