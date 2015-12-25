'use strict';

/**
 * @ngdoc function
 * @name pokesoApp.controller:AboutController
 * @description
 * # AboutController
 * Controller of the pokesoApp
 */
angular.module('pokesoApp').controller('AboutController', function ($scope) {
  $scope.logs = [
    {date: '2015.11.5', description: '创建图鉴功能'},
    {date: '2015.10.30', description: '引入shadowdown的伤害计算器'},
    {date: '2015.9.26', description: '引入Dustin Diaz开发、52poke汉化的个体值计算器'},
    {date: '2015.9.20',  description: '界面优化'},
    {date: '2015.9.9',  description: '改善编码功能，引入蝌蚪码用于加密原编码，更短、更易于分享'},
    {date: '2015.9.4',  description: '添加大图片开关，为Android, iPhone用户默认禁用动态图片以节省流量'},
    {date: '2015.9.2',  description: '实现将队伍保存为编码、从编码读取队伍的功能'},
    {date: '2015.8.31', description: '创建战队编辑功能'},
    {date: '2015.8.29', description: '在百度口袋妖怪贴吧公开项目，征求建议'},
    {date: '2015.8.20', description: '实现种族值对比功能'},
    {date: '2015.8.15', description: '实现技能筛选功能'},
    {date: '2015.8.7',  description: '本站成立'}
  ];
  $scope.bugs = [
    'PM列表可能需要拖动滚动条才能显示',
    '保存战队功能可能在iOS9下崩溃',
    '在iOS Safari浏览器下，动态图片仅在拖动画面时播放'];
});
