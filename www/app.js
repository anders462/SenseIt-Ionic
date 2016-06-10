// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular
.module('SenseIt',[
  //Angular Modules
  'ionic',
 'ngResource',
 'highcharts-ng',
  //Third party Modules
  'ui.router',
  //Own Modules
  'SenseIt.core',
  'SenseIt.home',
  'SenseIt.auth',
  'SenseIt.dashboard',
  'SenseIt.devices',
  'SenseIt.sensors',
  'SenseIt.activate'

])
.run(preparePlatform)
.config(configFunction)
.constant("BASE_URL", "https://sense-it.herokuapp.com/")
.run(stateAuthenticate);

//PREPARE IONIC PLATFORM
preparePlatform.$inject = ['$ionicPlatform'];

function preparePlatform($ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
};

//MAIN APP MODULE CONFIG FUNCTION
configFunction.$inject = ['$stateProvider', '$urlRouterProvider']

function configFunction($stateProvider, $urlRouterProvider) {

        $stateProvider.state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'common/sidebar.html',
                controller: 'AppCtrl as vm',
                data : {authenticate: false
                   }
              })
              .state('app.about', {
                     url: '/about',
                     views: {
                    'mainContent': {
                      templateUrl: 'common/about.html',
                      controller: 'AppCtrl as vm',
                   }
                 },
                 data : {authenticate: false
                    }
               })
               .state('app.resources', {
                      url: '/resources',
                      views: {
                     'mainContent': {
                       templateUrl: 'common/resources.html',
                       controller: 'AppCtrl as vm',
                    }
                  },
                  data : {authenticate: false
                     }
                })
                .state('app.support', {
                       url: '/support',
                       views: {
                      'mainContent': {
                        templateUrl: 'common/support.html',
                        controller: 'AppCtrl as vm'
                     }
                   },
                   data : {authenticate: false
                      }
                 })
                 .state('app.login', {
                        url: '/login',
                        views: {
                       'mainContent': {
                         templateUrl: 'common/login.html',
                         controller: 'AppCtrl as vm'
                      }
                    },
                    data : {authenticate: false
                       }
                  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
};

stateAuthenticate.$inject = ['$rootScope', '$state', 'authFactory'];

function stateAuthenticate($rootScope, $state, authFactory){

  authFactory.isAuthenticated()
  .then(function(resp){
    console.log("isAuthenticated resp", true);
    authFactory.cacheAuthState(true);
  })
  .catch(function(err){
    authFactory.cacheAuthState(false);
    console.log("isAuthenticated resp", false);
  });

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    console.log("tostate", toState.data.authenticate);
    console.log("authState",authFactory.getAuthState());
    console.log("if statement",toState.data.authenticate && !authFactory.getAuthState())
    if (toState.data.authenticate && !authFactory.getAuthState()){
      // User isn’t authenticated
      console.log('transition to', toState);
      $state.transitionTo("app.home");
      event.preventDefault();
    }
  });

  // // .fromTemplateUrl() method
  // $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.popover = popover;
  // });


  // $scope.openPopover = function($event) {
  //   $scope.popover.show($event);
  // };
  // $scope.closePopover = function() {
  //  $scope.popover.hide();
  // };
  // //Cleanup the popover when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.popover.remove();
  // });
  // // Execute action on hide popover
  // $scope.$on('popover.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove popover
  // $scope.$on('popover.removed', function() {
  //   // Execute action
  // });

}
