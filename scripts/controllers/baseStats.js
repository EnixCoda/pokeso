"use strict";

angular.module('pokesoApp').controller('BaseStatsController', function ($scope) {
  var init = function () {
    loadData($scope);
    loadGenerationSearcher($scope);

    $scope.cards = [];
    $scope.showCards = [];
    function draw_canvas_prepare() {
      var cardsToShow = [], values, max = 0;
      for (var i = 0; i < $scope.cards.length; i++) {
        values = $scope.cards[i].base_stats;
        for (var j = 0; j < values.length; j++) {
          max = Math.max(values[j], max);
        }
        if ($scope.showCards[i]) {
          cardsToShow.push($scope.cards[i]);
        }
      }
      draw_canvas('stats_displayer', cardsToShow, max);
    }

    $scope.backgroundColors = canvas_colors;
    $scope.max_card_length = 6;
    $scope.add_card = function (ID) {
      if ($scope.cards.length < $scope.max_card_length) {
        ID = parseInt(ID);
        for (var i = 0; i < $scope.cards.length; i++) {
          if (parseInt($scope.cards[i].ID) == ID) {
            return;
          }
        }
        $scope.cards.push($scope.pokemons[ID]);
        $scope.showCards.push(true);
        draw_canvas_prepare();
        animate();
      }
    };

    $scope.del_card = function (index) {
      $scope.cards.splice(index, 1);
      $scope.showCards.splice(index, 1);
      draw_canvas_prepare();
    };

    $scope.toggle_show_card = function (index) {
      $scope.cards[index].show = !$scope.cards[index].show;
      $scope.showCards[index] = !$scope.showCards[index];
      draw_canvas_prepare();
    };
  };
  loadController.toInit(init);
});