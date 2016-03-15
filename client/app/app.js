/* global angular */
(function() {
    $.material.init();
    
    var app = angular.module('myApp', [ 'ngRoute', "satellizer", "ngMaterial", "angularGrid", "angular-images-loaded" ]);
  
    app.config(["githubAppId", '$routeProvider','$httpProvider', '$authProvider',
        function (githubAppId, $routeProvider, $httpProvider, $authProvider) {
   
            $routeProvider.when("/Home", {
                templateUrl: "/app/views/home.html",
                controller: "homeCtrl",
                controllerAs: "vm"

            }).when("/Login", {
                templateUrl: "/app/views/login.html",
                controller: "loginCtrl",
                controllerAs: "vm",
                
            }).when("/Me", {
                templateUrl: "/app/views/me.html",
                controller: "meCtrl",
                controllerAs: "vm",

            }).when("/Add", {
                templateUrl: "/app/views/add.html",
                controller: "addCtrl",
                controllerAs: "vm",
                
            }).when("/User/:userid", {
                templateUrl: "/app/views/user-wall.html",
                controller: "userWallCtrl",
                controllerAs: "vm",
                
            }).otherwise({ redirectTo: "/Home" });
            
            $authProvider.github({ clientId: githubAppId });

   }]);
   
    app.run(["$rootScope", "$window", "$auth", "$http", function($rootScope, $window, $auth, $http) {
        if ($auth.isAuthenticated()) {
            if ($window.localStorage.currentUser) {
                try {
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                } catch(e) {}
            }
        }
    }]);
   
  fetchData().then(launchApplication);

  function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");
    return $http.get("/api/config").then(function(resp){
      app.constant("githubAppId", resp.data.githubAppId);
    });
  };

  function launchApplication() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["myApp"]);
    });
  };
  
}());
