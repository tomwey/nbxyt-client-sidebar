'use strict';

/*****************************************************************************
                                同学录模块
 *****************************************************************************/
angular.module('xiaoyoutong.controllers')

// 校友列表
.controller('UsersCtrl', function($scope, $rootScope, UserService, DataService, $ionicLoading, $stateParams, $timeout, AWToast, $state) {
  // $scope.keyword = '';

  $scope.input = { keyword: '' };

  $scope.currentPage = 1;
  $scope.pageSize    = 8;
  $scope.noMoreItemsAvailable = true;
  $scope.totalPage   = 1;

  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    loadData();
  });

  var loadData = function() {
    var params = {};
    if (UserService.token()) {
      params.token = UserService.token();
    } 

    if ($scope.input.keyword.length > 0) {
      params.q = $scope.input.keyword;
    } 

    if ($stateParams.owner) {
      params.owner_type = $stateParams.owner.type;
      params.owner_id   = $stateParams.owner.id;
    } 

    $ionicLoading.show();
    DataService.get('/users', params).then(function(res) {
      if (res.data.code === 0) {
        if ($scope.currentPage === 1) {
          $scope.totalPage = ( res.data.total + $scope.pageSize - 1 ) / $scope.pageSize;
          $scope.users = res.data.data;
        } else {
          $scope.users = $scope.users.concat(res.data.data);
        }

        // 检查是否有更多数据
        if ($scope.currentPage < $scope.totalPage) {
          $scope.noMoreItemsAvailable = false;
        } else {
          $scope.noMoreItemsAvailable = true;
        }

      } else {
        AWToast.showText(res.data.message, 1000);
      }
      $scope.users = res.data.data;
    }, function(err) {
      $timeout(function() {
        AWToast.showText('Oops, 服务器出错了', 1000);
      },100);
    }).finally(function() {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.doSearch = function() {
    loadData();
  };

  $scope.loadMore = function() {
    if ($scope.currentPage < $scope.totalPage) {
      $scope.currentPage ++;
      loadData();
    }
  };

})

// 校友详情
.controller('UserDetailCtrl', function($scope, $stateParams, DataService, UserService, $ionicLoading, AWToast, $timeout) {
	console.log($stateParams);

	$ionicLoading.show();
	DataService.get('/users/' + $stateParams.uid, { token: UserService.token() })
		.then(function(res) {
			if (res.data.code === 0) {
				$scope.user = res.data.data;
				console.log($scope.user);
			} else {
				$timeout(function(){
					AWToast.showText(res.data.message, 1500);
				}, 100);
			}
		}, function(err) {
			$timeout(function(){
					AWToast.showText('Oops, 服务器出错了', 1500);
				}, 100);
		}).finally(function() {
			$ionicLoading.hide();
		});

})