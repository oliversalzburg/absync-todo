"use strict";

angular
	.module( "todomvc" )
	.factory( "Todo", retrieveTodoModel );

/* @ngInject */
function retrieveTodoModel() {
	return Todo;
}

var Todo = (function() {
	function Todo( title, completed ) {
		this.title     = title;
		this.completed = completed;
	}

	return Todo;
})();
