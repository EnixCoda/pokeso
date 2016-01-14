"use strict";
var storageAddr = '//poke.so/storage/apic/';
var serverAddr = '//poke.so/server/'

function animate () {
  APNG.ifNeeded().then(function () {
    var images = document.querySelectorAll(".apng-image");
    for (var i = 0; i < images.length; i++) {
      APNG.animateImage(images[i]);
    }
  });
}

function inArray (item, array) {
  for (var i = 0; i < array.length; i++) {
    if (item == array[i]) {
      return true;
    }
  }
  return false;
}

Array.prototype.contain = function(item) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == item) {
      return true;
    }
  }
  return false;
}

var t0 = Date.now();

var _ability           = metadata._ability;
var _base_stat         = metadata._base_stat;
var _base_stats        = metadata._base_stats;
var _egg_group         = metadata._egg_group;
var _evolve            = metadata._evolve;
var _learn_set_        = metadata._learn_set;
var _move              = metadata._move;
var _nature            = metadata._nature;
var _poke_basic        = metadata._poke_basic;
var _poke_egg_group    = metadata._poke_egg_group;
var _poke_other        = metadata._poke_other;
var _technical_machine = metadata._technical_machine;
var _type              = metadata._type;
var _type_vs_type      = metadata._type_vs_type;

var _ability = _ability.reduce(
  function(previousValue, currentValue, index, array){
    previousValue[currentValue[0]] = {
      id: currentValue[0],
      name: currentValue[1],
      name_e: currentValue[2],
      name_j: currentValue[3],
      description: currentValue[4]
    }
    return previousValue;
  },
  {}
);

var _base_stat = _base_stat.reduce(
  function(previousValue, currentValue, index, array){
    previousValue[currentValue[0]] = [
      parseInt(currentValue[1]),
      parseInt(currentValue[2]),
      parseInt(currentValue[3]),
      parseInt(currentValue[4]),
      parseInt(currentValue[5]),
      parseInt(currentValue[6])
    ];
    return previousValue;
  },
  {}
);

var _base_stats = _base_stats.reduce(
  function(previousValue, currentValue, index, array){
    previousValue[currentValue[0]] = [
      parseInt(currentValue[1]),
      parseInt(currentValue[2]),
      parseInt(currentValue[3]),
      parseInt(currentValue[4]),
      parseInt(currentValue[5]),
      parseInt(currentValue[6])
    ];
    return previousValue;
  },
  {}
);

var _learn_set_move_to_poke = {};
var _learn_set              = {};
var poke_id, move_id;
for (var i = 0; i < _learn_set_.length; i++) {
  poke_id = _learn_set_[i][0];
  move_id = _learn_set_[i][1];
  if (_learn_set[poke_id] == undefined) {
    _learn_set[poke_id] = [];
  }
  _learn_set[poke_id].push(move_id);
  if (_learn_set_move_to_poke[move_id] == undefined) {
    _learn_set_move_to_poke[move_id] = [];
  }
  _learn_set_move_to_poke[move_id].push(poke_id);
}

var _move = _move.reduce(
  function(previousValue, currentValue, index, array){
    previousValue.push({
      id:          currentValue[0],
      name:        currentValue[1],
      name_e:      currentValue[2],
      name_j:      currentValue[3],
      type:        currentValue[4],
      kind:        currentValue[5],
      power:       currentValue[6],
      accuracy:    currentValue[7],
      pp:          currentValue[8],
      priority:    currentValue[9],
      description: currentValue[10]
    })
    return previousValue;
  },
  []
);

var _poke_other = _poke_other.reduce(
  function (previousValue, currentValue) {
    previousValue[currentValue[0]] = {
      catch_rate: currentValue[1],
      sex_rate:   currentValue[2],
      birth_step: currentValue[3],
      height:     currentValue[4],
      weight:     currentValue[5]
    }
    return previousValue;
  },
  {}
);

