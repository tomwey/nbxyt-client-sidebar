'use strict';

/*****************************************************************************
                                实习基地模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

 // 实习基地列表页面
.controller('CompaniesCtrl', function($scope, DataService, $ionicLoading) {
  $ionicLoading.show();

  $scope.companies = DataService.get('/bases', null).then(function(response){
    $scope.companies = response.data.data;
    $ionicLoading.hide();
  },function(err) {
    $ionicLoading.hide();
  });
})

// 基地详情
.controller('CompanyDetailCtrl', function($scope, DataService, $stateParams, $ionicLoading) {
  $ionicLoading.show();

  $scope.company = DataService.get('/bases/' + parseInt($stateParams.id), null).then(function(response) {
    $scope.company = response.data.data;
    $ionicLoading.hide();
    
    $scope.isShowEvents = $scope.company.latest_events.length > 0;
    $scope.isShowLoadMoreEvents = $scope.company.latest_events.length >= 5;
  }, function(err) {
    $ionicLoading.hide();
  });
})
;