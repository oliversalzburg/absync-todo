"use strict";

angular
	.module( "todomvc" )
	.config( registerTodoService );

/* @ngInject */
function registerTodoService( absyncProvider ) {
	absyncProvider.collection( "todos",
		{
			model          : "Todo",
			collectionName : "todos",
			collectionUri  : "/api/todos",
			entityName     : "todo",
			entityUri      : "/api/todo"
		}
	);
}
