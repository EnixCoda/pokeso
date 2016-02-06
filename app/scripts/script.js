"use strict";
var storageAddr          = "//poke.so/storage/apic/";
var serverAddr           = "//poke.so/server/";
var mainData             = null;
var learnSet             = null;
var learnSetDictMovePoke = {};
var learnSetDictPokeMove = {};
var pokemons             = null;
var statNames;

function animateAPNG () {
  APNG.ifNeeded().then(function () {
    var images = document.querySelectorAll(".apng-image");
    for (var i = 0; i < images.length; i++) {
      APNG.animateImage(images[i]);
    }
  });
}

function isMobile () {
  var userAgent = navigator.userAgent;
  var isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
  var isiPhone  = userAgent.indexOf("iPhone") > -1;
  return isiPhone || isAndroid;
}

var LoadController = {
  new: function () {
    var Quest             = {
      new: function () {
        var quest    = {};
        quest.status = "STAND BY";
        return quest;
      }
    };
    var loadController    = {};
    var scope             = null;
    var inits             = [];
    var quests            = {};
    quests["A"]           = Quest.new();
    quests["B"]           = Quest.new();
    loadController.status = "NORMAL";

    loadController.init = function ($scope) {
      scope         = $scope;
      scope.loading = true;
      return true;
    };

    loadController.toInit = function (init) {
      inits.push(init);
      if (loadController.status == "SUCCESS") {
        setTimeout(init, 0);
      }
    };

    loadController.questSucceeded = function (quest) {
      quests[quest].status = "SUCCESS";
      var allSuccess       = true;
      for (var q in quests) {
        if (quests.hasOwnProperty(q) && quests[q].status != "SUCCESS") {
          allSuccess = false;
          break;
        }
      }
      if (allSuccess) {
        loadController.status = "SUCCESS";
        extractData();
        var initing;
        while (initing = inits.pop()) {
          setTimeout(initing, 0);
        }
        scope.loading         = false;
      }
    };

    loadController.fail = function (quest) {
      quests[quest].status  = "ERROR";
      loadController.status = "ERROR";
    };

    loadController.setText = function (text) {
      scope.loadingText = text;
    };

    return loadController;
  }
};
var loadController = LoadController.new();

function loadData (scope) {
  if (loadController.status == "SUCCESS") {
    scope.pokemons   = mainData.pokemons;
    scope.statNames  = mainData.statNames;
    scope.natures    = mainData.natures;
    scope.abilities  = mainData.abilities;
    scope.types      = mainData.types;
    scope.kinds      = mainData.kinds;
    scope.typeColors = typeColors;
    return true;
  } else {
    return false;
  }
}

function extractData () {
  function extractMainData () {
    pokemons = [0];
    for (var i = 1; i < mainData.pokemons.length; i++) {
      var pokemon       = mainData.pokemons[i];
      pokemon.ability1  = mainData.abilities[pokemon.ability1];
      pokemon.ability2  = mainData.abilities[pokemon.ability2];
      pokemon.abilityd  = mainData.abilities[pokemon.abilityd];
      pokemon.type1     = mainData.types[pokemon.type1];
      pokemon.type2     = pokemon.type2 ? mainData.types[pokemon.type2] : {ID: 0, name: "无"};
      pokemon.birthStep = pokemon["birthStep"];
      pokemon.catchRate = pokemon["catchRate"];
      pokemon.dexInfo   = pokemon["dexInfo"];
      pokemon.weight    = pokemon["weight"];
      pokemon.height    = pokemon["height"];
      if (pokemon.ID < 721) pokemon.apng      = storageAddr + pokemon["ID"] + ".png";
    }
    for (i = 0; i < mainData.moves.length; i++) {
      var move = mainData.moves[i];
      if (!move) {
        continue;
      }
      move.kind = mainData.kinds[move.kind];
      move.type = mainData.types[move.type];
    }
    statNames = mainData.statNames;
  }

  function extractLearnSet () {
    for (var i = 0; i < learnSet.length; i++) {
      var pokemonID                = learnSet[i][0], moveID = learnSet[i][1];
      learnSetDictMovePoke[moveID] = learnSetDictMovePoke[moveID] ? learnSetDictMovePoke[moveID] : [];
      learnSetDictMovePoke[moveID].push(pokemonID);
      learnSetDictPokeMove[pokemonID] = learnSetDictPokeMove[pokemonID] ? learnSetDictPokeMove[pokemonID] : [];
      learnSetDictPokeMove[pokemonID].push(moveID);
    }
  }

  extractMainData();
  extractLearnSet();
}

