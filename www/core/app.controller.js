angular.module('SenseIt.core', [])
 .controller('AppCtrl', AppCtrl)


AppCtrl.$inject = ['$scope', '$ionicModal', '$timeout'];


function AppCtrl($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:

};
