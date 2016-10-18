'use strict';

/*****************************************************************************
                                用户模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

 // 我的
.controller('UserCtrl', function($scope,$ionicHistory, $state, FormCheck, PopupService, DataService, $ionicLoading, UserService, AWToast, $cordovaCamera) {
  
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
    $scope.updateUser = { nickname: $scope.user.nickname, mobile: $scope.user.mobile, new_mobile: '', code: '', password: '' };
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
          $ionicHistory.goBack();
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
    DataService.post('/user/update_mobile', { token: $scope.user.token, mobile: $scope.updateUser.new_mobile, code: $scope.updateUser.code })
      .then(function(res) {
        if (res.data.code === 0) {
          $ionicHistory.goBack();
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
          $ionicHistory.goBack();
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
      $ionicHistory.goBack();
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
;