angular.module('xiaoyoutong.controllers', [])

.controller('AppCtrl', function() {
  // console.log(11111);
})
// 首页
.controller('HomeCtrl', function($scope, sectionFactory, $ionicSlideBoxDelegate, DataService) {

  var _this = this;
  
  this.loadData = function() {
    DataService.get('/banners', null).then(function(result) {
      // console.log(result.data.data);
      $scope.banners = result.data.data;
    
      $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
      $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
      //
      // $ionicSlideBoxDelegate.$getByHandle('slideimgs').next();
    
    }, function(error) {
      console.log(error)
    }).finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  
  this.loadData();
  
  $scope.doRefresh = function() {
    _this.loadData();
  };

  $scope.sections = sectionFactory.all();
})

// 校友总会详情页
.controller('OrganizationTermCtrl', function($scope, DataService, $ionicLoading, $ionicSlideBoxDelegate) {
  
  $scope.isShowEvents = false;
  $scope.isShowLoadMoreEvents = false;
  
  DataService.get('/organizations/assoc/body', null).then(function(resp) {
    $scope.organization = resp.data.data;
    
    $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
    $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
    
    $scope.isShowEvents = $scope.organization.latest_events.length > 0;
    $scope.isShowLoadMoreEvents = $scope.organization.latest_events.length >= 5;
    
  }, function(error) {
    console.log(error);
  });
})

// 校友组织列表
.controller('OrganizationsCtrl', function($scope, DataService, $ionicLoading) {

  $ionicLoading.show();
  
  DataService.get('/organizations/assoc', null).then(function(result) {
    $scope.organization = result.data.data;
  }, function(error) {
    console.log(error);
  }).finally(function() {
    DataService.get('/organizations', null).then(function(result){
      $scope.organizations = result.data.data;
      $ionicLoading.hide();
    },function(error){
      $ionicLoading.hide();
    });
  });
})

// 校友组织详情
.controller('OrganizationDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading, $ionicPopup, UserService, PopupService, $state, $rootScope) {

  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    $scope.has_joined = false;
  
      var params = null;
      if ( UserService.token() ) {
        params = {token: UserService.token()};
      }

      $ionicLoading.show();
      DataService.get('/organizations/' + $stateParams.id, params).then(function(result) {
        $scope.organization = result.data.data;
        console.log($scope.organization);
        $scope.isShowEvents = $scope.organization.latest_events && $scope.organization.latest_events.length > 0;
        $scope.isShowUsers = $scope.organization.latest_users && $scope.organization.latest_users.length > 0;

        $scope.isShowLoadMoreEvents = $scope.organization.latest_events && $scope.organization.latest_events.length >= 5;
        $scope.isShowLoadMoreUsers = $scope.organization.latest_users && $scope.organization.latest_users.length >= 5;
        
        $scope.has_joined = $scope.organization.has_joined;
        // console.log($scope.organization.latest_events);

        $ionicLoading.hide();

      }, function(err) {
        $ionicLoading.hide();
      });
  });

  function doRemove() {
    $ionicLoading.show();
    DataService.post('/relationships/organization/cancel_join', { token: UserService.token(), id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        $state.go('tab.user-organizations');
      } else {
        PopupService.say('错误提示', resp.data.message);
      }
    },function(err) {
      PopupService.say('错误提示', '服务器出错');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  // 加入组织
  $scope.doJoinOrganization   = function(id) {
    
    if ($scope.has_joined) {
      return;
    }
    
    $scope.organ_id = id;
    
    var token = UserService.token();

    console.log(token);
    if (!token) {
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/relationships/organization/join', { token: token, id: $scope.organ_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_joined = true;
        } else {
          $scope.has_joined = false;
          PopupService.say('错误提示', resp.data.message);
        }
      },function(err) {
        $scope.has_joined = false;
        PopupService.say('错误提示', '服务器出错');
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
    
  };
  
  // 移除组织
  $scope.doRemoveOrganization = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('从校友会移除', '你确定要从该校友会移除吗？', doRemove);
  };
})

