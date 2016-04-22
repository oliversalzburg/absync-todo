"use strict";

const _          = require( "lodash" );
const bodyParser = require( "body-parser" );
const http       = require( "http" );
const express    = require( "express" );
const socketIo   = require( "socket.io" );
const uuid       = require( "node-uuid" );

const app    = express();
const server = http.Server( app );
const io     = socketIo( server );

// Serve our front-end application
app.use( express.static( "public" ) );

// Construct our API
const api = new express.Router();
api.use( bodyParser.json() );

let todos = [];

// API Routes.
api.get( "/", ( request, response ) => {
	response.status( 200 )
		.set( "Content-Type", "text/plain" )
		.send( "ok" );
} );

api.get( "/todos", ( request, response ) => {
	response.json( {
		todos : todos
	} );
} );

api.get( "/todos/:id", ( request, response ) => {
	const todo = _.find( todos, {
		id : request.params.id
	} );

	if( !todo ) {
		return response.sendStatus( 404 );
	}

	response.sendStatus( 200 ).send( {
		todo : todo
	} );
} );

api.post( "/todos", ( request, response ) => {
	const todo = request.body.todo;
	todo.id    = uuid.v4();
	todos.push( todo );
	response.status( 201 ).send( {
		todo : {
			id : todo.id
		}
	} );

	io.emit( "todo", {
		todo : todo
	} );

	console.log( `New todo ${todo.id}` );
} );

api.put( "/todos/:id", ( request, response ) => {
	let todoIndex = _.findIndex( todos, {
		id : request.params.id
	} );

	if( !request.body.todo ) {
		return response.sendStatus( 400 );
	}

	if( todoIndex < 0 ) {
		return response.sendStatus( 404 );
	}

	todos[ todoIndex ] = request.body.todo;
	const todo         = todos[ todoIndex ];

	response.status( 200 ).send( {
		todo : todo
	} );

	io.emit( "todo", {
		todo : todo
	} );

	console.log( `Updated todo ${todo.id}` );
} );

api.delete( "/todos", ( request, response ) => {
	const completed = _.filter( todos, {
		completed : true
	} );

	if( !completed || !completed.length ) {
		return response.sendStatus( 404 );
	}

	todos = _.reject( todos, {
		completed : true
	} );

	io.emit( "todos", {
		todos : todos
	} );

	response.status( 200 );
} );

api.delete( "/todos/:id", ( request, response ) => {
	const todo = _.find( todos, {
		id : request.params.id
	} );

	if( !todo ) {
		return response.sendStatus( 404 );
	}

	io.emit( "todo", {
		todo : {
			id : todo.id
		}
	} );

	todos = _.without( todos, todo );

	console.log( `Deleted todo ${todo.id}` );
} );

// Include the API and start listening for requestuests
app.use( "/api", api );
server.listen( 3000 );
