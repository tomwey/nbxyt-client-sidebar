'use strict';

/*****************************************************************************
                                设置模块
 *****************************************************************************/

angular.module('xiaoyoutong.controllers')

.controller('SettingsCtrl', function($scope, $state, UserService, $rootScope) {
  
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    var user = UserService.currentUser();
    if (!user) {
      user = { avatar: 'img/default_avatar.png', nickname: '立即登录' };
    } else {
      if (user.avatar === '') {
        user.avatar = 'img/default_avatar.png';
      }
    }
    $scope.user = user;
  });
  
  var forwardTo = function(state) {
    var token = UserService.token();
    
    if (!token) {
      $rootScope.login();
    } else {
      $state.go(state);
    }
  };

  $scope.gotoProfile = function() {
    forwardTo('app.user-profile');
  };

  $scope.gotoUserOrganizations = function() {
    forwardTo('app.user-organizations');
  };

  $scope.gotoUserClubs = function() {
    forwardTo('app.user-clubs');
  };

  $scope.gotoUserEvents = function() {
    forwardTo('app.user-events');
  };
})

// 我加入的校友会
.controller('UserOrganizationsCtrl', function($scope, DataService, $ionicLoading, UserService) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    loadData();
  });
  
  function loadData() {
    $ionicLoading.show();
  
    DataService.get('/user/organizations', { token: UserService.token() }).then(function(resp) {
      $scope.organizations = resp.data.data;
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  }
  
  // loadData();
  
})
// 我加入的俱乐部
.controller('UserClubsCtrl', function($scope, DataService, $ionicLoading, UserService) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    loadData();
  });
  
  function loadData() {
    $ionicLoading.show();
    
    DataService.get('/user/clubs', { token: UserService.token() }).then(function(resp) {
      $scope.clubs = resp.data.data;
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  }
})
// 我参加的活动
.controller('UserEventsCtrl', function($scope, DataService, $ionicLoading,PAGE_SIZE, UserService, AWToast) {
  
  $scope.currentPage = 1;
  $scope.pageSize    = PAGE_SIZE;
  $scope.noMoreItemsAvailable = true;
  $scope.totalPage   = 1;

  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    $ionicLoading.show();
    loadData();
  });
  
  var loadData = function () {
    
    DataService.get('/user/events', { token: UserService.token() }).then(function(res) {
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
    }, function(err) {
      AWToast.showText('服务器出错了', 1500);
    }).finally(function() {
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

// 意见反馈
.controller('FeedbackCtrl', function($scope, DataService, $ionicLoading) {
  $scope.feedback = { content: '', author: '' };
  
  $scope.commitFeedback = function() {
    if ($scope.feedback.content.trim().length == 0) {
      alert('反馈内容不能为空');
      return;
    }
    
    $ionicLoading.show();
    DataService.post('/feedbacks', $scope.feedback).then(function(response) {
      $scope.feedback = { content: '', author: '' };
      alert('提交成功');
    },function(error) {
      alert('Oops, 提交失败了，请重试');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
})

// 关于我们
.controller('AboutusCtrl', function($scope, DataService, $ionicLoading) {
  $ionicLoading.show();
  
  DataService.get('/pages/aboutus', null).then(function(resp) {
    $scope.page = resp.data.data;
  }, function(err) {
    console.log(err);
  }).finally(function() {
    $ionicLoading.hide();
  });
})

;