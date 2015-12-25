'use strict';

/**
 * @ngdoc overview
 * @name pokesoApp
 * @description
 * # pokesoApp
 *
 * Main module of the application.
 */
angular
  .module('pokesoApp', [
    'ngAnimate',
    'ngAria',
    'ngRoute',
    'ngMaterial',
    'ui.sortable'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
      .when('/about', {
        controller: 'AboutController',
        templateUrl: 'views/about.html'
      })
      .when('/skim', {
        controller: 'SkimController',
        templateUrl: 'views/skim.html'
      })
      .when('/moves', {
        controller: 'MovesController',
        templateUrl: 'views/moves.html'
      })
      .when('/base_stats', {
        controller: 'BaseStatsController',
        templateUrl: 'views/base_stats.html'
      })
      .when('/battle_emulate', {
        redirectTo: '/constructing',
        templateUrl: 'views/battle_emulate.html'
      })
      .when('/constructing', {
        templateUrl: 'views/constructing.html'
      })
      .when('/suggestion', {
        templateUrl: 'views/suggestion.html',
        controller: 'SuggestionController'
      })
      .when('/team_builder', {
        templateUrl: 'views/team_builder.html',
        controller: 'TeamBuilderController'
      })
      .when('/IV_calculator', {
        templateUrl: 'views/IVCalculator.html'
      })
      .when('/damage_calculator', {
        templateUrl: 'views/damageCalculator.html'
      })
      .when('/404', {
        templateUrl: '404.html'
      })
      .otherwise({
        redirectTo: '/404'
      });
  })
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange');
  });
