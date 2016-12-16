/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module( "todomvc", [ "absync", "ngRoute", "ngResource" ] )
	.config( function( $routeProvider, absyncProvider ) {
		var routeConfig = {
			controller  : "TodoCtrl",
			templateUrl : "todomvc-index.html"
		};

		$routeProvider
			.when( "/", routeConfig )
			.when( "/:status", routeConfig )
			.otherwise( {
				redirectTo : "/"
			} );

		var ioSocket = io();
		absyncProvider.configure( {
			module : "todomvc",
			socket : ioSocket,
			debug  : true
		} );
	} );
