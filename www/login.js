
var zsafka = angular.module('zsafka', []);

function main($scope, $http, $window) {

	$scope.formlogin = function() {

		$http.post('/login/', $scope.login)
		.success(function(data) {
			console.log(data);
			if (data.error) $scope.error = data.error;
			if (data.success) $window.location.reload();

		})
		.error(function(data) {
			$scope.wots = data;
			console.log('x' + data);
		});

	};


}