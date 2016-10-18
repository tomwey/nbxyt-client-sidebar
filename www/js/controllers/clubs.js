'use strict';

/*****************************************************************************
                                俱乐部模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

 // 俱乐部列表页面
.controller('ClubsCtrl', function($scope, DataService, $ionicLoading) {

  $ionicLoading.show();

  $scope.clubs = DataService.get('/clubs', null).then(function(response){
    $scope.clubs = response.data.data;

    $ionicLoading.hide();
  },function(error){
    $ionicLoading.hide();
  });
})

// 俱乐部详情页
.controller('ClubDetailCtrl', function($scope, DataService, $rootScope, $ionicLoading, $stateParams, PopupService, UserService, $state) {
  
  $scope.has_joined = false;
  
  $ionicLoading.show();
  $scope.club = DataService.get('/clubs/' + parseInt($stateParams.id), {token: UserService.token()}).then(function(response){
    $scope.club = response.data.data;

    $scope.isShowEvents = $scope.club.latest_events.length > 0;
    $scope.isShowUsers = $scope.club.latest_users.length > 0;

    $scope.isShowLoadMoreEvents = $scope.club.latest_events.length >= 5;
    $scope.isShowLoadMoreUsers = $scope.club.latest_users.length >= 5;

    $scope.has_joined = $scope.club.has_joined;
    
    $ionicLoading.hide();
  },function(err){
    $ionicLoading.hide();
  });

  // 加入俱乐部
  $scope.doJoinClub = function(id) {
    
    if ($scope.has_joined) {
      return;
    }
    
    $scope.club_id = id;
    var token = UserService.token();
    if (!token) {
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/relationships/club/join', { token: token, id: $scope.club_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_joined = true;
        } else {
          $scope.has_joined = false;
          PopupService.say('错误提示', resp.data.message);
        }
      },function(err) {
        $scope.has_joined = false;
        PopupService.say('错误提示', '服务器出错');
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
  };
  
  function doRemove() {
    $ionicLoading.show();
    DataService.post('/relationships/club/cancel_join', { token: UserService.token(), id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        $state.go('tab.user-clubs');
      } else {
        PopupService.say('错误提示', resp.data.message);
      }
    },function(err) {
      PopupService.say('错误提示', '服务器出错');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  $scope.doRemoveClub = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('从俱乐部移除', '你确定要从该俱乐部移除吗？', doRemove);
  };
})

// 俱乐部章程
.controller('ClubDetailBylawsCtrl', function($scope, DataService, $ionicLoading, $stateParams) {
  console.log($stateParams);
  
  $ionicLoading.show();
  $scope.club = DataService.get('/clubs/' + parseInt($stateParams.id) + '/bylaw', null).then(function(response){
    $scope.club = response.data.data;
    $ionicLoading.hide();
  },function(err){
    $ionicLoading.hide();
  });
})