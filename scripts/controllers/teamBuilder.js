"use strict";

angular.module('pokesoApp').controller('TeamBuilderController', function ($scope, $http, $mdBottomSheet) {
  var init = function () {
    loadData($scope);
    loadGenerationSearcher($scope);

    var moveFilter    = MoveFilter.new();
    $scope.moveFilter = moveFilter;

    $scope.detectOverlap = moveFilter.detectOverlap;

    $scope.searchMove = function () {
      var searchResultMoves    = moveFilter.searchMove();
      $scope.searchResultMoves = [];
      var movesThisPokemonCanLearn = learnSetDictPokeMove[parseInt($scope.current.ID)];
      for (var i = 0; i < searchResultMoves.length; i++) {
        if (inArray(searchResultMoves[i].ID, movesThisPokemonCanLearn) != -1) {
          $scope.searchResultMoves.push(searchResultMoves[i]);
        }
      }
    };

    $scope.team = [];

    $scope.sexes = ['无性别', '♂', '♀', '♂♂', '♀♀'];
    function changeSex (sex) {
      if (sex > 2) {
        return sex;
      }
      return 3 - sex;
    }

    $scope.calculate = function (pokemon) {
      if (pokemon.id === '292') {
        pokemon.stats[0] = 1;
      } else {
        pokemon.stats[0] = Math.floor((pokemon.IV[0] + pokemon.baseStats[0] * 2 + pokemon.baseStat[0] / 4) * pokemon.level / 100 + 10 + pokemon.level); // HP
      }
      for (var i = 1; i < 6; i++) {
        pokemon.stats[i] = Math.floor(((pokemon.IV[i] + pokemon.baseStats[i] * 2 + pokemon.baseStat[i] / 4) * pokemon.level / 100 + 5) * $scope.natures[pokemon.natureID].value[i]);  //ATK//DEF//SPATK//SPDEF//SPD
      }
    };

    $scope.levelChanged = function () {
      if (isNumber($scope.current.level)) {
        if ($scope.current.level < 5) $scope.current.level = 5;
        if ($scope.current.level > 100) $scope.current.level = 100;
        $scope.calculate($scope.current);
      }
    };

    $scope.editPokemon = function (ID) {
      ID = parseInt(ID);
      if ($scope.current && $scope.current.ID == ID) {
        return;
      }
      $scope.searchResultMoves = [];

      for (var i = 0; i < $scope.team.length; i++) {
        if ($scope.team[i].ID == ID) {
          $scope.current = $scope.team[i];
          animateAPNG();
          return;
        }
      }

      if ($scope.team.length === 6) {
        return;
      }

      var newPokemon = {
        ID:                   $scope.pokemons[ID].ID,
        name:                 $scope.pokemons[ID].name,
        apng:                 $scope.pokemons[ID].apng,
        ability1:             $scope.pokemons[ID].ability1,
        ability2:             $scope.pokemons[ID].ability2,
        abilityd:             $scope.pokemons[ID].abilityd,
        selectedAbilityIndex: undefined,
        type1:                $scope.pokemons[ID].type1,
        type2:                $scope.pokemons[ID].type2,
        baseStats:            $scope.pokemons[ID].baseStats,
        baseStat:             [0, 0, 0, 0, 0, 0],
        IV:                   [31, 31, 31, 31, 31, 31],
        stats:                [0, 0, 0, 0, 0, 0],
        level:                100,
        natureID:             0,
        sex:                  0,
        moves:                []
      };
      $scope.team.push(newPokemon);
      $scope.current = newPokemon;
      $scope.calculate(newPokemon);
      animateAPNG();
    };

    $scope.removeFromTeam = function (index) {
      $scope.team.splice(index, 1);
    };

    $scope.removeCurrent = function () {
      $scope.team.splice(inArray($scope.current, $scope.team), 1);
      $scope.current           = $scope.team.length ? $scope.team[$scope.team.length - 1] : undefined;
      $scope.searchResultMoves = [];
      animateAPNG();
    };

    $scope.addMove = function (move) {
      if (!$scope.current || inArray(move, $scope.current.moves) >= 0 || $scope.current.moves.length === 4) {
        return;
      }
      $scope.current.moves.push(move);
    };

    $scope.removeMove = function (index) {
      $scope.current.moves.splice(index, 1);
    };

    $scope.serial = {text: ''};

    $scope.save = function () {
      if ($scope.team.length > 0) {
        $scope.serial.text = $hashdown.encode(JSON.stringify($scope.team), {codec: $hashdown.TADPOLE});
      }
    };

    $scope.load = function () {
      try {
        $scope.team = JSON.parse($hashdown.decode($scope.serial.text).text);
        for (var i = 0; i < $scope.team.length; i++) {
          $scope.calculate($scope.team[i]);
        }
        $scope.current = $scope.team[0];
      } catch (err) {
        alert('无法解析的编码');
        //TODO: set warn message
      }
      animateAPNG();
    };

    //open stat editor
    $scope.openEditor = function ($event) {
      $mdBottomSheet.show({
        locals:        {
          thisPokemon: $scope.current
        },
        templateUrl:   'views/stat_editor.html',
        scope:         $scope,
        controller:    'StatEditorController',
        targetEvent:   $event,
        preserveScope: true
        //parent:        angular.element(document.getElementById('editorWindow'))
      });
    };

    $scope.$apply();
  };
  loadController.toInit(init);
});

angular.module('pokesoApp').controller('StatEditorController', function ($scope) {
  $scope.clearThisInput = function (area, index) {
    area[index] = area[index] === 0 ? null : area[index];
  };

  $scope.onBlur = function (area, index) {
    area[index] = area[index] === null ? 0 : area[index];
    $scope.calculate($scope.current);
  };

  $scope.statChange = function (area, index) {
    if (area[index] === null) {
      return;
    }
    if (area[index] > 252) {
      area[index] = 252;
      showToast($mdToast, '单项努力值不能超过252!', 'error');
    }
    if (area[index] < 0) {
      area[index] = 0;
      showToast($mdToast, '不能为负数!', 'error');
    }
    var sum = area.reduce(function (prev, current) {
      return prev + current;
    });
    if (sum > 510) {
      area[index] = 0;
      showToast($mdToast, '努力值总和不能超过510!', 'error');
    }
    $scope.calculate($scope.current);
  };

  $scope.calculate($scope.current);
});