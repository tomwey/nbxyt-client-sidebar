'use strict';

angular.module('xiaoyoutong.controllers')

// 首页
.controller('HomeCtrl', function($scope, sectionFactory, $ionicSlideBoxDelegate, DataService) {

  var _this = this;
  
  this.loadData = function() {
    DataService.get('/banners', null).then(function(result) {
      // console.log(result.data.data);
      $scope.banners = result.data.data;
    
      $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
      $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
      //
      // $ionicSlideBoxDelegate.$getByHandle('slideimgs').next();
    
    }, function(error) {
      console.log(error)
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  
  this.loadData();
  
  $scope.doRefresh = function() {
    _this.loadData();
  };

  $scope.sections = sectionFactory.all();
})