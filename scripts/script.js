"use strict";
var storageAddr = '//poke.so/storage/apic/';
var serverAddr = '//poke.so/server/';
var mainData = null;
var otherData = null;
var learnSet = null;
var learnSet_move_poke = {};
var learnSet_poke_move = {};
var pokemons = null;
var stat_names;

function animate () {
  APNG.ifNeeded().then(function () {
    var images = document.querySelectorAll(".apng-image");
    for (var i = 0; i < images.length; i++) {
      APNG.animateImage(images[i]);
    }
  });
}

function isMobile() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  var isiPhone = u.indexOf('iPhone') > -1;
  return isiPhone || isAndroid;
}

var Quest = {
  new: function () {
    var quest = {};
    quest.status = "STAND BY";
    return quest;
  }
};
var LoadController = {
  new: function () {
    var loadController = {};
    var scope;
    var quests = [];
    quests["A"] = Quest.new();
    quests["B"] = Quest.new();
    quests["C"] = Quest.new();
    var inits = [];
    loadController.status = 'NORMAL';
    loadController.init = function ($scope) {
      scope = $scope;
      return true;
    };
    loadController.toInit = function (init) {
      inits.push(init);
      if (loadController.status == 'SUCCESS') {
        setTimeout(init, 0);
      }
    };
    loadController.questSucceeded = function (quest) {
      quests[quest].status = 'SUCCESS';
      var allSuccess = true;
      for (var _quest_ in quests) {
        if (quests[_quest_].status != 'SUCCESS') {
          allSuccess = false;
          break;
        }
      }
      if (allSuccess) {
        scope.loading = false;
        loadController.status = 'SUCCESS';
        extractData();
        extractLearnSet();
        for (var i = 0; i < inits.length; i++) {
          setTimeout(inits[i], 0);
        }
      }
    };
    loadController.fail = function (quest) {
      quests[quest].status = 'ERROR';
      loadController.status = 'ERROR';
    };
    loadController.setText = function (text) {
      scope.loadingText = text;
    };
    return loadController;
  }
};
var loadController = LoadController.new();

function loadData ($scope) {
  if (loadController.status == 'SUCCESS') {
    $scope.pokemons   = pokemons;
    $scope.stat_names = mainData.stat_names;
    $scope.natures    = mainData.natures;
    $scope.abilities  = mainData.abilities;
    $scope.types      = mainData.types;
    $scope.kinds      = mainData.kinds;
    return true;
  } else {
    return false;
  }
}

function extractData () {
  if (mainData.pokemons.length == otherData.pokemons.length) {
    pokemons = [0];
    var length = mainData.pokemons.length;
    for (var i = 1; i < length; i++) {
      var pokemon = mainData.pokemons[i];
      pokemon.ability1 = mainData.abilities[pokemon.ability1];
      pokemon.ability2 = mainData.abilities[pokemon.ability2];
      pokemon.abilityd = mainData.abilities[pokemon.abilityd];
      pokemon.type1    = mainData.types[pokemon.type1];
      pokemon.type2    = mainData.types[pokemon.type2];
      pokemon.birth_step = otherData.pokemons[i].birthStep;
      pokemon.catch_rate = otherData.pokemons[i].catchRate;
      pokemon.dexInfo    = otherData.pokemons[i].dexInfo;
      pokemon.weight     = otherData.pokemons[i].weight;
      pokemon.height     = otherData.pokemons[i].height;
      pokemon.apng       = storageAddr + pokemon.ID + '.png';
      pokemons.push(pokemon);
    }
    for (var i = 0; i < mainData.moves.length; i++) {
      var move = mainData.moves[i];
      if (parseInt(move) == move) {
        continue;
      }
      move.kind = mainData.kinds[move.kind];
      move.type = mainData.types[move.type];
    }
    stat_names = mainData.stat_names;
  }
}

function extractLearnSet () {
  for (var i = 0; i < learnSet.length; i++) {
    var learn = learnSet[i];
    if (!learnSet_move_poke[learn[1]]) {
      learnSet_move_poke[learn[1]] = [];
    }
    learnSet_move_poke[learn[1]].push(learn[0]);
    if (!learnSet_poke_move[learn[0]]) {
      learnSet_poke_move[learn[0]] = [];
    }
    learnSet_poke_move[learn[0]].push(learn[1]);
  }
}

