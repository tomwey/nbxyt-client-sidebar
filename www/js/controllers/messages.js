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
		$rootScope.unread_sessions = [];

		$ionicLoading.show();

		DataService.get('/messages/sessions', { token: UserService.token() })
			.then(function(res){
				var sessions = res.data.data;
				
				for (var i = 0; i < sessions.length; i++) {
					if (sessions[i].unread_count > 0) {
						$rootScope.unread_sessions.push({ uid: sessions[i].user.uid, unread_count: sessions[i].unread_count });
					}
				}

				$scope.sessions = sessions;
				console.log($scope.sessions);
			},function(err){
				console.log(err);
			})
			.finally(function() {
				$ionicLoading.hide();
			})
	};
})

// 消息页面
.controller('MessagesCtrl', function($scope, $rootScope, Chat, $timeout, $ionicScrollDelegate, DataService, $ionicLoading, UserService, $stateParams, AWToast, PAGE_SIZE) {

	$scope.currentPage = 1;
	$scope.totalPage   = 1;
	$scope.pageSize    = PAGE_SIZE;

	$scope.to_user = $stateParams.to;

	$scope.message = { token: UserService.token(), to: $scope.to_user.uid, content: '' };

	$scope.messages = [];

	var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

	$scope.$on('$ionicView.beforeEnter', function(event, data) {
		// console.log($stateParams.to);
		// $rootScope.unread_sessions

		// 标记为已读，更新消息数量
		var unread_sessions = $rootScope.unread_sessions;
		for (var i = 0; i < unread_sessions.length; i++) {
			if (unread_sessions[i].uid == $scope.to_user.uid) {
				$rootScope.unread_message_count -= unread_sessions[i].unread_count;
			}
		}

		$ionicLoading.show();

		loadData($stateParams.to);

		Chat.onReceiveMessageCallback(function(data) {
			console.log('收到消息了');
			var msg = JSON.parse(data.msg);
			msg.is_from_me = false;
			$scope.messages.push(msg);
			$timeout(function() {
				viewScroll.scrollBottom(true);
			}, 10);
		});
	});

	var loadData = function(to) {

		DataService.get('/messages', { token: UserService.token(), to: $scope.to_user.uid, need_sort: 1, page: $scope.currentPage, size: $scope.pageSize })
			.then(function(res){
				if (res.data.code === 0) {
					if ($scope.currentPage === 1) {
						$scope.totalPage = ( res.data.total + $scope.pageSize - 1 ) / $scope.pageSize;
						$scope.messages = res.data.data;

						// viewScroll.resize();
						$timeout(function() {
							viewScroll.scrollBottom(false);
						}, 100);
					} else {
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

		DataService.post('/messages/send', $scope.message)
			.then(function(res) {
				if (res.data.code == 0) {
					$scope.message.content = '';
					$scope.messages.push(res.data.data);

					var msg = res.data.data;
					// msg.is_from_me = false;

					Chat.sendToUser($scope.message.to, JSON.stringify(msg), function(success, msg, to_user) {
						if (success) {
							// AWToast.showText('发送成功: ' + to_user, 1500);
						} else {
							AWToast.showText('Oops, 消息发送失败了', 1500);
						}
			
					});

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
	