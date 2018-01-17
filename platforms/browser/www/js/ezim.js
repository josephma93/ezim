angular.module('ezim', [
		'ngRoute',
		'ezim.home'
	])
	.config(['$routeProvider', function configStage($routeProvider) {
		$routeProvider
			.when('/home', {
				controller: 'homeController as HomeCtrl',
				templateUrl: 'js/app/home.tpl.html'
			})
			.otherwise('/home');
	}])
	.run([
		'fileApi',
		function runFn(fileApi) {
			fileApi.requestAccessToFileSystem();
		}
	]);
	
(function IIFE() {
	var isAppForeground = true;
	
	function onPause() {
		if (isAppForeground) {
			admob.destroyBannerView();
			isAppForeground = false;
		}
	}
	
	function onResume() {
		if (!isAppForeground) {
			setTimeout(admob.createBannerView, 1);
			isAppForeground = true;
		}
	}
	
	function initAds() {
		admob.setOptions({
			publisherId: "ca-app-pub-5123722582685343/8279241083",
		});

		document.addEventListener("pause", onPause, false);
		document.addEventListener("resume", onResume, false);
	}
	
	document.addEventListener('deviceready', function deviceReady() {
		document.removeEventListener('deviceready', deviceReady, false);
		
		angular.bootstrap(document.getElementById('ezim'), ['ezim']);
	
		initAds();
		admob.createBannerView();
	}, false);
})();