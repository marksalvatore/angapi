(function(){
	'use strict';

	var app = angular.module('app', ['ngRoute']);

	// Constants
	app.constant('ENDPOINT', {
			itunes : 'https://itunes.apple.com/us/rss/topalbums/limit=100/json'
	});
	app.constant('BREAKPOINT', {
			wide : 510
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
	app.controller('MainCtrl', ['$scope', 'DataSrvc', 'ENDPOINT', 'BREAKPOINT', function($scope, DataSrvc, ENDPOINT, BREAKPOINT) {

		var vm = this; // view model
		vm.albumInfoOPEN = false; // only for narrow viewport
		vm.artist = null;
		vm.title = null;
		vm.price = null;
		vm.url = null;

		// Monitor resizing of browser window
		vm.wideViewport = false;
		_determineViewportWidth();
		$(window).resize(function() {
		  _applyViewportWidth();
		});

		// Get Albums
		DataSrvc.getData(ENDPOINT.itunes)
			.then(function(resp){
				vm.albums = resp.data.feed.entry;
				console.log("Received album info");
			},
			function(error){
				console.log("Couldn't connect: " + error);
			}
		);

		vm.goitunes = function(url) {
			window.location.href = url;
		};

		vm.toggleAlbumInfo = function(id) {
			vm.albumInfoOPEN ? vm.albumInfoOPEN = false : vm.albumInfoOPEN = true;
			vm.artist = $('#' + id + ' .artist').text();
			vm.title = $('#' + id + ' .title').text();
			vm.price = $('#' + id + ' .price').text();
			vm.url = $('#' + id + ' .url').attr('href');
			$("html, body").animate({ scrollTop: 0 }, "slow");
		};
	
		function _applyViewportWidth() {
			_determineViewportWidth();
			$scope.$apply();
		}
		
		function _determineViewportWidth() {
			if ( $(window).width() > BREAKPOINT.wide ) {
				vm.wideViewport = true;
			} else {
				vm.wideViewport = false;
			}
		}

	}]); // MainCtrl


	// DataSrvc
	app.service('DataSrvc', ['$http', function($http) {
		this.getData = function(url){
			return $http.get(url);
		};
	}]);

}());
