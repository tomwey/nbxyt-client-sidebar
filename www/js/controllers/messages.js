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
.controller('MessagesCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, DataService, $ionicLoading, UserService, $stateParams, AWToast) {

	$scope.currentPage = 1;
	$scope.totalPage   = 1;
	$scope.pageSize    = 8;

	$scope.to_user = $stateParams.to;

	$scope.message = { token: UserService.token(), to: $scope.to_user.uid, content: '' };

	$scope.messages = [];

	var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		// console.log($stateParams.to);

		loadData($stateParams.to);
	});

	var loadData = function(to) {
		$ionicLoading.show();

		DataService.get('/messages', { token: UserService.token(), to: $scope.to_user.uid, need_sort: 1, page: $scope.currentPage, size: $scope.pageSize })
			.then(function(res){
				if (res.data.code === 0) {
					if ($scope.currentPage === 1) {
						$scope.totalPage = ( res.data.total + $scope.pageSize - 1 ) / $scope.pageSize;
						$scope.messages = $scope.messages.concat(res.data.data);
						$timeout(function() {
							viewScroll.scrollBottom(true);
						}, 0);
					} else {
						$scope.messages = res.data.data.concat($scope.messages);
						if (res.data.data.length == 0) {
							AWToast.showText('没有更多数据了', 1500);
						} else {
							$scope.messages = res.data.data.concat($scope.messages);
						}
					}
				} else {
					// AWToast.showText(res.data.message, 1500);
				}
			},function(err){
				console.log(err);
				AWToast.showText('服务器出错', 1500);
			})
			.finally(function() {
				$ionicLoading.hide();
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 0);
			})
	};

	$scope.loadMore = function() {
		if ( $scope.currentPage < $scope.totalPage ) {
			$scope.currentPage ++;
			loadData($stateParams.to);
		} else {
			console.log('没有更多数据了');
			$timeout(function() {
				$scope.$broadcast('scroll.refreshComplete');
				AWToast.showText('没有更多数据了', 1000);
			}, 100);
		}
	};

	// 发消息
	$scope.sendMessage = function() {
		$ionicLoading.show();
		// userMessageScroll
		DataService.post('/messages/send', $scope.message)
			.then(function(res) {
				if (res.data.code == 0) {
					$scope.message.content = '';
					$scope.messages.push(res.data.data);

					$timeout(function() {
						viewScroll.scrollBottom(true);
					}, 10);
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
	