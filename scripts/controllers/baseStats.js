"use strict";
/**
 * @ngdoc function
 * @name pokesoApp.controller: BaseStatsController
 * @description
 * # BaseStatsCtroller
 * Controller of the pokesoApp
 */

angular.module('pokesoApp').controller('BaseStatsController', function ($scope, $http) {

  $scope.cards = [];

  function draw_canvas() {
    var data = [];
    for (card in $scope.cards) {
      values = $scope.cards[card].base_stats;
      if ($scope.cards[card].show) {
        data.push($scope.cards[card]);
      };
    }
    var max = 0;
    var card;
    var values, value;
    for (card in $scope.cards) {
      values = $scope.cards[card].base_stats;
      for (value in values) {
        max = Math.max(values[value], max);
      }
    }
    $scope.draw_canvas('stats_displayer', data, max);
  }

  $scope.search_key = '';
  $scope.searched_pokemons = $scope.pokemons.slice(1);
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


  $scope.fetching_basestats = false;
  $scope.max_card_length = 6;
  $scope.add_card = function (id) {
    if ($scope.cards.length < $scope.max_card_length) {
      var card;
      for (card in $scope.cards) {
        if ($scope.cards[card].id == id) {
          return;
        }
      }
      $scope.fetching_basestats = true;
      $http.post(php_prefix + '/get_one_poke.php', {'id': id})
        .then(function (response) {
          response.data.show = true;
          $scope.cards.push(response.data);
          $scope.fetching_basestats = false;
          draw_canvas();
          animate();
        });
    }
  };

  $scope.del_card = function (index) {
    $scope.cards.splice(index, 1);
    draw_canvas();
  };

  $scope.toggle_show_card = function (index) {
    $scope.cards[index].show = !$scope.cards[index].show;
    draw_canvas();
  };

  $(document).ready(function(){
    $('.cover').addClass('hidden');
    $('#stats_displayer').click(function () {
      $('#stats_displayer').toggleClass('stats_displayer_zoom');
    });
  });
});