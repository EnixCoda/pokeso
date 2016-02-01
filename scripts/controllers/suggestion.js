"use strict";

angular.module('pokesoApp').controller('SuggestionController', function ($scope, $http, $mdToast) {
  var suggestion    = {
    title:   '',
    name:    '',
    content: ''
  };
  $scope.suggestion = suggestion;

  $scope.submit = function () {
    function showToast (toastText, status) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(toastText)
          .position('bottom right')
          .hideDelay(1000)
          .theme(status + "-toast")
      );
    }

    if (suggestion.title.length < 5 && suggestion.content.length < 5) {
      showToast('内容过短', 'warning');
    } else {
      $http.post(serverAddr + '/suggest.php', suggestion)
        .then(function () {
          showToast('提交成功', 'success');
        }, function () {
          showToast('提交失败', 'error');
        });
    }
  };
});