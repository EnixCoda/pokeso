'use strict';

angular.module('pokesoApp')
  .directive('pmInList', function () {
    return {
      templateUrl: 'views/directives/pmInList.html',
      restrict: 'E'
    };
  })
  .directive('moveInList', function () {
    return {
      templateUrl: 'views/directives/moveInList.html',
      restrict: 'E'
    };
  })
  .directive('moveSelector', function () {
    return {
      templateUrl: 'views/directives/moveSelector.html',
      restrict: 'E'
    };
  })
  .directive('pokeCanLearn', function () {
    return {
      templateUrl: 'views/directives/pokeCanLearn.html',
      restrict: 'E'
    };
  })
  .directive('pmSelector', function () {
    return {
      templateUrl: 'views/directives/pmSelector.html',
      restrict: 'E'
    };
  })
  .directive('itemSelector', function () {
    return {
      templateUrl: 'views/directives/itemSelector.html',
      restrict: 'E'
    };
  })
  .directive('pmInTeam', function () {
    return {
      templateUrl: 'views/directives/pmInTeam.html',
      restrict: 'E'
    };
  })
  .directive('curEditing', function () {
    return {
      templateUrl: 'views/directives/curEditing.html',
      restrict: 'E'
    };
  })
  .directive('typeWrapper', function () {
    return {
      templateUrl: 'views/directives/typeWrapper.html',
      scope: {
        type: '=',
        colors: '='
      },
      restrict: 'E'
    };
  });