/*
"use strict";

angular
	.module( "todomvc" )
	.config( registerTodoService )
	.run( configureService );

/!**
 * This showcases how to register an absync service which will can be injected.
 *!/

/!* @ngInject *!/
function registerTodoService( absyncProvider ) {
	absyncProvider.collection( "todos",
		{
			model          : "Todo",
			collectionName : "todos",
			collectionUri  : "/api/todos",
			entityName     : "todo",
			entityUri      : "/api/todos",
			debug          : true
		}
	);
}

/!* @ngInject *!/
function configureService( $http, todos ) {
	todos.throwFailures = true;

	todos.clearCompleted = function() {
		return $http.delete( "/api/todos" );
	};
}
*/
