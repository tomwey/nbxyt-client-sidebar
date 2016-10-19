'use strict;'

// 聊天服务
angular.module('xiaoyoutong.services')

.factory('Chat', function(YB_APP_KEY, AWToast) {
	var yunba;

	// 获取客户端ID
	var get_uuid = function() {
		return '';
	};

	// 建立mqtt连接
	var mqtt_connect = function(custom_id) {
		// var cid = get_uuid();

		// 连接回调
		var connected = function(success, msg, sessionid) {
			if (success) {
				console.log('连接成功');
				AWToast.showText('连接成功', 1500);
			} else {
				console.log('连接失败');
				AWToast.showText('连接失败', 1500);
			}
		};

		if (!custom_id || custom_id.length === 0) {
			console.log('需要客户端ID');
		} else {
			yunba.connect_by_customid(custom_id, connected);
		}
	};
	return {
		connect: function(custom_id) {
			yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: YB_APP_KEY});
			
			// 初始化
			yunba.init(function(success) {
				if (success) {
					mqtt_connect(custom_id);
				} else {
					AWToast.showText('初始化失败', 1500);
				}
			});
		},
		disconnect: function() {
			yunba.disconnect(function (success, msg) {
	        if (success) {
	          console.log('已经关闭了连接');
	        } else {
	          console.log('关闭连接失败');
	        }
	      });
		},
		setAlias: function(alias) {
			yunba.set_alias({'alias': alias}, function (data) {
	            if (data.success) {
	                console.log('设置别名成功: ' + alias);
	                AWToast.showText('设置别名成功: ' + alias, 1500);
	            } else {
	                console.log('设置别名失败: ' + alias);
	                AWToast.showText('设置别名失败: ' + alias, 1500);
	            }
	            // callback(data);
        	});
		},
		sendToUser: function(alias, msg, callback) {
			if (!alias || alias.length === 0) {
				console.log('用户不能为空');
				AWToast.showText('用户不能为空', 1500);
				return;
			}

			if (!msg || msg.length === 0) {
				console.log('消息不能为空');
				return;
			}

			yunba.publish_to_alias({'alias': alias, 'msg': msg}, function (success, msg) {
	            if (!success) {
	                console.log('消息发送失败');
	                AWToast.showText('消息发送失败' + alias, 1500);
	            } else {
	            	console.log('消息发送成功: ' + alias);
	            	AWToast.showText('消息发送成功: ' + alias, 1500);
	            }
	            callback(success, msg, alias);
        	});
		},
		onReceiveMessageCallback: function(messageCallback) {
			yunba.set_message_cb(messageCallback);
		},
	};
})
;