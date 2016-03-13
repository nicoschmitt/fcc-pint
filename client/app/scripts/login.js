(function() {
    
    var app = angular.module('myApp');
  
    app.controller('loginCtrl', ["$rootScope", '$http', "$location", "$auth", "$window",
        function ($rootScope, $http, $location, $auth, $window) {
            var vm = this;
            
            vm.message = "";
            
            vm.authenticate = function(provider) {
                $auth.authenticate(provider)
                    .then(function(response) {
                        console.log("logged in");
                        $rootScope.currentUser = response.data.user;
                        $window.localStorage.currentUser = JSON.stringify(response.data.user);            
                        $location.path('/');
                    })
                    .catch(function(error) {
                        console.log("error during login");
                        if (error.error) vm.message = error.error;
                        else if (error.data) vm.message = error.data.message;
                        else vm.message = error;
                    });
            }
        }
    ]);
  
}());
