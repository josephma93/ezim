angular.module('ezim', [
		'ngRoute',
		'ezim.home'
	])
	.config(['$routeProvider', function configStage($routeProvider) {
		$routeProvider
			.when('/home', {
				controller: 'homeController as HomeCtrl',
				templateUrl: 'js/home/home.tpl.html'
			})
			.otherwise('/home');
	}]);
	
(function IIFE() {
	document.addEventListener('deviceready', function deviceReady() {
		angular.bootstrap(document.getElementById('ezim'), ['ezim'])
	}, false);
})();