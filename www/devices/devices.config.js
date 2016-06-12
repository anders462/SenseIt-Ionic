(function(){

'use strict';

//devices sub module route config
angular
  .module('SenseIt.devices')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider){

          $stateProvider.state('app.devices', {
          url: '/devices',
          views: {
            'mainContent': {
              templateUrl: 'dashboard/dashboard.html',
              controller: 'DeviceController as vm'
            }
          },
          data : {authenticate: true
             }
        });


      };




})();