var canvas_colors = ('#4caf50 #ffc10d #f44336 #9c27b0 #2196f3 #888888').split(' ');
function draw_canvas (elementId, data, max) {
  var x, y, v;
  var t = 0.017453293;

  var new_canvas = document.getElementById(elementId);
  new_canvas.width = 512;
  new_canvas.height = 512;
  var new_canvas_context = new_canvas.getContext('2d');
  new_canvas_context.globalAlpha = 0.5;
  new_canvas.fillStyle = '#aaaaaa';

  var width = new_canvas.width * 88 / 100;
  //cross lines
  new_canvas_context.beginPath();
  for (var i = 0; i < 3; i++) {
    x = Math.cos((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
    y = Math.sin((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
    new_canvas_context.moveTo(x, y);
    new_canvas_context.lineTo(new_canvas.width - x, new_canvas.width - y);
  }
  new_canvas_context.stroke();

  //out circle
  new_canvas_context.beginPath();
  new_canvas_context.arc(new_canvas.width / 2, new_canvas.width / 2, width / 2, 0, 2 * Math.PI);
  new_canvas_context.stroke();

  //pokemon stats
  var base_stats;
  var positions;
  for (var index = 0; index < data.length; index++) {
    new_canvas_context.fillStyle = canvas_colors[index];
    base_stats = data[index].base_stats;
    positions = [];
    for (var i = 0; i < base_stats.length; i++) {
      v = parseInt(base_stats[i], 10);
      x = v / max * Math.cos((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
      y = v / max * Math.sin((-90 + i * 60) * t) * width / 2 + new_canvas.width / 2;
      positions.push({x: x, y: y});
    }
    new_canvas_context.beginPath();
    new_canvas_context.moveTo(positions[0].x, positions[0].y);
    for (var i = 1; i <= 6; i++) {
      new_canvas_context.lineTo(positions[i % 6].x, positions[i % 6].y);
    }
    new_canvas_context.fill();
  }

  //write stat names
  var name;
  new_canvas_context.fillStyle = "#000000";
  new_canvas_context.font = '1.5em 黑体';
  for (var i = 0; i < stat_names.length; i++) {
    name = stat_names[i];
    x = Math.cos((-90 + i * 60) * t) * (width * (1.06 + 0.03)) / 2 + new_canvas.width / 2;
    y = Math.sin((-90 + i * 60) * t) * (width * (1.06 + 0.03)) / 2 + new_canvas.width / 2;
    x -= new_canvas_context.measureText(name).width / 2;
    y += 5;
    new_canvas_context.fillText(name, x, y);
  }

  //ruler
  new_canvas_context.globalAlpha = 0.8;
  new_canvas_context.fillStyle = "#ffffff";
  var r = 30;
  new_canvas_context.fillText('0', new_canvas.width / 2, new_canvas.width / 2 + width / 25);

  //inner circles
  while (r < max) {
    for (var i = 0; i < 6; i++) {
      new_canvas_context.beginPath();
      new_canvas_context.arc(new_canvas.width / 2, new_canvas.width / 2, width / 2 * r / max, (i * 60 - 30) * t - 0.03, (i * 60 - 30) * t + 0.03);
      new_canvas_context.stroke();
    }
    new_canvas_context.fillText(r.toString(), width / 2 * r / max * Math.cos(-Math.PI / 6) + new_canvas.width / 2, width / 2 * r / max * Math.sin(-Math.PI / 6) + new_canvas.width / 2 + width / 25);
    r += 30;
  }
}

var typeColors = ('#ffffff #a8a878 #c03028 #a890f0 #a040a0 #e0c068 #b8a038 #a8b820 #705898 #b8b8d0 #f08030 #6890f0 #78c850 #f8d030 #f85888 #98d8d8 #7038f8 #705848 #ee99ac').split(' ')
    .map(function (cur) {
      return {
        'background-color': cur
      };
    });

var loadGenerationSearcher = function ($scope) {
  var GenerationSearcher = {
    new: function () {
      var searcher = {};
      var start_gen = [0, 1, 152, 252, 387, 494, 650, 721];
      var generation = 0;
      var generations = ('全部 第一世代 第二世代 第三世代 第四世代 第五世代 第六世代').split(' ')
          .map(function (cur, index) {
            return {
              index: index,
              name: cur
            };
          });
      var generation_index = [[], [], [], [], [], [], [], []];//[1~721], [1~151], [152~251], ...
      (function generate_generations() {
        var i;
        for (i = 1; i < 721; i++) {
          generation_index[0].push(i);
        }
        for (i = 1; i < start_gen.length - 1; i++) {
          for (var j = start_gen[i]; j < start_gen[i + 1]; j++) {
            generation_index[i].push(j);
          }
        }
      })();
      var search = function (search_key, generation) {
        var i, key = search_key;
        var searched_pokemons = [];
        if (key === "") {
          for (i = 0; i < generation_index[generation].length; i++) {
            searched_pokemons.push(mainData.pokemons[generation_index[generation][i]]);
          }
        } else {
          var this_poke;
          for (i = 0; i < generation_index[generation].length; i++) {
            this_poke = mainData.pokemons[generation_index[generation][i]];
            if (this_poke.ID.indexOf(key) == 0 || this_poke.name.indexOf(key) > -1) {
              searched_pokemons.push(this_poke);
            }
          }
        }
        return searched_pokemons;
      };
      searcher.generations = generations;
      searcher.generation_index = generation_index;
      searcher.search = search;
      return searcher;
    }
  };
  var generation_searcher = GenerationSearcher.new();
  $scope.generation_index = generation_searcher.generation_index;
  $scope.search_in_generations = function (search_key, generation) {
    $scope.searched_pokemons = generation_searcher.search(search_key, generation);
  };
  $scope.generations = generation_searcher.generations;
  $scope.search_key = '';
  $scope.search_in_generations('', 0);
};