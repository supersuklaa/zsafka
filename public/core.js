// public/core.js
var zsafka = angular.module('zsafka', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when submitting the add form, send the text to the node API
    $scope.addUser = function() {
        $http.post('/add/user', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



}
