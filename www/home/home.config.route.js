(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.home')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
      }
    }
  })



      }




})();
