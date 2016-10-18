'use strict';

/*****************************************************************************
                                同学录模块
 *****************************************************************************/
angular.module('xiaoyoutong.controllers')

// 校友列表
.controller('UsersCtrl', function($scope, $rootScope, UserService, DataService, $ionicLoading, $stateParams, $timeout, AWToast, $state) {
  $scope.keyword = '';

  var params = {};
  if (UserService.token()) {
  	params.token = UserService.token();
  } 

  if ($scope.keyword.length > 0) {
  	params.q = $scope.keyword;
  } 

  $ionicLoading.show();
  DataService.get('/users', params).then(function(res) {
    $scope.users = res.data.data;
  }, function(err) {
    $timeout(function() {
      AWToast.showText('Oops, 服务器出错了', 1000);
    },100);
  }).finally(function() {
    $ionicLoading.hide();
  });
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