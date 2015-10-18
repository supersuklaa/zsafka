
var zsafka = angular.module('zsafka', []);

function main($scope, $http) {

	$http.get('/data/dailyvalues')
		.success(function(data) {
			$scope.wats = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$http.get('/data/dailyportions')
		.success(function(data) {
			$scope.wots = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.add = function(target) {

		$http.post('/add/' + target, $scope[target])
		.success(function(data) {
			$scope[target] = {};
			$scope.wats = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('error: ' + data);
		});
	};

}