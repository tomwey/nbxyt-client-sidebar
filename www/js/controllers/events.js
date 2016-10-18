/*****************************************************************************
                                活动模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

 // 活动列表页
.controller('EventsCtrl', function($scope, DataService, $ionicLoading, $stateParams) {
  console.log($stateParams);

  $ionicLoading.show();
  
  var params = {};
  
  if ($stateParams.owner) {
    var ownerable = $stateParams.owner.split('-');

    if (ownerable[0]) {
      params.owner_type = ownerable[0];
    }
    
    if (ownerable[1]) {
      params.owner_id = ownerable[1];
    }

  }
  
  DataService.get('/events', params).then(function(result) {
    $scope.events = result.data.data;
  }, function(error) {
    console.log(error);

  }).finally(function(){
    $ionicLoading.hide();
  });
})

// 活动详情
.controller('EventDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading, PopupService, UserService, $state, $rootScope) {
  
  $scope.has_attended = false;
  $scope.can_attend   = true;
  
  $ionicLoading.show()
  $scope.event = DataService.get('/events/' + parseInt($stateParams.id), {token: UserService.token()}).then(function(response){
    $scope.event = response.data.data;
    $ionicLoading.hide();
    
    $scope.has_attended = $scope.event.has_attended;
    $scope.can_attend   = $scope.event.state.can_attend;
    
  },function(err) {
    $scope.can_attend = false;
    console.log(err);
    $ionicLoading.hide();
  });

  // 报名参加
  $scope.doAttend = function(id) {
    
    if ($scope.has_attended) {
      return;
    }
    
    if (!$scope.can_attend) {
      return;
    }
    
    $scope.event_id = id;
    var token = UserService.token();
    if (!token) {
      $rootScope.login('app.event');
    } else {
      $ionicLoading.show();
      DataService.post('/attends', { token: UserService.token(), event_id: $scope.event_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_attended = true;
        } else {
          $scope.has_attended = false;
          PopupService.say('错误提示', resp.data.message);
        }
      },function(err) {
        $scope.has_attended = false;
        PopupService.say('错误提示', '服务器出错');
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
  };
  
  function doRemove() {
    $ionicLoading.show();
    DataService.post('/attends/delete', { token: UserService.token(), event_id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        $state.go('tab.user-events');
      } else {
        PopupService.say('错误提示', resp.data.message);
      }
    },function(err) {
      PopupService.say('错误提示', '服务器出错');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
  
  // 取消报名
  $scope.cancelAttend = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('取消报名', '你确定要取消参加该活动吗？', doRemove);
  };
})