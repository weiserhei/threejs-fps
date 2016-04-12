/**
 * Move Camera
 * fit viewspace to model size
 */
define([
       "three", 
       "camera",
], function ( THREE, camera ) {

    'use strict';

	var listener = new THREE.AudioListener();
	camera.add( listener );

	return listener;

});