var _pokemons = _poke_basic.reduce(
  function(previousValue, currentValue){
    var id = currentValue[0];
    previousValue[id] = {
      id:       id,
      name:     currentValue[1],
      name_e:   currentValue[2],
      name_j:   currentValue[3],
      type1:    currentValue[4],
      type2:    currentValue[5],
      ability1: currentValue[6],
      ability2: currentValue[7],
      ability3: currentValue[8],
      abilities: (
        function () {
          var abilities = [];
          var $ = ([
            _ability[currentValue[6]],
            _ability[currentValue[7]],
            _ability[currentValue[8]]
          ]).map(
            function (currentValue) {
              if (currentValue != undefined) abilities.push(currentValue);
            }
          )
          return abilities;
        } ()
      ),
      base_stats: _base_stats[id],
      base_stat:  _base_stat[id],
      catch_rate: _poke_other[id] ? _poke_other[id].catch_rate : undefined,
      sex_rate:   _poke_other[id] ? _poke_other[id].sex_rate   : undefined,
      birth_step: _poke_other[id] ? _poke_other[id].birth_step : undefined,
      height:     _poke_other[id] ? _poke_other[id].height     : undefined,
      weight:     _poke_other[id] ? _poke_other[id].weight     : undefined
    }
    return previousValue;
  },
  {}
);

var _types = ('任意 普通 格斗 飞行 毒 地面 岩石 虫 幽灵 钢 火 水 草 电 超能力 冰 龙 恶 妖精').split(' ')
  .map(function (cur, index) {
    return {
      id: index,
      name: cur
    };
  });

var _kinds = ('任意 物理 特殊 变化').split(' ')
  .map(function (cur, index) {
    return {
      id: index,
      name: cur
    };
  });

var _natures = [
  {name: '努力', value: [ 1,    1,    1,    1,    1,    1]},
  {name: '孤独', value: [ 1,  1.1,  0.9,    1,    1,    1]},
  {name: '勇敢', value: [ 1,  1.1,    1,    1,    1,  0.9]},
  {name: '固执', value: [ 1,  1.1,    1,  0.9,    1,    1]},
  {name: '调皮', value: [ 1,  1.1,    1,    1,  0.9,    1]},
  {name: '大胆', value: [ 1,    1,  1.1,    1,    1,    1]},
  {name: '直率', value: [ 1,    1,    1,    1,    1,    1]},
  {name: '悠闲', value: [ 1,    1,  1.1,    1,    1,  0.9]},
  {name: '淘气', value: [ 1,    1,  1.1,  0.9,    1,    1]},
  {name: '乐天', value: [ 1,    1,  1.1,    1,  0.9,    1]},
  {name: '胆小', value: [ 1,  0.9,    1,    1,    1,  1.1]},
  {name: '急躁', value: [ 1,    1,  0.9,    1,    1,  1.1]},
  {name: '认真', value: [ 1,    1,    1,    1,    1,    1]},
  {name: '开朗', value: [ 1,    1,    1,  0.9,    1,  1.1]},
  {name: '天真', value: [ 1,    1,    1,    1,  0.9,  1.1]},
  {name: '保守', value: [ 1,  0.9,    1,  1.1,    1,    1]},
  {name: '稳重', value: [ 1,    1,  0.9,  1.1,    1,    1]},
  {name: '冷静', value: [ 1,    1,    1,  1.1,    1,  0.9]},
  {name: '害羞', value: [ 1,    1,    1,    1,    1,    1]},
  {name: '马虎', value: [ 1,    1,    1,  1.1,  0.9,    1]},
  {name: '沉着', value: [ 1,  0.9,    1,    1,  1.1,    1]},
  {name: '温顺', value: [ 1,    1,  0.9,    1,  1.1,    1]},
  {name: '狂妄', value: [ 1,    1,    1,    2,  1.1,  0.9]},
  {name: '慎重', value: [ 1,    1,    1,  0.9,  1.1,    1]},
  {name: '浮躁', value: [ 1,    1,    1,    1,    1,    1]}
];

var _stats_names = ['HP', '攻击', '防御', '特攻', '特防', '速度'];

var t1 = Date.now();

alert(t1-t0);