// 同学录页面
.controller('AlumnusCtrl', function($scope, DataService) {
  $scope.alumnus = DataService.get('', null).then(function(resp) {

  }, function(err) {

  }).finally(function(){
    
  });
})

// 产品智联页面
.controller('ShopCtrl', function($scope, productsService, $stateParams) {
  $scope.products = productsService.getProducts();
  $scope.product  = productsService.getProduct({sku: $stateParams.id});

  $scope.doPurchase = function(sku) {
    alert(sku);
  };
})

// 订单
.controller('OrdersCtrl', function($scope, productsService, ordersService, $stateParams) {
  $scope.product = productsService.getProduct({sku: $stateParams.id});

  var order = {};

  $scope.order = order;
  $scope.orders = [{}];
})

// 俱乐部列表页面
.controller('ClubsCtrl', function($scope, DataService, $ionicLoading) {

  $ionicLoading.show();

  $scope.clubs = DataService.get('/clubs', null).then(function(response){
    $scope.clubs = response.data.data;

    $ionicLoading.hide();
  },function(error){
    $ionicLoading.hide();
  });
})

// 俱乐部详情页
.controller('ClubDetailCtrl', function($scope, DataService, $rootScope, $ionicLoading, $stateParams, PopupService, UserService, $state) {
  
  $scope.has_joined = false;
  
  $ionicLoading.show();
  $scope.club = DataService.get('/clubs/' + parseInt($stateParams.id), {token: UserService.token()}).then(function(response){
    $scope.club = response.data.data;

    $scope.isShowEvents = $scope.club.latest_events.length > 0;
    $scope.isShowUsers = $scope.club.latest_users.length > 0;

    $scope.isShowLoadMoreEvents = $scope.club.latest_events.length >= 5;
    $scope.isShowLoadMoreUsers = $scope.club.latest_users.length >= 5;

    $scope.has_joined = $scope.club.has_joined;
    
    $ionicLoading.hide();
  },function(err){
    $ionicLoading.hide();
  });

  // 加入俱乐部
  $scope.doJoinClub = function(id) {
    
    if ($scope.has_joined) {
      return;
    }
    
    $scope.club_id = id;
    var token = UserService.token();
    if (!token) {
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/relationships/club/join', { token: token, id: $scope.club_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_joined = true;
        } else {
          $scope.has_joined = false;
          PopupService.say('错误提示', resp.data.message);
        }
      },function(err) {
        $scope.has_joined = false;
        PopupService.say('错误提示', '服务器出错');
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
  };
  
  function doRemove() {
    $ionicLoading.show();
    DataService.post('/relationships/club/cancel_join', { token: UserService.token(), id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        $state.go('tab.user-clubs');
      } else {
        PopupService.say('错误提示', resp.data.message);
      }
    },function(err) {
      PopupService.say('错误提示', '服务器出错');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  $scope.doRemoveClub = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('从俱乐部移除', '你确定要从该俱乐部移除吗？', doRemove);
  };
})

// 俱乐部章程
.controller('ClubDetailBylawsCtrl', function($scope, DataService, $ionicLoading, $stateParams) {
  console.log($stateParams);
  
  $ionicLoading.show();
  $scope.club = DataService.get('/clubs/' + parseInt($stateParams.id) + '/bylaw', null).then(function(response){
    $scope.club = response.data.data;
    $ionicLoading.hide();
  },function(err){
    $ionicLoading.hide();
  });
})

// 活动列表页
.controller('EventsCtrl', function($scope, DataService, $ionicLoading, $stateParams) {
  console.log($stateParams);

  $ionicLoading.show();
  
  var params = {};
  
  if ($stateParams.owner) {
    var ownerable = $stateParams.owner.split('-');

    if (ownerable[0]) {
      params.owner_type = ownerable[0];
    }
    
    if (ownerable[1]) {
      params.owner_id = ownerable[1];
    }

  }
  
  DataService.get('/events', params).then(function(result) {
    $scope.events = result.data.data;
  }, function(error) {
    console.log(error);

  }).finally(function(){
    $ionicLoading.hide();
  });
})

// 活动详情
.controller('EventDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading, PopupService, UserService, $state, $rootScope) {
  
  $scope.has_attended = false;
  $scope.can_attend   = true;
  
  $ionicLoading.show()
  $scope.event = DataService.get('/events/' + parseInt($stateParams.id), {token: UserService.token()}).then(function(response){
    $scope.event = response.data.data;
    $ionicLoading.hide();
    
    $scope.has_attended = $scope.event.has_attended;
    $scope.can_attend   = $scope.event.state.can_attend;
    
  },function(err) {
    $scope.can_attend = false;
    console.log(err);
    $ionicLoading.hide();
  });

  // 报名参加
  $scope.doAttend = function(id) {
    
    if ($scope.has_attended) {
      return;
    }
    
    if (!$scope.can_attend) {
      return;
    }
    
    $scope.event_id = id;
    var token = UserService.token();
    if (!token) {
      $rootScope.login();
    } else {
      $ionicLoading.show();
      DataService.post('/attends', { token: UserService.token(), event_id: $scope.event_id }).then(function(resp){
        if (resp.data.code == 0) {
          $scope.has_attended = true;
        } else {
          $scope.has_attended = false;
          PopupService.say('错误提示', resp.data.message);
        }
      },function(err) {
        $scope.has_attended = false;
        PopupService.say('错误提示', '服务器出错');
      }).finally(function() {
        $ionicLoading.hide();
      });
    }
  };
  
  function doRemove() {
    $ionicLoading.show();
    DataService.post('/attends/delete', { token: UserService.token(), event_id: $scope.oid }).then(function(resp){
      if (resp.data.code == 0) {
        $state.go('tab.user-events');
      } else {
        PopupService.say('错误提示', resp.data.message);
      }
    },function(err) {
      PopupService.say('错误提示', '服务器出错');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
  
  // 取消报名
  $scope.cancelAttend = function(id) {
    // console.log(id);
    $scope.oid = id;
    
    PopupService.ask('取消报名', '你确定要取消参加该活动吗？', doRemove);
  };
})

// 用户列表
.controller('UsersCtrl', function($scope, usersService, $stateParams) {
  $scope.users = usersService.getUsers({type: $stateParams.type});
})

// 实习基地列表页面
.controller('CompaniesCtrl', function($scope, DataService, $ionicLoading) {
  $ionicLoading.show();

  $scope.companies = DataService.get('/bases', null).then(function(response){
    $scope.companies = response.data.data;
    $ionicLoading.hide();
  },function(err) {
    $ionicLoading.hide();
  });
})

// 基地详情
.controller('CompanyDetailCtrl', function($scope, DataService, $stateParams, $ionicLoading) {
  $ionicLoading.show();

  $scope.company = DataService.get('/bases/' + parseInt($stateParams.id), null).then(function(response) {
    $scope.company = response.data.data;
    $ionicLoading.hide();
    
    $scope.isShowEvents = $scope.company.latest_events.length > 0;
    $scope.isShowLoadMoreEvents = $scope.company.latest_events.length >= 5;
  }, function(err) {
    $ionicLoading.hide();
  });
})

// 捐赠首页
.controller('DonateHomeCtrl', function($scope, $state, DataService, $ionicLoading) {
  $ionicLoading.show();

  $scope.donatesInfo = DataService.get('/donates/home', null).then(function(response){
    $scope.donatesInfo = response.data.data;
    
    $scope.isShowDonates = $scope.donatesInfo.donates != undefined;
    $scope.isShowReports = $scope.donatesInfo.reports != undefined;
    $scope.isShowThanks = $scope.donatesInfo.thanks != undefined;

    $ionicLoading.hide();
  }, function(err) {
    $ionicLoading.hide();
  });

  $scope.gotoDonateHelp = function() {
    $state.go('app.donate-help');
  };
  $scope.gotoApply = function() {
    $state.go('app.donate-apply');
  };
})

// 捐赠页面
.controller('DonatesCtrl', function($scope, $state, DataService, $ionicLoading) {
  
  $ionicLoading.show();
  
  DataService.get('/donates', null).then(function(result){
    $scope.donates = result.data.data;
  }, function(err) {
    console.log(err);
  }).finally(function() {
    $ionicLoading.hide();
  });
})

// 捐赠文章列表
.controller('ArticlesCtrl', function($scope, $stateParams, DataService, $ionicLoading) {
  
  var _this = this;
  
  $scope.currentPage = 1;
  $scope.pageSize    = 8;
  $scope.noMoreItemsAvailable = true;
  $scope.totalPage   = 1;
  
  this.loadData = function(page, size) {
    console.log('loading page: ' + page);
    $ionicLoading.show();
    DataService.get('/articles/type' + parseInt($stateParams.id), { page: page, size: size }).then(function(result) {
      var articleInfo = result.data.data;
      
      if (page == 1) {
        $scope.articleInfo = articleInfo;
        $scope.totalPage   = ( articleInfo.total + $scope.pageSize - 1 ) / $scope.pageSize;
      } else {
        var data = $scope.articleInfo.data;
        $scope.articleInfo.data = data.concat(articleInfo.data);
      }
      
      // 检查是否有更多数据
      if (page < $scope.totalPage) {
        $scope.noMoreItemsAvailable = false;
      } else {
        $scope.noMoreItemsAvailable = true;
      }
      
    }, function(err) {
      console.log(err);
    }).finally(function(){
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  
  this.loadData($scope.currentPage, $scope.pageSize);
  
  $scope.loadMore = function() {
    if ($scope.currentPage < $scope.totalPage) {
      $scope.currentPage ++;
      _this.loadData($scope.currentPage, $scope.pageSize);
    }
  };
})

// 捐赠详情
.controller('DonateDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading) {
  $ionicLoading.show();
  $scope.donate = DataService.get('/donates/' + $stateParams.id, null).then(function(result){
    $scope.donate = result.data.data;
  },function(error){
    console.log(error);
  }).finally(function() {
    $ionicLoading.hide();
  });
})

// 捐赠文章详情
.controller('ArticleDetailCtrl', function($scope, $stateParams, DataService, $ionicLoading) {
  $ionicLoading.show();

  $scope.article = DataService.get('/articles/' + parseInt($stateParams.id), null).then(function(response) {
    $scope.article = response.data.data;

    $ionicLoading.hide();
  }, function(err) {
    $ionicLoading.hide();
  });
})

// 捐赠帮助
.controller('DonateHelpCtrl', function($scope, $state, DataService, $ionicLoading, $stateParams) {
  
  $ionicLoading.show();
  
  $scope.page = DataService.get('/pages/donate_help', null).then(function(response){
    $scope.page = response.data.data;
  },function(err) {
    console.log(err);
  }).finally(function() {
    $ionicLoading.hide();
  });

  $scope.gotoApply = function() {
    $state.go('tab.donate-apply');
  };
})

// 捐赠申请
.controller('DonateApplyCtrl', function($scope, DataService, $ionicLoading, $cordovaToast) {
  $scope.donate_apply = { content: '', contact: '' };
  
  $scope.commitApply = function() {
    
    var content = $scope.donate_apply.content;
    if (content.trim() === '') {
      alert('内容必填');
      return;
    }
    
    var author = $scope.donate_apply.contact;
    if (author.trim() === '') {
      alert('联系方式必填');
      return;
    }
    
    $ionicLoading.show();
    DataService.post('/donates/apply', $scope.donate_apply).then(function(response) {
      console.log(response.data);
      $scope.donate_apply = { content: '', contact: '' };
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
})

// 消息页面
.controller('MessagesCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // $scope.chats = bannerFactory.all();
  // $scope.remove = function(chat) {
  //   bannerFactory.remove(chat);
  // };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, bannerFactory) {
  $scope.chat = bannerFactory.get($stateParams.chatId);
})

// 个人中心页面
.controller('SettingsCtrl', function($scope, $state, UserService) {
  $scope.user = UserService.currentUser();
  
  $scope.gotoProfile = function() {
    var token = UserService.token();
    
    if (!token) {
      $rootScope.login();
    } else {
      $state.go('tab.profile');
    }
  };
  // $scope.gotoOrders = function(state = '') {
  //   if (state.length == 0) {
  //     $state.go('tab.orders');
  //   } else {
  //     $state.go('tab.orders-' + state);
  //   }
  //
  // };
})

// 我的
.controller('UserCtrl', function($scope, $state, DataService, $ionicLoading, UserService) {
  $scope.user = UserService.currentUser();
  // DataService.get('/user/organizations', { token: '' }).then(function(response){
  //   $scope.organizations = response.data.data;
  // }, function(error) {
    
  // }).finally(function(){
  //   $ionicLoading.hide();
  // })
  console.log($scope.user);

  $scope.updateNickname = function() {
    $state.go('tab.profile-update-nickname');
  };

  $scope.changeMobile = function() {
    $state.go('tab.profile-update-mobile');
  };

  $scope.updatePassword = function() {
    $state.go('tab.profile-update-password');
  };

})

.controller('UpdateProfileCtrl', function($scope, DataService, $ionicLoading, UserService) {
  var currentUser = UserService.currentUser();

  $scope.user = { nickname: currentUser.nickname, 
                  mobile: currentUser.mobile,
                  code: '',
                  new_mobile: '',
                  password: '',
                };
  $scope.doUpdateNickname = function() {

  };

  $scope.doUpdateMobile   = function() {

  };

  $scope.doUpdatePassword = function() {

  };
})

// 我加入的校友会
.controller('UserOrganizationsCtrl', function($scope, DataService, $ionicLoading, UserService) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    loadData();
  });
  
  function loadData() {
    $ionicLoading.show();
  
    DataService.get('/user/organizations', { token: UserService.token() }).then(function(resp) {
      $scope.organizations = resp.data.data;
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  }
  
  // loadData();
  
})
// 我加入的俱乐部
.controller('UserClubsCtrl', function($scope, DataService, $ionicLoading, UserService) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    loadData();
  });
  
  function loadData() {
    $ionicLoading.show();
    
    DataService.get('/user/clubs', { token: UserService.token() }).then(function(resp) {
      $scope.clubs = resp.data.data;
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  }
})
// 我参加的活动
.controller('UserEventsCtrl', function($scope, DataService, $ionicLoading, UserService) {
  
  $scope.$on('$ionicView.beforeEnter', function() {
    // console.log('123321');
    loadData();
  });
  
  function loadData() {
    $ionicLoading.show();
  
    DataService.get('/user/events', { token: UserService.token() }).then(function(resp) {
      $scope.events = resp.data.data;
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    });
  }
  
})

// 意见反馈
.controller('FeedbackCtrl', function($scope, DataService, $ionicLoading) {
  $scope.feedback = { content: '', author: '' };
  
  $scope.commitFeedback = function() {
    if ($scope.feedback.content.trim().length == 0) {
      alert('反馈内容不能为空');
      return;
    }
    
    $ionicLoading.show();
    DataService.post('/feedbacks', $scope.feedback).then(function(response) {
      $scope.feedback = { content: '', author: '' };
      alert('提交成功');
    },function(error) {
      alert('Oops, 提交失败了，请重试');
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
})

// 关于我们
.controller('AboutusCtrl', function($scope, DataService, $ionicLoading) {
  $ionicLoading.show();
  
  DataService.get('/pages/aboutus', null).then(function(resp) {
    $scope.page = resp.data.data;
  }, function(err) {
    console.log(err);
  }).finally(function() {
    $ionicLoading.hide();
  });
})

// 登录
.controller('LoginCtrl', function($scope, $state, $rootScope) {
  $scope.user = {mobile: '', password: ''};

  $scope.doLogin = function() {
    usersService.login($scope.user);
  };
  $scope.gotoForgetPassword = function() {
    $state.go('app.forget-password');
  };
  $scope.gotoSignup = function() {
    $state.go('app.signup');
  };
})

// 注册
.controller('SignupCtrl', function($scope, $state) {
  $scope.user = {mobile: '', password: '', code: ''};
  $scope.doRegister = function() {
    // alert('2222');
    $state.go('signup-final');
  };
  $scope.doFetchCode = function() {
    alert('123');
  };
})

.controller('PasswordCtrl', function($scope, $state) {
  $scope.user = { mobile: '', password: '', code: '' };
})

// 隐藏tabs指令
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
});
