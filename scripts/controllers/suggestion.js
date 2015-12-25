"use strict";
/**
* @ngdoc function
* @name pokesoApp.controller: SuggestionController
* @description
* # SuggestionController
* Controller of the pokesoApp
*/
angular.module('pokesoApp').controller('SuggestionController', function ($scope, $http) {
  $scope.title = '';
  $scope.name = '';
  $scope.content = '';
  $scope.state = '';
  $scope.state_color = '#f88';
  $scope.fontsize = 15;
  $scope.editFontSize = function (i) {
    if (11 < $scope.fontsize + i && $scope.fontsize + i < 27) {
      $scope.fontsize += i;
    }
  };

  $scope.submit = function () {
    $scope.state_color = '#f88';
    $scope.state = '正在提交';
    if ($scope.title !== '' || $scope.content !== '') {
      if ($scope.title.length < 5 && $scope.content.length < 5) {
        $scope.state = '内容过短';
        return;
      }
      var data = {
        title: $scope.title,
        name: $scope.name,
        content: $scope.content
      };
      $http.post(php_prefix + '/suggestion.php', data)
        .then(function () {
          $scope.state = '提交成功';
          $scope.state_color = '#8c8';
        }, function () {
          $scope.state = '提交失败, 请重试';
        });
    } else {
      $scope.state = '内容为空';
    }
  };
});