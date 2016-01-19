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
  var newLearnSet = [];
  for (var i = 0; i < learnSet.length; i++) {
    var learn = learnSet[i];
    newLearnSet.push({'learnerID': learn[0], 'moveID': learn[1]});
    if (!learnSet_move_poke[learn[1]]) {
      learnSet_move_poke[learn[1]] = [];
    }
    learnSet_move_poke[learn[1]].push(learn[0]);
    if (!learnSet_poke_move[learn[0]]) {
      learnSet_poke_move[learn[0]] = [];
    }
    learnSet_poke_move[learn[0]].push(learn[1]);
  }
  learnSet = newLearnSet;
}

function draw_canvas (elementId, data, max) {
  var canvas_colors = ('#4caf50 #ffc10d #f44336 #9c27b0 #2196f3 #888888').split(' ');
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

