'use strict';

angular.module('xiaoyoutong.controllers')

// 消息会话页面
.controller('MessageSessionsCtrl', function($scope, $rootScope, DataService, $ionicLoading, UserService) {

	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		$scope.isLogined = !!UserService.token();

		if ($scope.isLogined) {
			loadData();
		} 
	});

	var loadData = function() {
		$ionicLoading.show();

		DataService.get('/messages/sessions', { token: UserService.token() })
			.then(function(res){
				$scope.sessions = res.data.data;
			},function(err){
				console.log(err);
			})
			.finally(function() {
				$ionicLoading.hide();
			})
	};
})

// 消息页面
.controller('MessagesCtrl', function($scope, $rootScope, DataService, $ionicLoading, UserService, $stateParams, AWToast) {

	$scope.to_user = $stateParams.to;

	$scope.message = { token: UserService.token(), to: $scope.to_user.uid, content: '' };

	$scope.messages = [];
	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		console.log($stateParams.to);

		loadData($stateParams.to);
	});

	var loadData = function(to) {
		$ionicLoading.show();

		DataService.get('/messages', { token: UserService.token(), to: $scope.to_user.uid, need_sort: 1 })
			.then(function(res){
				if (res.data.code === 0) {
					$scope.messages = $scope.messages.concat(res.data.data);
				} else {

				}
			},function(err){
				console.log(err);
			})
			.finally(function() {
				$ionicLoading.hide();
			})
	};

	$scope.sendMessage = function() {
		$ionicLoading.show();

		DataService.post('/messages/send', $scope.message)
			.then(function(res) {
				if (res.data.code == 0) {
					$scope.messages.push(res.data.data);
				} else {
					AWToast.showText(res.data.message, 1500);
				}
			},function(err) {
				AWToast.showText('Oops, 服务器出错了', 1500);
				console.log(err);
			})
			.finally(function() {
				$ionicLoading.hide();
			})
	};
})
	