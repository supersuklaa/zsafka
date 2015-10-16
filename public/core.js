// public/core.js
var zsafka = angular.module('zsafka', []);

function main($scope, $http) {
	$scope.userdata = {};

	$scope.addUser = function() {
		$http.post('/add/user', $scope.userdata)
		.success(function(data) {
			$scope.userdata = {};
			console.log(data);
		})

		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.nutridata = {};

	$scope.addNutri = function() {
		$http.post('/add/nutri', $scope.nutridata)
		.success(function(data) {
			$scope.nutridata = {};
			console.log(data);
		})
		
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.portidata = {};

	$scope.addPorti = function() {
		$http.post('/add/porti', $scope.portidata)
		.success(function(data) {
			$scope.portidata = {};
			console.log(data);
		})
		
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
}