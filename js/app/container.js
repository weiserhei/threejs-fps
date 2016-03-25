/**
 * DOM Container
 * 
 */
define( [], function () {

    'use strict';

	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	return container;
} );