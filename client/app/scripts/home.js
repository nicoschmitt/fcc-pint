(function() {
    
    var app = angular.module('myApp');
  
    app.controller('homeCtrl', ['$http', "$auth",
        function ($http, $auth) {
            var vm = this;
            
            vm.isAuthenticated = $auth.isAuthenticated;
            
            vm.loading = true;
            vm.message = "";
            vm.images = [];
            
            vm.imgLoaded = {
                fail: function(instance) {
                   angular.element(instance.images[0].img).attr("src", "/img/placeholder.png");
                }
            };
            
            var handleError = function(resp) {
                vm.loading = false;
                vm.message = resp.data;
                console.log(resp.data);
            };
            
            $http.get("/api/pin").then(function(resp) {
                console.log(resp.data.length + " images.");
                vm.loading = false;
                vm.images = resp.data.map(i => {
                   i.when = moment(i.when).fromNow();
                   return i; 
                });
            }, handleError);
        }
    ]);
  
}());