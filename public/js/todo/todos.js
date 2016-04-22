"use strict";

angular
	.module( "todomvc" )
	.config( registerTodoService )
	.run( configureService );

/* @ngInject */
function registerTodoService( absyncProvider ) {
	absyncProvider.collection( "todos",
		{
			model          : "Todo",
			collectionName : "todos",
			collectionUri  : "/api/todos",
			entityName     : "todo",
			entityUri      : "/api/todos"
		}
	);
}

/* @ngInjec */
function configureService( $http, todos ) {
	todos.throwFailures = true;

	todos.clearCompleted = function() {
		return $http.delete( "/api/todos" );
	}
}
