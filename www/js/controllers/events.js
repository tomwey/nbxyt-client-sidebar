/*****************************************************************************
                                活动模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

 // 活动列表页
.controller('EventsCtrl', function($scope, DataService, $ionicLoading, $stateParams, PAGE_SIZE) {
  // console.log($stateParams);

  $scope.currentPage = 1;
  $scope.pageSize    = PAGE_SIZE;
  $scope.noMoreItemsAvailable = true;
  $scope.totalPage   = 1;

  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $ionicLoading.show();

    loadData();
  });

  var loadData = function() {
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

      DataService.get('/events', params).then(function(res) {
        if (res.data.code == 0) {
          if ($scope.currentPage == 1) {
            $scope.events = res.data.data;
            $scope.totalPage = ( res.data.total + $scope.pageSize - 1 ) / $scope.pageSize;
          } else {
            if (res.data.data.length == 0) {
              AWToast.showText('没有更多数据', 1500);
            } else {
              $scope.events = $scope.events.concat(res.data.data);
            }
          }

          // 检查是否有更多数据
          if ($scope.currentPage < $scope.totalPage) {
            $scope.noMoreItemsAvailable = false;
          } else {
            $scope.noMoreItemsAvailable = true;
          }
        } else {
          AWToast.showText(res.data.message, 1500);
        }
        
      }, function(error) {
        AWToast.showText('服务器出错', 1500);
      }).finally(function(){
        $ionicLoading.hide();
      });
  };
  
  $scope.loadMore = function() {
    if ($scope.currentPage < $scope.totalPage) {
      $scope.currentPage ++;
      loadData();
    }
  };
})

// 活动详情
.controller('EventDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading, PopupService, UserService, $state, $rootScope, AWToast) {
  
  $scope.has_attended = false;
  $scope.can_attend   = true;

  $scope.from_user = $stateParams.from_user;
  
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $ionicLoading.show()

    $scope.event = DataService.get('/events/' + parseInt($stateParams.id), {token: UserService.token()}).then(function(res){

      if (res.data.code === 0) {
        $scope.event = res.data.data;
        $scope.has_attended = $scope.event.has_attended;
        $scope.can_attend   = $scope.event.state.can_attend;
      } else {
        $scope.can_attend = false;
        AWToast.showText(res.data.message, 1500);
      }
    },function(err) {
      $scope.can_attend = false;
      AWToast.showText('服务器出错', 1500);
    }).finally(function() {
      $ionicLoading.hide();
    });
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
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/attends', { token: UserService.token(), event_id: $scope.event_id }).then(function(resp){
        if (resp.data.code === 0) {
          $scope.has_attended = true;
          AWToast.showText('报名成功', 1500);
        } else {
          $scope.has_attended = false;
          // PopupService.say('错误提示', resp.data.message);
          AWToast.showText(resp.data.message, 1500);
        }
      },function(err) {
        $scope.has_attended = false;
        // PopupService.say('错误提示', '服务器出错');
        AWToast.showText('服务器出错', 1500);
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
  };
  
  function doRemove() {
    $ionicLoading.show();
    DataService.post('/attends/delete', { token: UserService.token(), event_id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        AWToast.showText('移除成功', 1500);
        $state.go('app.user-events');
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
  
  // 取消报名
  $scope.cancelAttend = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('取消报名', '你确定要取消参加该活动吗？', doRemove);
  };

  $scope.handleAttend = function(id) {
    if ($scope.from_user) {
      $scope.cancelAttend(id);
    } else {
      $scope.doAttend(id);
    }
  };
})