(function(){

'use strict';

//home page sub module
angular
  .module('SenseIt.sensors')
   .config(configFunction);

  configFunction.$inject = ['$stateProvider'];

  function configFunction($stateProvider){

    $stateProvider.state('app.sensors', {
          url: 'sensors',
          views: {
            'header': {
                templateUrl: 'app/common/header.html'
            },
            'content@': {
               templateUrl: 'app/sensors/sensors.html',
               controller:  'SensorController',
               controllerAs: 'vm'
            },
            'footer' : {
              templateUrl: 'app/common/footer.html'
            }
          },
          data : {
            authenticate: true  //TRUE in non testing mode
          }

        });



      }




})();
