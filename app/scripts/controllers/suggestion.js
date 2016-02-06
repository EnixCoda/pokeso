"use strict";

angular.module('pokesoApp').controller('SuggestionController', function ($scope, $http, $mdToast) {
  var suggestion    = {
    title:   '',
    name:    '',
    content: ''
  };
  $scope.suggestion = suggestion;

  $scope.submit = function () {
    if (suggestion.title.length < 5 && suggestion.content.length < 5) {
      showToast($mdToast, '内容过短', 'warning');
    } else {
      $http.post(serverAddr + '/suggest.php', suggestion)
        .then(function () {
          showToast($mdToast, '提交成功', 'success');
        }, function () {
          showToast($mdToast, '提交失败', 'error');
        });
    }
  };
});