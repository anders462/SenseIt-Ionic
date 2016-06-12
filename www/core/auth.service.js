(function(){
'use strict';

  //Factory for all authentication API calls part of sub module "core"
angular
  .module('SenseIt.core')
    .factory('authFactory', authFactory);

    authFactory.$inject = ['BASE_URL', '$http', '$window','$q'];

    function authFactory(BASE_URL, $http, $window, $q){
      var authState = false;

      // Returns Login resource
      var login = function(creds) {
        console.log(creds.username, creds.password);
        return $http.post(BASE_URL +'users/login',creds);
      }

      // Returns register resource
      var register = function(creds) {
        console.log("creds",creds);
        return $http.post(BASE_URL +'users/register',creds);
      }
      //returns password update resources
      var update = function(creds) {
        return $http.put(BASE_URL +'users/update',creds,{headers: {"x-access-token": $window.localStorage.token}});
      }
      //return info about user used in mqtt service to connect
      var getMe = function() {
        return $http.get(BASE_URL +'users/me',{headers: {"x-access-token": $window.localStorage.token}});
      }

      //checks if user is authenticated
      var isAuthenticated = function(){
        var deferred = $q.defer();

        getMe()
        .then(function(resp){
          console.log("authenticated",resp);
          deferred.resolve(resp);
        })
        .catch(function(err){
          console.log(err);
          deferred.reject(err);
        })
        // return promise object
        return deferred.promise;
      }

      //cache AuthState
      var cacheAuthState = function(state) {
        authState = state;
      };
      //get cached authState
      var getAuthState = function(state) {
        return authState;
      };

      //Sets the token in localStorage
      var setToken = function(token){
        $window.localStorage.token = token;
      }

      //Gets token from localStorage
      var getToken = function(){
        if ($window.localStorage.token){
          return $window.localStorage.token
        } else {
          return null;
        }
      }

      //delete token and remove cashe from localStorage at logout
      var deleteToken = function(){
        $window.localStorage.removeItem("token");
        $window.localStorage.removeItem("cache");
        $window.localStorage.removeItem('currentUser');
      }
      //set currentUser in localStorage
      var setCurrentUser = function(user) {
        console.log("setuser",user)
        $window.localStorage.currentUser = JSON.stringify(user);
      }
      //get currentUser from localStorage
      var getCurrentUser = function(){
        if ($window.localStorage.currentUser){
          return JSON.parse($window.localStorage.currentUser);
        } else {
          return null;
        }
      }
      //change activated status of currentUser in localStorage
      var setCurrentUserActivated = function(activated){
          var currentUser = JSON.parse($window.localStorage.currentUser);
          currentUser.activated = activated;
          $window.localStorage.currentUser = JSON.stringify(currentUser);

      }



//make methods available for others to use
      return {
        login: login,
        register: register,
        setToken: setToken,
        getToken: getToken,
        deleteToken: deleteToken,
        update: update,
        setCurrentUser: setCurrentUser,
        getCurrentUser: getCurrentUser,
        setCurrentUserActivated: setCurrentUserActivated,
        getMe:getMe,
        isAuthenticated: isAuthenticated,
        getAuthState: getAuthState,
        cacheAuthState: cacheAuthState
      };


    };








})();
