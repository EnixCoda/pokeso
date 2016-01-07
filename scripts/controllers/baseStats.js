"use strict";

angular.module('pokesoApp').controller('BaseStatsController', function ($scope, $http) {

  $scope.cards = [];

  function draw_canvas() {
    var data = [];
    for (card in $scope.cards) {
      values = $scope.cards[card].base_stats;
      if ($scope.cards[card].show) {
        data.push($scope.cards[card]);
      }
    }
    var max = 0;
    var card, values, value;
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

  $scope.max_card_length = 6;
  $scope.add_card = function (id) {
    if ($scope.cards.length < $scope.max_card_length) {
      var card;
      for (card in $scope.cards) {
        if ($scope.cards[card].id == id) {
          return;
        }
      }
      var newPokemon = {
        show:                   true,
        name:                   _poke_basic.id.name,
        type1:                  _poke_basic.id.type1,
        type2:                  _poke_basic.id.type2,
        ability1:               _ability[_poke_basic.id.ability1],
        ability2:               _ability[_poke_basic.id.ability2],
        ability3:               _ability[_poke_basic.id.ability3],
        apng:                   '',
        moves:                  [],
        level:                  100,
        nature:                 0,
        selected_ability_index: 1,
        IV:                     [31, 31, 31, 31, 31, 31],
        base_stat:              [0, 0, 0, 0, 0, 0],
        stats:                  [0, 0, 0, 0, 0, 0],
        item:                   {},
        base_stats:             _base_stats.id
      };
      $scope.cards.push(newPokemon);
      draw_canvas();
      animate();
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