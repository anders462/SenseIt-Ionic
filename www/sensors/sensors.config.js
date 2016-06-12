(function(){

'use strict';

//sensor sub module route config
angular
  .module('SenseIt.sensors')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider){

          $stateProvider.state('app.sensors', {
          url: '/sensors',
          views: {
            'mainContent': {
              templateUrl: 'dashboard/dashboard.html',
              controller: 'SensorController as vm'
            }
          },
          data : {authenticate: true
             }
        });


      };




})();
