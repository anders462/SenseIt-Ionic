(function(){

'use strict';

//dashboard sub module route config
angular
  .module('SenseIt.dashboard')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.dashboard', {
    url: '/dashboard',
    views: {
      'mainContent': {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardController as vm'
      }
    },
    data : {authenticate: true
       }
  });

};




})();
