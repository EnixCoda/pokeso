"use strict";

angular.module('pokesoApp').controller('SuggestionController', function ($scope, $http) {
  $scope.title        = '';
  $scope.name         = '';
  $scope.content      = '';
  $scope.state        = '';
  $scope.stateColor   = '#f88';

  $scope.submit = function () {
    $scope.stateColor = '#f88';
    $scope.state      = '正在提交';
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
      $http.post(serverAddr + '/suggestion.php', data)
        .then(function () {
          $scope.state      = '提交成功';
          $scope.stateColor = '#8c8';
        }, function () {
          $scope.state = '提交失败, 请重试';
        });
    } else {
      $scope.state = '内容为空';
    }
  };
});