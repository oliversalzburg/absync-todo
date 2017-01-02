"use strict";
/* global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module( "todomvc" )
	.controller( "TodoCtrl", function TodoCtrl( $log, $routeParams, $scope, $filter, absync ) {
		var todos = absync.sync( "todosInstant", {
			model          : "Todo",
			collectionName : "todos",
			collectionUri  : "/api/todos",
			entityName     : "todo",
			entityUri      : "/api/todos",
			debug          : true
		} );

		$log.info( "Loading todo data…" );
		todos.ensureLoaded()
			.then( function onLoaded() {
				$scope.$apply( function() {
					$scope.todos = todos.entityCache;
					$log.info( "Todo data has been added to scope." );
				} );
			} );

		$scope.newTodo    = "";
		$scope.editedTodo = null;

		// No idea why we need to invoke a digest cycle manually.
		// This is something we need to look into.
		$scope.$root.$on( "entityNew", angular.bind( $scope, $scope.$apply ) );
		$scope.$root.$on( "entityUpdated", angular.bind( $scope, $scope.$apply ) );
		$scope.$root.$on( "entityRemoved", () => {
			debugger;
		} );

		$scope.$watch( "todos", function() {
			$scope.remainingCount = $filter( "filter" )( todos.entityCache, {
				completed : false
			} ).length;
			$scope.completedCount = todos.entityCache.length - $scope.remainingCount;
			$scope.allChecked     = !$scope.remainingCount;
		}, true );

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on( "$routeChangeSuccess", function() {
			var status = $scope.status = $routeParams.status || "";
			$scope.statusFilter = ( status === "active" ) ?
			                      {
				                      completed : false
			                      } : ( status === "completed" ) ?
			                          {
				                          completed : true
			                          } : {};
		} );

		$scope.addTodo = function() {
			var newTodo = {
				title     : $scope.newTodo.trim(),
				completed : false
			};

			if( !newTodo.title ) {
				return;
			}

			$scope.saving = true;
			return todos.create( newTodo )
				.then( function success() {
					$scope.newTodo = "";
				} )
				.finally( function() {
					$scope.saving = false;
					$scope.$apply();
				} );
		};

		$scope.editTodo = function( todo ) {
			$scope.editedTodo   = todo;
			// Clone the original todo to retodoStorage it on demand.
			$scope.originalTodo = angular.extend( {}, todo );
		};

		$scope.saveEdits = function( todo, event ) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if( event === "blur" && $scope.saveEvent === "submit" ) {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if( $scope.reverted ) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if( todo.title === $scope.originalTodo.title ) {
				$scope.editedTodo = null;
				return;
			}

			var editPromise;

			if( !todo.title ) {
				editPromise = todos.delete( todo )
			} else {
				editPromise = todos.update( todo );
			}

			return editPromise
				.finally( function() {
					$scope.editedTodo = null;
				} );
		};

		$scope.revertEdits = function( todo ) {
			todos[ todos.indexOf( todo ) ] = $scope.originalTodo;
			$scope.editedTodo              = null;
			$scope.originalTodo            = null;
			$scope.reverted                = true;
		};

		$scope.removeTodo = function( todo ) {
			todos.delete( todo );
		};

		$scope.saveTodo = function( todo ) {
			todos.update( todo );
		};

		$scope.toggleCompleted = function( todo, completed ) {
			if( angular.isDefined( completed ) ) {
				todo.completed = completed;
			}
			todos.update( todo );
		};

		$scope.clearCompletedTodos = function() {
			todos.clearCompleted();
		};

		$scope.markAll = function( completed ) {
			todos.entityCache.forEach( function( todo ) {
				if( todo.completed !== completed ) {
					$scope.toggleCompleted( todo, completed );
				}
			} );
		};
	} );
