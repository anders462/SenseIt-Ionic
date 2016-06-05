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
  //Third party Modules
  'ui.router',
  //Own Modules
  'SenseIt.core',
  'SenseIt.home',
  // 'SenseIt.register',
  'SenseIt.login',
  'SenseIt.dashboard'
  // 'SenseIt.devices',
  // 'SenseIt.sensors',
  // 'SenseIt.activate',
  // 'SenseIt.logout'

])
.run(preparePlatform)
.config(configFunction)
.constant("BASE_URL", "http://192.168.1.70:8001/")

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
                controller: 'AppCtrl'
              })
              .state('app.about', {
                     url: '/about',
                     views: {
                    'mainContent': {
                      templateUrl: 'common/about.html',
                      controller: 'AppCtrl',
                      controllerAs: 'vm'
                   }
                 }
               })
               .state('app.resources', {
                      url: '/resources',
                      views: {
                     'mainContent': {
                       templateUrl: 'common/resources.html',
                       controller: 'AppCtrl',
                       controllerAs: 'vm'
                    }
                  }
                })
                .state('app.support', {
                       url: '/support',
                       views: {
                      'mainContent': {
                        templateUrl: 'common/support.html',
                        controller: 'AppCtrl',
                        controllerAs: 'vm'
                     }
                   }
                 })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
};
