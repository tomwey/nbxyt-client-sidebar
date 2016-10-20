'use strict';

angular.module('xiaoyoutong.controllers')

// 首页
.controller('HomeCtrl', function($scope, sectionFactory, $ionicSlideBoxDelegate, DataService, $timeout) {

  var _this = this;
  
  var slideImgs = $ionicSlideBoxDelegate.$getByHandle('slideimgs');
  
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    slideImgs.start();
  });

  $scope.$on('$ionicView.beforeLeave', function(event, data) {
    slideImgs.stop();
  });


  this.loadData = function() {
    DataService.get('/banners', null).then(function(result) {
      // console.log(result.data.data);
      $scope.banners = result.data.data;
    
      slideImgs.update();

      $timeout(function() {
        slideImgs.loop(true);

        slideImgs.slide(0);

        slideImgs.stop();

        slideImgs.start();
      }, 10);
    
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