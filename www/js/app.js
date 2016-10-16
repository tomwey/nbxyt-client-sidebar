// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xiaoyoutong', ['ionic', 'xiaoyoutong.controllers', 'xiaoyoutong.services', 'ui.router', 'base64', 'ionicLazyLoad', 'ngCordova', 'ionic-native-transitions'])

.config(['$ionicConfigProvider', '$ionicNativeTransitionsProvider', function($ionicConfigProvider, $ionicNativeTransitionsProvider){
  $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('');

  // 仅仅在设备上支持
  $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 280, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  });

  $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'slide',
      direction: 'left'
  });

  $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
  });

}])

.run(function($ionicPlatform, $rootScope, $localStorage, UserService, $state) {

  $rootScope.login = function(from) {
    // console.log('login');
    $rootScope.login_from = from;
    $state.go('app.login');
  };
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    window.onerror = function(message, url, line, col, error) {
      console.log('url: ' + url + ', line: ' + line + 'message: ' + message + ', error: ' + error);
    };
    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
       
  });

})

// 配置路由
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl',
  })

  // 首页
  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller:  'HomeCtrl',
      }
    }
  })
    /************************* 首页相关路由  *************************/
    // 校友列表
    .state('app.organizations', {
      url: '/organizations',
      views: {
        'mainContent': {
         templateUrl: 'templates/organizations.html',
          controller:  'OrganizationsCtrl',
        }
      }
    })
    .state('app.organization', {
      url: '/organizations/:id',
      views: {
        'mainContent': {
         templateUrl: 'templates/organization-detail.html',
          controller:  'OrganizationDetailCtrl',
        }
      }
    })

    // 校友总会详情
    .state('app.organization-term', {
      url: '/organization-term',
      views: {
        'mainContent': {
         templateUrl: 'templates/organization-term.html',
          controller:  'OrganizationTermCtrl',
        }
      }
    })

    // 同学录
    .state('app.users', {
      url: '/users',
      views: {
        'mainContent': {
         templateUrl: 'templates/users.html',
         controller:  'UsersCtrl',
        }
      }
    })

    // 校友详情
    .state('app.user', {
      url: '/user',
      views: {
        'mainContent': {
         templateUrl: 'templates/user-detail.html',
         controller:  'UserDetailCtrl',
        }
      }
    })

    // 俱乐部
    .state('app.clubs', {
      url: '/clubs',
      views: {
        'mainContent': {
         templateUrl: 'templates/clubs.html',
          controller:  'ClubsCtrl',
        }
      }
    })

    // 俱乐部详情
    .state('app.club', {
      url: '/clubs/:id',
      views: {
        'mainContent': {
         templateUrl: 'templates/club-detail.html',
          controller:  'ClubDetailCtrl',
        }
      }
    })

    // 实习基地
    .state('app.bases', {
      url: '/bases',
      views: {
        'mainContent': {
         templateUrl: 'templates/companies.html',
          controller:  'CompaniesCtrl',
        }
      }
    })

    // 实习基地详情
    .state('app.base', {
      url: '/bases/:id',
      views: {
        'mainContent': {
         templateUrl: 'templates/company-detail.html',
          controller:  'CompanyDetailCtrl',
        }
      }
    })

    // 捐赠
    .state('app.donate-home', {
      url: '/donate-home',
      views: {
        'mainContent': {
         templateUrl: 'templates/donate-home.html',
          controller:  'DonateHomeCtrl',
        }
      }
    })

    // 捐赠列表
    .state('app.donates', {
      url: '/donates',
      views: {
        'mainContent': {
         templateUrl: 'templates/donates.html',
          controller:  'DonatesCtrl',
        }
      }
    })
    // 捐赠详情
    .state('app.donate', {
      url: '/donates/:id',
      views: {
        'mainContent': {
         templateUrl: 'templates/donate-detail.html',
          controller:  'DonateDetailCtrl',
        }
      }
    })

    // 捐赠说明
    .state('app.donate-help', {
      url: '/donate-help',
      views: {
        'mainContent': {
         templateUrl: 'templates/donate-help.html',
          controller:  'DonateHelpCtrl',
        }
      }
    })

    // 捐赠申请
    .state('app.donate-apply', {
      url: '/donate-apply',
      views: {
        'mainContent': {
         templateUrl: 'templates/donate-apply.html',
          controller:  'DonateApplyCtrl',
        }
      }
    })

    // 文章列表
    .state('app.articles', {
      url: '/articles/node:id',
      views: {
        'mainContent': {
         templateUrl: 'templates/articles.html',
          controller:  'ArticlesCtrl',
        }
      }
    })

    // 文章详情
    .state('app.article', {
      url: '/articles/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/article-detail.html',
          controller:  'ArticleDetailCtrl',
        }
      }
    })

    // 活动列表
    .state('app.events', {
      url: '/events-:owner',
      views: {
        'mainContent': {
          templateUrl: 'templates/events.html',
          controller:  'EventsCtrl',
        }
      }
    })
    // 活动详情
    .state('app.event', {
      url: '/events/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/event-detail.html',
          controller:  'EventDetailCtrl',
        }
      }
    })

    /************************* 首页相关路由  *************************/

  // 消息
  .state('app.messages', {
    url: '/messages',
    views: {
      'mainContent': {
        templateUrl: 'templates/messages.html',
        controller:  'MessagesCtrl',
      }
    }
  })

  // 我的
  .state('app.setting', {
    url: '/setting',
    views: {
      'mainContent': {
        templateUrl: 'templates/setting.html',
        controller:  'SettingsCtrl',
      }
    }
  })

  // 个人资料
  .state('app.user-profile', {
    url: '/user-profile',
    views: {
      'mainContent': {
        templateUrl: 'templates/user-profile.html',
        controller:  'UserCtrl',
      }
    }
  })

    // 加入的校友会
  .state('app.user-organizations', {
    url: '/user-organizations',
    views: {
      'mainContent': {
        templateUrl: 'templates/user-organizations.html',
        controller:  'UserOrganizationsCtrl',
      }
    }
  })

    // 加入的俱乐部
  .state('app.user-clubs', {
    url: '/user-clubs',
    views: {
      'mainContent': {
        templateUrl: 'templates/user-clubs.html',
        controller:  'UserClubsCtrl',
      }
    }
  })

    // 参加的活动
  .state('app.user-events', {
    url: '/user-events',
    views: {
      'mainContent': {
        templateUrl: 'templates/user-events.html',
        controller:  'UserEventsCtrl',
      }
    }
  })

/////////////////////////////////////////////////////////////////////////////
  // 登录
  .state('app.login', {
    url: '/login',
    views: {
      'mainContent': {
        templateUrl: 'templates/login.html',
        controller:  'LoginCtrl',
      }
    }
  })

  // 忘记密码
  .state('app.forget-password', {
    url: '/forget-password',
    views: {
      'mainContent': {
        templateUrl: 'templates/password.html',
        controller:  'PasswordCtrl',
      }
    }
  })

  // 注册
  .state('app.signup', {
    url: '/signup',
    views: {
      'mainContent': {
        templateUrl: 'templates/signup.html',
        controller:  'SignupCtrl',
      }
    }
  })

  // 完善资料
  .state('app.signup-final', {
    url: '/signup-final',
    views: {
      'mainContent': {
        templateUrl: 'templates/signup-final.html',
        controller:  'SignupFinalCtrl',
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
