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

  var loadData = function() {
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
  };

  loadData();

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
      $rootScope.login('app.organization');
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
      $rootScope.login('app.club');
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
      $rootScope.login('app.event');
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
    $state.go('app.donate-apply');
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
.controller('SettingsCtrl', function($scope, $state, UserService, $rootScope) {
  
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
    var user = UserService.currentUser();
    if (!user) {
      user = { avatar: 'img/default_avatar.png', nickname: '立即登录' };
    } else {
      if (user.avatar === '') {
        user.avatar = 'img/default_avatar.png';
      }
    }
    $scope.user = user;
  });
  
  var forwardTo = function(state) {
    var token = UserService.token();
    
    if (!token) {
      $rootScope.login('app.setting');
    } else {
      $state.go(state);
    }
  };

  $scope.gotoProfile = function() {
    forwardTo('app.user-profile');
  };

  $scope.gotoUserOrganizations = function() {
    forwardTo('app.user-organizations');
  };

  $scope.gotoUserClubs = function() {
    forwardTo('app.user-clubs');
  };

  $scope.gotoUserEvents = function() {
    forwardTo('app.user-events');
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
.controller('UserCtrl', function($scope, $state, FormCheck, PopupService, DataService, $ionicLoading, UserService, AWToast, $cordovaCamera) {
  
  $scope.noReadonly = false;

  var currentUser = UserService.currentUser();
  // console.log('000');
  $scope.$on('$ionicView.beforeEnter', function(event, data) {
  //   console.log('11111');
    var token = null;
    if (currentUser) {
      token = currentUser.token;
    }
    
    if (token) {
      $ionicLoading.show();
      DataService.get('/user/me', { token: token })
      .then(function(res) {
        if (res.data.code === 0) {
          $scope.user = res.data.data;
          $scope.user.token = token;
          UserService.login($scope.user);
        } 
      },function(err) {

      })
      .finally(function() {
        $ionicLoading.hide();
      });
    }
  });
  
  $scope.user = currentUser;

  if ($scope.user) {
    $scope.updateUser = { nickname: '', mobile: $scope.user.mobile, new_mobile: '', code: '', password: '' };
  } else {
    $scope.updateUser = { nickname: '', mobile: '', new_mobile: '', code: '', password: '' };
  }

  $scope.updateNickname = function() {
    $state.go('app.update-nickname');
  };

  // 获取验证码
  $scope.doFetchCode = function() {
    if ( !FormCheck.not_blank($scope.updateUser.mobile, '手机号不能为空') || 
    !FormCheck.regex_validate($scope.updateUser.mobile, /^1[34578]\d{9}$/, '手机号不正确') ) {
      return;
    }

    $ionicLoading.show();
    DataService.post('/auth_codes', { mobile: $scope.updateUser.mobile }).then(function(res) {
      if (res.data.code == 0) {
        AWToast.showText('短信验证码已发送', 1500);
      } else {
        console.log(res.data.message)
        AWToast.showText(res.data.message, 1500);
      }
      console.log(res);
    }, function(err) {
      console.log(err);
      AWToast.showText('Oops, 服务器出错了', 1500);
    }).finally(function() {
      $ionicLoading.hide();
    });
  };

  // 修改头像
  $scope.changeAvatar = function() {
    pickImage();
  };
  
  var pickImage = function () {   
    var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
    	    correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          // var image = document.getElementById('myImage');
//           image.src = "data:image/jpeg;base64," + imageData;
          $scope.user.avatar = "data:image/jpeg;base64," + imageData;
          // console.log(imageData);
          $ionicLoading.show();
          DataService.post('/user/update_base64_avatar', { token: UserService.token(), avatar: $scope.user.avatar })
            .then(function(res) {
              // console.log(res);
            }, function(err) {
              console.log(err);
            }).finally(function() {
              $ionicLoading.hide();
            });
        }, function(err) {
          // error
          console.log(err);
        });
  };
  
  // 修改昵称
  $scope.doUpdateNickname = function() {
    console.log($scope.updateUser);

    $ionicLoading.show();
    DataService.post('/user/update_nickname', { token: $scope.user.token, nickname: $scope.updateUser.nickname })
      .then(function(res) {
        if (res.data.code === 0) {
          $state.go('app.user-profile');
        } else {
          console.log(res.data.message);
        }
      },function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
  };

  $scope.changeMobile = function() {
    $state.go('app.update-mobile');
  };

  $scope.doUpdateMobile = function() {
        console.log($scope.updateUser);

    $ionicLoading.show();
    DataService.post('/user/update_mobile', { token: $scope.user.token, mobile: $scope.updateUser.new_mobile })
      .then(function(res) {
        if (res.data.code === 0) {
          $state.go('app.user-profile');
        } else {
          console.log(res.data.message);
        }
      },function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
  };

  $scope.updatePassword = function() {
    $state.go('app.update-password');
  };

  $scope.doUpdatePassword = function() {

    var params;
    var toState;
      params = { 
        token: $scope.user.token, 
        mobile: $scope.updateUser.mobile, 
        code: $scope.updateUser.code,
        password: $scope.updateUser.password,
      };
      toState = 'app.user-profile';
    
    $ionicLoading.show();
    DataService.post('/user/update_password', params)
      .then(function(res) {
        if (res.data.code === 0) {
          $state.go(toState);
        } else {
          console.log(res.data.message);
        }
      },function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
  };

  $scope.logout = function() {
    
    PopupService.ask('退出登录', '你确定吗？', function() {
      UserService.logout();
      $state.go('app.setting');
    })

  };

})

// 忘记密码
.controller('PasswordCtrl', function($scope, $state, FormCheck, PopupService, DataService, $ionicLoading, UserService, AWToast) {

  $scope.updateUser = { nickname: '', mobile: '', new_mobile: '', code: '', password: '' };

  $scope.noReadonly = true;

  // 获取验证码
  $scope.fetchCode = function() {
    // if ( !FormCheck.not_blank($scope.updateUser.mobile, '手机号不能为空') || 
    // !FormCheck.regex_validate($scope.updateUser.mobile, /^1[34578]\d{9}$/, '手机号不正确') ) {
    //   return;
    // }

    console.log(1111);

    // $ionicLoading.show();
    // DataService.post('/auth_codes', { mobile: $scope.updateUser.mobile }).then(function(res) {
    //   if (res.data.code == 0) {
    //     AWToast.showText('短信验证码已发送');
    //   } else {
    //     console.log(res.data.message)
    //     // AWToast.showText(res.data.message);
    //     $ionicLoading.show({
    //       noBackdrop: true,
    //       template: res.data.message,
    //       duration: 1000,
    //     });
    //   }
    //   console.log(res);
    // }, function(err) {
    //   console.log(err);
    //   AWToast.showText('Oops, 服务器出错了');
    // }).finally(function() {
    //   $ionicLoading.hide();
    // });
  };

  $scope.doUpdatePassword = function() {
    
  var params = { 
        mobile: $scope.updateUser.mobile, 
        code: $scope.updateUser.code,
        password: $scope.updateUser.password,
      };
  var toState = 'app.login';
  $ionicLoading.show();
  
  DataService.post('/user/update_password', params)
      .then(function(res) {
        if (res.data.code === 0) {
          $state.go(toState);
        } else {
          console.log(res.data.message);
        }
      },function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
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
.controller('LoginCtrl', function($scope,$ionicHistory, $state, $rootScope, DataService, $ionicLoading, FormCheck, UserService) {
  $scope.user = {mobile: '', password: ''};

  $scope.doLogin = function() {
    // usersService.login($scope.user);
    if ( !FormCheck.not_blank($scope.user.mobile, '手机号不能为空') ||
         !FormCheck.regex_validate($scope.user.mobile, /^1[34578]\d{9}$/, '手机号不正确') ||
         !FormCheck.not_blank($scope.user.password, '密码不能为空')) { 
      return;
    }

    $ionicLoading.show();
    DataService.post('/account/login', $scope.user).then(function(res) {
      if (res.data.code === 0) {
        UserService.login(res.data.data);
        // $state.go($rootScope.login_from);
        $ionicHistory.goBack();
      } else {
        console.log(res.data.message);
      }
    }, function(err) {
      console.log(err);
    }).finally(function() {
      $ionicLoading.hide();
    })

  };
  $scope.gotoForgetPassword = function() {
    $state.go('app.forget-password');
  };
  $scope.gotoSignup = function() {
    $state.go('app.signup');
  };
})

// 注册
.controller('SignupCtrl', function($scope, $state, AWToast, FormCheck, DataService, $ionicLoading, $filter, $rootScope) {
  $scope.user = {mobile: '', password: '', code: ''};

  $scope.doCheckCode = function() {
    // alert('2222');
    // $state.go('signup-final');
    if ( !FormCheck.not_blank($scope.user.mobile, '手机号不能为空') || 
         !FormCheck.regex_validate($scope.user.mobile, /^1[34578]\d{9}$/, '手机号不正确') ||
         !FormCheck.not_blank($scope.user.code, '验证码不能为空') ||
         !FormCheck.min_length($scope.user.password, 6, '密码太短，至少为6位') ) {
      return;
    }

    // 校验验证码
    $ionicLoading.show();

    DataService.get('/auth_codes/check', { mobile: $scope.user.mobile, code: $scope.user.code })
      .then(function(res) {
        if (res.data.code === 0) {
          $rootScope.signupForm = $scope.user;
          $state.go('app.signup-final');
        } else {
          console.log(res.data.message);
        }
      }, function(err) {
        console.log(err);
      })
      .finally(function(){
        $ionicLoading.hide();
      });

  };

  // 获取验证码
  $scope.doFetchCode = function() {
    // alert('123');
    if ( !FormCheck.not_blank($scope.user.mobile, '手机号不能为空') || 
    !FormCheck.regex_validate($scope.user.mobile, /^1[34578]\d{9}$/, '手机号不正确') ) {
      return;
    }

    $ionicLoading.show();
    DataService.post('/auth_codes', { mobile: $scope.user.mobile }).then(function(res) {
      if (res.data.code == 0) {
        AWToast.showText('短信验证码已发送', 1500);
      } else {
        console.log(res.data.message)
        AWToast.showText(res.data.message, 1500);
      }
      console.log(res);
    }, function(err) {
      console.log(err);
      AWToast.showText('Oops, 服务器出错了', 1000);
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
})

// 注册第二步
.controller('SignupFinalCtrl', function($scope, $state, $ionicHistory, AWToast, FormCheck, DataService, $ionicLoading, $filter, $rootScope, UserService) {
  $scope.user = {mobile: '', password: '', code: '', realname: '',
stu_no: '', faculty_id: '', specialty_id: '', graduation_id: ''};

  $scope.faculties = [];
  $scope.specialties = [];
  $scope.graduations = [];

  $ionicLoading.show();
  DataService.get('/college/specialties')
    .then(function(res) {
      $scope.faculties = res.data.data;
    }, function(err) {
      console.log(err);
    })
    .finally(function() {
      // 加载班级
      DataService.get('/college/graduations')
      .then(function(res) {
        $scope.graduations = res.data.data;
      }, function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
      });
    });

  // 切换数据
  $scope.switchFaculty = function(fid) {
    var currentFaculty = $filter('filter')($scope.faculties, { id: fid });
    if (currentFaculty.length > 0) {
      $scope.specialties = currentFaculty[0].specialties;
    }
  };

  $scope.doRegister = function() {
    $scope.user.mobile = $rootScope.signupForm.mobile;
    $scope.user.password = $rootScope.signupForm.password;
    $scope.user.code = $rootScope.signupForm.code;

    if ( !FormCheck.not_blank($scope.user.mobile, '手机号不能为空') || 
         !FormCheck.regex_validate($scope.user.mobile, /^1[34578]\d{9}$/, '手机号不正确') ||
         !FormCheck.not_blank($scope.user.code, '验证码不能为空') ||
         !FormCheck.min_length($scope.user.password, 6, '密码太短，至少为6位') ||
         !FormCheck.not_blank($scope.user.realname, '真实姓名不能为空') ||
         !FormCheck.not_blank($scope.user.faculty_id, '必须选择院系') ||
         !FormCheck.not_blank($scope.user.specialty_id, '必须选择专业') ||
         !FormCheck.not_blank($scope.user.graduation_id, '必须选择班级') ) {
      return;
    }

    console.log($scope.user);

    // 提交注册
    $ionicLoading.show();
    DataService.post('/account/signup', $scope.user)
      .then(function(res) {
        if (res.data.code === 0) {
          UserService.login(res.data.data);
          // $state.go($rootScope.login_from);
          $ionicHistory.goBack(-2);
        } else {
          console.log(res.data.message);
        }
      }, function(err) {
        console.log(err);
      })
      .finally(function() {
        $ionicLoading.hide();
    });
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
