
var zsafka = angular.module('zsafka', []);

function main($scope, $http) {

	$scope.add = function(target) {

		$http.post('/add/' + target, $scope[target])
		.success(function(data) {
			$scope[target] = {};
			console.log(data);
		})
		.error(function(data) {
			console.log('error: ' + data);
		});
	};

}