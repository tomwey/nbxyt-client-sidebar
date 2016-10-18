'use strict';

/*****************************************************************************
                                校友组织模块
 *****************************************************************************/
angular.module('xiaoyoutong.controllers')

// 校友组织列表
.controller('OrganizationsCtrl', function($scope, DataService, $ionicLoading) {

  $ionicLoading.show();
  
  DataService.get('/organizations/assoc', null).then(function(result) {
    $scope.organization = result.data.data;
  }, function(error) {
    console.log(error);
  }).finally(function() {
    DataService.get('/organizations', null).then(function(result){
      $scope.organizations = result.data.data;
      $ionicLoading.hide();
    },function(error){
      $ionicLoading.hide();
    });
  });
})

// 校友总会详情页
.controller('OrganizationTermCtrl', function($scope, DataService, $ionicLoading, $ionicSlideBoxDelegate) {
  
  $scope.isShowEvents = false;
  $scope.isShowLoadMoreEvents = false;
  
  DataService.get('/organizations/assoc/body', null).then(function(resp) {
    $scope.organization = resp.data.data;
    
    $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
    $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
    
    $scope.isShowEvents = $scope.organization.latest_events.length > 0;
    $scope.isShowLoadMoreEvents = $scope.organization.latest_events.length >= 5;
    
  }, function(error) {
    console.log(error);
  });
})

// 校友组织详情
.controller('OrganizationDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading, $ionicPopup, UserService, PopupService, $state, $rootScope, AWToast) {

  $scope.from_user = $stateParams.from_user;
  
  var loadData = function() {
    $scope.has_joined = false;
  
      var params = null;
      if ( UserService.token() ) {
        params = {token: UserService.token()};
      }

      $ionicLoading.show();
      DataService.get('/organizations/' + $stateParams.id, params).then(function(result) {
        $scope.organization = result.data.data;
        console.log($scope.organization);
        $scope.isShowEvents = $scope.organization.latest_events && $scope.organization.latest_events.length > 0;
        $scope.isShowUsers = $scope.organization.latest_users && $scope.organization.latest_users.length > 0;

        $scope.isShowLoadMoreEvents = $scope.organization.latest_events && $scope.organization.latest_events.length >= 5;
        $scope.isShowLoadMoreUsers = $scope.organization.latest_users && $scope.organization.latest_users.length >= 5;
        
        $scope.has_joined = $scope.organization.has_joined;
        // console.log($scope.organization.latest_events);

        $ionicLoading.hide();

      }, function(err) {
        $ionicLoading.hide();
      });
  };

  loadData();

  function doRemove() {
    $ionicLoading.show();
    DataService.post('/relationships/organization/cancel_join', { token: UserService.token(), id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        AWToast.showText('移除成功', 1500);
        $state.go('app.user-organizations');
      } else {
        // PopupService.say('错误提示', resp.data.message);
        AWToast.showText(resp.data.message, 1500);
      }
    },function(err) {
      // PopupService.say('错误提示', '服务器出错');
      AWToast.showText('服务器出错', 1500);
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  // 加入组织
  $scope.doJoinOrganization   = function(id) {
    
    if ($scope.has_joined) {
      return;
    }
    
    $scope.organ_id = id;
    
    var token = UserService.token();

    console.log(token);
    if (!token) {
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/relationships/organization/join', { token: token, id: $scope.organ_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_joined = true;
          AWToast.showText('加入成功', 1500);
        } else {
          $scope.has_joined = false;
          // PopupService.say('错误提示', resp.data.message);
          AWToast.showText(resp.data.message, 1500);
        }
      },function(err) {
        $scope.has_joined = false;
        // PopupService.say('错误提示', '服务器出错');
        AWToast.showText('服务器出错', 1500);
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
    
  };
  
  // 移除组织
  $scope.doRemoveOrganization = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('从校友会移除', '你确定要从该校友会移除吗？', doRemove);
  };

  $scope.handleJoin = function(id) {
    if ($scope.from_user) {
      $scope.doRemoveOrganization(id);
    } else {
      $scope.doJoinOrganization(id);
    }
  };
})