var canvasColors = ("#4caf50 #ffc10d #f44336 #9c27b0 #2196f3 #888888").split(" ");

function drawCanvas (elementId, pokemons, max) {
  var i, j, x, y, v;
  var t                = 2 * Math.PI / 360;
  var newCanvas        = document.getElementById(elementId);
  newCanvas.width      = 512;
  newCanvas.height     = 512;
  var newCanvasContext = newCanvas.getContext("2d");
  var lengthLimit      = newCanvas.width * 88 / 100;

  // cross lines and border
  newCanvasContext.globalAlpha = 0.5;
  newCanvas.fillStyle          = "#aaaaaa";
  newCanvasContext.beginPath();
  for (i = 0; i < 3; i++) {
    x = Math.cos((-90 + i * 60) * t) * lengthLimit / 2 + newCanvas.width / 2;
    y = Math.sin((-90 + i * 60) * t) * lengthLimit / 2 + newCanvas.width / 2;
    newCanvasContext.moveTo(x, y);
    newCanvasContext.lineTo(newCanvas.width - x, newCanvas.width - y);
  }
  newCanvasContext.stroke();

  newCanvasContext.beginPath();
  newCanvasContext.arc(newCanvas.width / 2, newCanvas.width / 2, lengthLimit / 2, 0, 2 * Math.PI);
  newCanvasContext.stroke();

  //pokemon stats
  var baseStats, positions;
  for (i = 0; i < pokemons.length; i++) {
    newCanvasContext.fillStyle = canvasColors[i];
    baseStats                  = pokemons[i].baseStats;
    positions                  = [];
    for (j = 0; j < baseStats.length; j++) {
      v = parseInt(baseStats[j]);
      x = v / max * Math.cos((-90 + j * 60) * t) * lengthLimit / 2 + newCanvas.width / 2;
      y = v / max * Math.sin((-90 + j * 60) * t) * lengthLimit / 2 + newCanvas.width / 2;
      positions.push({x: x, y: y});
    }
    newCanvasContext.beginPath();
    newCanvasContext.moveTo(positions[5].x, positions[5].y);
    for (j = 0; j < 6; j++) {
      newCanvasContext.lineTo(positions[j].x, positions[j].y);
    }
    newCanvasContext.fill();
  }

  //write stat names
  newCanvasContext.fillStyle = "#000000";
  newCanvasContext.font      = "1.5em 黑体";
  var name;
  for (i = 0; i < statNames.length; i++) {
    name = statNames[i];
    x    = Math.cos((-90 + i * 60) * t) * (lengthLimit * (1.06 + 0.03)) / 2 + newCanvas.width / 2;
    y    = Math.sin((-90 + i * 60) * t) * (lengthLimit * (1.06 + 0.03)) / 2 + newCanvas.width / 2;
    x -= newCanvasContext.measureText(name).width / 2;
    y += 5;
    newCanvasContext.fillText(name, x, y);
  }

  //ruler
  newCanvasContext.globalAlpha = 0.8;
  newCanvasContext.fillStyle   = "#ffffff";
  var mark                     = 30;
  newCanvasContext.fillText("0", newCanvas.width / 2, newCanvas.width / 2 + lengthLimit / 25);
  while (mark < max) {
    for (i = 0; i < 6; i++) {
      newCanvasContext.beginPath();
      newCanvasContext.arc(newCanvas.width / 2, newCanvas.width / 2, lengthLimit / 2 * mark / max, (i * 60 - 30) * t - 0.03, (i * 60 - 30) * t + 0.03);
      newCanvasContext.stroke();
    }
    newCanvasContext.fillText(mark.toString(), lengthLimit / 2 * mark / max * Math.cos(-Math.PI / 6) + newCanvas.width / 2, lengthLimit / 2 * mark / max * Math.sin(-Math.PI / 6) + newCanvas.width / 2 + lengthLimit / 25);
    mark += 30;
  }
}

var typeColors = ("#ffffff #a8a878 #c03028 #a890f0 #a040a0 #e0c068 #b8a038 #a8b820 #705898 #b8b8d0 #f08030 #6890f0 #78c850 #f8d030 #f85888 #98d8d8 #7038f8 #705848 #ee99ac").split(" ");

