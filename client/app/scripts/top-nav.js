(function() {
    
    var app = angular.module('myApp');
  
    app.controller('topNavCtrl', ["$rootScope", "$location", '$auth', "$http", 
        function ($rootScope, $location, $auth, $http) {
            var vm = this;
            
            vm.isAuthenticated = function() { return $auth.isAuthenticated(); }
            
            vm.logout = function() {
                if ($auth.isAuthenticated()) {
                    $auth.logout().then(function(){
                        $rootScope.currentUser = null;
                        $window.localStorage.currentUser = null;
                        $location.path('/'); 
                    });
                }
            };
            
            vm.getUsername = function() {
                return (vm.isAuthenticated() && $rootScope.currentUser.name) || "";
            };
            
            vm.isActive = function(viewLocation) { 
                return viewLocation === $location.path();
            };
        }
    ]);
  
    app.directive("topNav", function () {
        return {
            restrict: 'E',
            templateUrl: "/app/views/top-nav.html",
            controller: "topNavCtrl",
            controllerAs: "nav"
        };
    });
  
}());
