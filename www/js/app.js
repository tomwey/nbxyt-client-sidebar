// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xiaoyoutong', ['ionic', 'xiaoyoutong.controllers', 'xiaoyoutong.services', 'ui.router', 'base64', 'ionicLazyLoad', 'ngCordova', 'ionic-native-transitions', 'angularMoment'])

.config(['$ionicConfigProvider', '$ionicNativeTransitionsProvider', function($ionicConfigProvider, $ionicNativeTransitionsProvider){
  $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('');

  // 原生滚动
  $ionicConfigProvider.scrolling.jsScrolling(false);

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

.run(function($ionicPlatform, $location, $rootScope, $ionicNativeTransitions, $localStorage, UserService, $state, amMoment) {

  amMoment.changeLocale('zh-cn');

  $rootScope.login = function() {
    $state.go('app.login');
  };

  $rootScope.popTo = function(state) {
    $ionicNativeTransitions.stateGo(state, {},
     { "type": "slide",
       "direction": "right",
       "duration": 200,
     });
  };

  $rootScope.gotoUserDetail = function(uid) {
    if ( !UserService.currentUser() ) {
      $state.go('app.login');
    } else {
      $state.go('app.user', { uid: uid });
    }
  };

  $rootScope.gotoBannerDetail = function(banner) {
    if (banner.bannerable_type === 'event') {
      $rootScope.gotoEventDetail(banner.bannerable_id, false);
    } else {
      // $location.url('#/app/' + banner.bannerable_type + 's/' + banner.bannerable_id);
      $state.go('app.article', { id: banner.bannerable_id} )
    }
  };

  // 发消息页面
  $rootScope.gotoSendMessage = function(to) {
    if ( !UserService.currentUser() ) {
      $state.go('app.login');
    } else {
      $state.go('app.messages', { to: to });
    }
  };

  // 同学录列表页面
  $rootScope.gotoUsers = function(owner) {
    $state.go('app.users', { owner: owner });
  };

  // 校友详情页面
  $rootScope.gotoOrganizationDetail = function(oid, from_user) {
    $state.go('app.organization', { id: oid, from_user: from_user });
  };

  // 俱乐部详情页面
  $rootScope.gotoClubDetail = function(cid, from_user) {
    $state.go('app.club', { id: cid, from_user: from_user });
  };

  // 活动详情页面
  $rootScope.gotoEventDetail = function(eid, from_user) {
    $state.go('app.event', { id: eid, from_user: from_user });
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
    
    if (window.plugins && window.plugins.jPushPlugin) {
      // 启动极光推送
      window.plugins.jPushPlugin.init();
      //调试模式
      window.plugins.jPushPlugin.setDebugMode(true);

    if (UserService.currentUser()) {
      window.plugins.jPushPlugin.setAlias(UserService.currentUser().uid);
    }
    } else {

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
    // controller: 'AppCtrl',
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

    // 校友会详情
    .state('app.organization', {
      url: '/organization',
      params: {
        id: null,
        from_user: false,
      },
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
      params: {
        owner: null
      },
      views: {
        'mainContent': {
         templateUrl: 'templates/users.html',
         controller:  'UsersCtrl',
        }
      }
    })

    // 校友详情
    .state('app.user', {
      url: '/users/:uid',
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
      url: '/club',
      params: {
        id: null,
        from_user: false,
      },
      views: {
        'mainContent': {
         templateUrl: 'templates/club-detail.html',
          controller:  'ClubDetailCtrl',
        }
      }
    })

    // 俱乐部章程
    .state('app.club-bylaw', {
      url: '/clubs/:id/bylaw',
      views: {
        'mainContent': {
          templateUrl: 'templates/club-bylaw.html',
          controller: 'ClubDetailCtrl'
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
      url: '/event',
      params: {
        id: null,
        from_user: false,
      },
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
    params: {
      to: null
    },
    views: {
      'mainContent': {
        templateUrl: 'templates/messages.html',
        controller:  'MessagesCtrl',
      }
    }
  })

  // 消息会话列表
  .state('app.message-sessions', {
    url: '/message-sessions',
    views: {
      'mainContent': {
       templateUrl: 'templates/message-sessions.html',
       controller:  'MessageSessionsCtrl',
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

  // 修改昵称
  .state('app.update-nickname', {
    url: '/update-nickname',
    views: {
      'mainContent': {
        templateUrl: 'templates/update-nickname.html',
        controller:  'UserCtrl',
      }
    }
  })
  // 更换手机号
  .state('app.update-mobile', {
    url: '/update-mobile',
    views: {
      'mainContent': {
        templateUrl: 'templates/update-mobile.html',
        controller:  'UserCtrl',
      }
    }
  })
  // 设置密码
  .state('app.update-password', {
    url: '/update-password',
    views: {
      'mainContent': {
        templateUrl: 'templates/password.html',
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

  // 意见反馈
  .state('app.feedback', {
    url: '/feedback',
    views: {
      'mainContent': {
        templateUrl: 'templates/feedback.html',
        controller:  'FeedbackCtrl',
      }
    }
  })

  // 关于
  .state('app.aboutus', {
    url: '/aboutus',
    views: {
      'mainContent': {
        templateUrl: 'templates/aboutus.html',
        controller:  'AboutusCtrl',
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
        templateUrl: 'templates/forget-password.html',
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

  $urlRouterProvider.otherwise('/app/home');

});

angular.module('xiaoyoutong.controllers', ['xiaoyoutong.services']);
angular.module('xiaoyoutong.services', []);
