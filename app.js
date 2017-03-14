(function(){
	'use strict';

	var app = angular.module('app', ['ngRoute']);

	// Constants
	app.constant('ENDPOINT', {
			itunes : 'https://itunes.apple.com/us/rss/topalbums/limit=100/json'
	});


	// Router
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider

		.when('/top-albums', {
			templateUrl: 'templates/home.html'
		})
		.otherwise({
			redirectTo: '/top-albums'
		});
	}]);

	// MainCtrl
	app.controller('MainCtrl', ['$rootScope', 'DataSrvc', 'ENDPOINT', function($rootScope, DataSrvc, ENDPOINT) {

		var vm = this;
		vm.wideViewport = false;

		// Get Albums
		DataSrvc.getData(ENDPOINT.itunes)
			.then(function(resp){
				vm.albums = resp.data.feed.entry;
				console.log("Here are the albums:");
				console.log(vm.albums);
			},
			function(error){
				console.log("Couldn't connect: " + error);
			}
		);

		vm.goitunes = function(url) {
			// go to itunes
			window.location.href = url;
		};
	

	}]); // MainCtrl


	// DataSrvc
	app.service('DataSrvc', ['$http', function($http) {
		this.getData = function(url){
			return $http.get(url);
		};
	}]);

}());
