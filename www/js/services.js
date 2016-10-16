angular.module('xiaoyoutong.services', [])
.constant('apiHost', 'http://xyt.deyiwifi.com/api/v1')
.service('AccessKeyService', function($base64) {
  this.fromTimestamp = function(timestamp) {
    return $base64.encode('efd12eada3aa4976994546572c235cd8' + timestamp);
  };
})

.factory('$localStorage', function($window) {
  return {
    store: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    storeObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  };
})

.service('PopupService', function($ionicPopup) {
  this.say = function(title, message) {
    $ionicPopup.alert({
      title: title,
      template: message
    });
  };
  
  this.ask = function(title, message, callback) {
    $ionicPopup.confirm({
      title: title,
      template: message
    }).then(function(res){
      if (res) {
        if (callback != undefined) {
          callback();
        }
      }
    });
  };
})

.service('DataService', function(apiHost, $http, AccessKeyService, $httpParamSerializer) {

  var _this = this;
  
  this.mergeParams = function(params) {
    params = params || {};

    var timestamp = new Date().getTime();
    var ak = AccessKeyService.fromTimestamp(timestamp);
    params.i = timestamp;
    params.ak = ak;
    
    return params;
  };
  
  this.querystringForParams = function(params) {
    return $httpParamSerializer(_this.mergeParams(params));
  };

  this.get = function(api, params) {
    var querystring = _this.querystringForParams(params);
    return $http.get(apiHost + api + '?' + querystring);
  };
  this.post = function(api, params) {    
    return $http.post(apiHost + api, _this.mergeParams(params));
  };
})

.service('UserService', function($localStorage) {
  var defaultUser = {
    uid: '10001',
    token: '5caeccebb0134f198ae137c2f3f96ad7',
    nickname: '',
    mobile: '180****3687',
    avatar: '',
    realname: 'tomwey',
    stu_no: '2005010210',
    faculty: '核技术与自动化工程学院',
    specialty: '工业工程',
    graduation: '2005级'
  };
  this.currentUser = function() {
    return $localStorage.getObject('user', /*JSON.stringify(defaultUser)*/null);
  };
  var _this = this;
  this.token = function() {
    if (_this.currentUser()) {
      return _this.currentUser().token;
    }
    return null;
  };
})

.service('productsService', function() {
  var products = [{
    id: 1,
    sku: '309372',
    image: 'img/ben.png',
    title: '3斤装正宗蒲江猕猴桃',
    intro: '巴适得很，不信来试试',
    body: '<p style="color: red;">很不错的哦，来试试！</p>',
    price: '100',
    market_price: '199',
    exp_fee: 5,
  }];
  this.getProducts = function() {
    return products;
  };
  this.getProduct = function(obj) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].sku === obj.sku)
        return products[i];
    }
    return null;
  };
})

.service('ordersService', function() {
  
})

.service('usersService', function() {
  var users = [{
      id: 1,
      avatar: 'img/mike.png',
      nickname: '昵称',
      specialty: '工业工程',
      graduation: '2006级',
    },{
      id: 2,
      avatar: 'img/ben.png',
      nickname: '昵称',
      specialty: '计算机专业',
      graduation: '2009级',
    }];

    this.getUsers = function(obj) {
      return users;
    };
})

.factory('sectionFactory', function() {
  var sections = [{
    id: 1,
    url: '#/app/organizations',
    img: 'img/img_org.png',
  },
  {
    id: 2,
    url: '#/app/users',
    img: 'img/img_alb.png',
  },
  // {
  //   id: 3,
  //   url: '#/tab/shop',
  //   img: 'img/img_shop.png',
  // },
  {
    id: 4,
    url: '#/app/clubs',
    img: 'img/img_club.png',
  },
  {
    id: 5,
    url: '#/app/bases',
    img: 'img/img_comp.png',
  },
  {
    id: 6,
    url: '#/app/donate-home',
    img: 'img/img_don.png',
  },
  ];
  return {
    all: function() {
      return sections;
    }
  }
})
;
