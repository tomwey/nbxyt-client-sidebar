'use strict';

/*****************************************************************************
                                捐赠模块
 *****************************************************************************/
 angular.module('xiaoyoutong.controllers')

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
.controller('ArticlesCtrl', function($scope, $stateParams, DataService, $ionicLoading, PAGE_SIZE) {
  
  var _this = this;
  
  $scope.currentPage = 1;
  $scope.pageSize    = PAGE_SIZE;
  $scope.noMoreItemsAvailable = true;
  $scope.totalPage   = 1;
  
  this.loadData = function(page, size) {
    console.log('loading page: ' + page);
    $ionicLoading.show();
    DataService.get('/articles/type' + parseInt($stateParams.id), { page: page, size: size }).then(function(result) {
      
      if (result.data.code === 0) {
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
      } else {

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
.controller('DonateApplyCtrl', function($scope, DataService, $ionicLoading, AWToast) {
  $scope.donate_apply = { content: '', contact: '' };
  
  $scope.commitApply = function() {
    
    var content = $scope.donate_apply.content;
    if (content.trim() === '') {
      // alert('内容必填');
      AWToast.showText('捐赠意向不能为空', 1500);
      return;
    }
    
    var author = $scope.donate_apply.contact;
    if (author.trim() === '') {
      // alert('联系方式必填');
      AWToast.showText('联系方式不能为空', 1500);
      return;
    }
    
    $ionicLoading.show();
    DataService.post('/donates/apply', $scope.donate_apply).then(function(res) {
      // console.log(response.data);
      if (res.data.code === 0) {
        AWToast.showText('提交成功', 1500);
        $scope.donate_apply = { content: '', contact: '' };
      } else {
        AWToast.showText(res.data.message, 1500);
      }
      
    }, function(err) {
      // console.log(err);
      AWToast.showText('服务器出错', 1500);
    }).finally(function() {
      $ionicLoading.hide();
    });
  };
})
;