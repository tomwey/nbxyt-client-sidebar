'use strict';

// 获取设备信息，并保存到$rootScope
angular.module('xiaoyoutong.services')

.factory('Device', function($rootScope, $cordovaDevice) {
	var randomString = function(length) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for(var i = 0; i < length; i++) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
    	return text;
	};
	var saveDevice = function() {
		if (!(window.plugins && window.plugins.ngCordova)) {
			$rootScope.device = { 
				device: 'no mobile',
				cordova: '6.0',
				model: 'web',
				platform: 'web',
				uuid: randomString(20),
				version: '1.0'
			};
			return;
		}

		// 加载真正的手机设备
		var man = $cordovaDevice.getManufacturer();
		var name = $cordovaDevice.getName();
		var device = $cordovaDevice.getDevice();
		var cordova = $cordovaDevice.getCordova();
		var model = $cordovaDevice.getModel();
		var platform = $cordovaDevice.getPlatform();
		var uuid = $cordovaDevice.getUUID();
		var version = $cordovaDevice.getVersion();

		$rootScope.device = { 
			manufacturer: man,
			device: device,
			cordova: cordova,
			name: name,
			model: model,
			platform: platform,
			uuid: uuid,
			version: version
		};
	};
	return {
		getDevice: function() {
			if (!$rootScope.device) {
				saveDevice();
			}
			return $rootScope.device;
		},
	};
})
;