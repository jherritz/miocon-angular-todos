angular.module('signIn', ['ngResource', 'ui'])
  .factory('Authenticator', function($resource, $http) {
    $http.defaults.withCredentials = true;
    return $resource('http://localhost\\:8050/miocon/app/:uri', {uri: 'login'}, {
        create: {method: 'POST', params: {_app: 'newUser'}},
        authenticate: {method: 'GET', params: {_app: 'signin'}, isArray: true},
        update: {method: 'POST', params: {uri: ''}}
    });
  })
	
  .controller('AuthenticationCtrl', function($scope, Authenticator) {
		$scope.user = {};
		
    $scope.createUser = function() {
			user = new Authenticator();
			user.name = 'Josh';
			user.email = 'jherritz@gmail.com';
			user.password1 = 'password';
			user.password2 = 'password';
			var error = new MioWeb.StringBuffer();
			if (MioWeb.checkPassword($scope.password, error) === true) {
				$scope.user.hash = hashFunction($scope.password);
				user.$create();
			}
			else { alert(error)};
    };

    $scope.signIn = function() {
			var error = new MioWeb.StringBuffer();
			$scope.user.hash = hashFunction($scope.password);
			Authenticator.authenticate($scope.user);
    };
		
		hashFunction = function(password) {
			return password;
		};
	})