
var zsafka = angular.module('zsafka', []);

function main($scope, $http) {

	$scope.formlogin = function() {

		$http.post('/login/', $scope.login)
		.success(function(data) {
			$scope.wots = data;
			console.log(data);
		})
		.error(function(data) {
			$scope.wots = data;
			console.log(data);
		});
	};

}