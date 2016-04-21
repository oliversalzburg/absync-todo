"use strict";

const _          = require( "lodash" );
const bodyParser = require( "body-parser" );
const express    = require( "express" );
const uuid       = require( "node-uuid" );

const app = express();
// Serve our front-end application
app.use( express.static( "public" ) );

// Construct our API
const api = new express.Router();
api.use( bodyParser.json() );

const todos = new Map();

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
	todos.get( request.param( "id" ), _handleApiResponse( response ) );
} );

api.post( "/todos", ( request, response ) => {
	const id = uuid.v4();
	todos.set( id, request.body );
	response.status( 201 ).send( {
		todo : {
			id : id
		}
	} );
} );

api.put( "/todos/:id", ( request, response ) => {
	todos.update( request.param( "id" ), request.body, _handleApiResponse( response ) );
} );

api.delete( "/todos", ( request, response ) => {
	todos.deleteCompleted( _handleApiResponse( response, 204 ) );
} );

api.delete( "/todos/:id", ( request, response ) => {
	todos.delete( request.param( "id" ), _handleApiResponse( response, 204 ) );
} );

function _handleApiResponse( response, successStatus ) {
	return function( err, payload ) {
		if( err ) {
			console.error( err );
			response.status( err.code ).send( err.message );
			return;
		}
		if( successStatus ) {
			response.status( successStatus );
		}
		response.json( payload );
	};
}

// Include the API and start listening for requestuests
app.use( "/api", api );
app.listen( 3000 );