var loadGenerationSearcher = function ($scope) {
  var GenerationSearcher = {
    new: function () {
      var genStarts   = [1, 1, 152, 252, 387, 494, 650, 722];
      var generation  = 0;
      var generations = ("全部 第一世代 第二世代 第三世代 第四世代 第五世代 第六世代")
        .split(" ")
        .map(function (cur, index) {
          return {
            index: index,
            name:  cur
          };
        });

      var generationIndex = [[], [], [], [], [], [], [], []];//[1~721], [1~151], [152~251], ...
      var i, j;
      for (i = 1; i < 721; i++) {
        generationIndex[0].push(i);
      }
      for (i = 1; i < genStarts.length - 1; i++) {
        for (j = genStarts[i]; j < genStarts[i + 1]; j++) {
          generationIndex[i].push(j);
        }
      }

      var search = function (searchKey, generation) {
        var i, key = searchKey, searchedPokemons = [];
        if (key === "") {
          for (i = 0; i < generationIndex[generation].length; i++) {
            searchedPokemons.push(mainData.pokemons[generationIndex[generation][i]]);
          }
        } else {
          var thisPokemon;
          for (i = 0; i < generationIndex[generation].length; i++) {
            thisPokemon = mainData.pokemons[generationIndex[generation][i]];
            if (thisPokemon.ID.indexOf(key) == 0 || thisPokemon.name.indexOf(key) > -1) {
              searchedPokemons.push(thisPokemon);
            }
          }
        }
        return searchedPokemons;
      };

      var searcher             = {};
      searcher.generation      = generation;
      searcher.generations     = generations;
      searcher.generationIndex = generationIndex;
      searcher.search          = search;
      return searcher;
    }
  };

  var generationSearcher     = GenerationSearcher.new();
  $scope.generationIndex     = generationSearcher.generationIndex;
  $scope.generation          = generationSearcher.generation;
  $scope.generations         = generationSearcher.generations;
  $scope.searchKey           = "";
  $scope.searchInGenerations = function (searchKey, generation) {
    $scope.searchedPokemons = generationSearcher.search(searchKey, generation);
  };
  $scope.searchInGenerations("", 0);
};

function isNumber (sth) {
  return parseFloat(sth) == sth || parseInt(sth) == sth;
}

var MoveFilter = {
  new: function () {
    var moveFilter           = {
      powerIndeterminable:    false,
      powerMin:               0,
      powerMax:               250,
      accuracyIndeterminable: false,
      accuracyMin:            0,
      accuracyMax:            100,
      ppMin:                  0,
      ppMax:                  50,
      selectedTypeID:         undefined,
      selectedKindID:         undefined,
      definePokeType:         undefined,
      selectedPokeType1:      undefined,
      selectedPokeType2:      undefined,
      definePokeAbility:      undefined,
      selectedPokeAbility:    undefined
    };
    moveFilter.searchMove    = function () {
      var searchResultMoves = [], thisMove;
      for (var i = 0; i < mainData.moves.length; i++) {
        thisMove = mainData.moves[i];
        if (!thisMove) {continue;} //invalid move, e.g: 0 for moves[0]
        if (moveFilter.selectedTypeID && (moveFilter.selectedTypeID - thisMove.type.ID) * moveFilter.selectedTypeID !== 0) {continue;}
        if (moveFilter.selectedKindID && (moveFilter.selectedKindID - thisMove.kind.ID) * moveFilter.selectedKindID !== 0) {continue;}
        if (moveFilter.powerIndeterminable && !(!isNumber(thisMove.power))) {continue;}
        if (!moveFilter.powerIndeterminable && !(isNumber(thisMove.power) && moveFilter.powerMin <= thisMove.power && thisMove.power <= moveFilter.powerMax)) {continue;}
        if (moveFilter.accuracyIndeterminable && !(!isNumber(thisMove.accuracy))) {continue;}
        if (!moveFilter.accuracyIndeterminable && !(isNumber(thisMove.accuracy) && moveFilter.accuracyMin <= thisMove.accuracy && thisMove.accuracy <= moveFilter.accuracyMax)) {continue;}
        if (!(moveFilter.ppMin <= thisMove.PP && thisMove.PP <= moveFilter.ppMax)) {continue;}
        searchResultMoves.push(thisMove);
      }
      return searchResultMoves;
    };
    moveFilter.detectOverlap = function () {
      moveFilter.powerMin    = Math.min(moveFilter.powerMax, moveFilter.powerMin);
      moveFilter.accuracyMin = Math.min(moveFilter.accuracyMax, moveFilter.accuracyMin);
      moveFilter.ppMin       = Math.min(moveFilter.ppMax, moveFilter.ppMin);
    };
    return moveFilter;
  }
};

function inArray (value, array) {
  if (array instanceof Array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == value) {
        return i;
      }
    }
  }
  return -1;
}

function showToast ($mdToast, toastText, status) {
  $mdToast.show(
    $mdToast.simple()
      .textContent(toastText)
      .position('top left')
      .hideDelay(1000)
      .theme(status + "-toast")
  );
}