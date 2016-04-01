/**
 * Setup the control method
 */

define([
       "three",
       "camera",
       "container",
       "FPSMover"
       ], function ( THREE, camera, container, FPSMover ) {

    'use strict';

	// CONTROLS
	// camera.position.set( 0, 2, 8 );
	/*
	var controls = new THREE.OrbitControls( camera, container );
	controls.rotateSpeed = 0.10;
	controls.enableDamping = true;
	controls.dampingFactor = 0.15;

	// controls.minPolarAngle = -Math.PI*.85; 
	// controls.maxPolarAngle = Math.PI*.55;
	controls.minDistance = 0.50;
	// controls.maxDistance = 10;

	// INITIAL CAMERA POSITION AND TARGET
	controls.target.set( 0, 1, 0 );

	// http://www.w3schools.com/cssref/playit.asp?filename=playcss_cursor&preval=alias
	container.style.cursor = "grab";
	// chrome
	container.style.cursor = "-webkit-grab";
	*/
	// controls.constraint.dollyIn( 1.3 );
	// controls.enablePan = false;
	// controls.enableKeys = false;
	// controls.minDistance	= 200;
	// controls.maxDistance	= 700;
	// controls.zoomSpeed	= 0.3;
	// controls.rotateSpeed = 0.5;

	// smooth Zoom
	// controls.constraint.smoothZoom = true;
	// controls.constraint.zoomDampingFactor = 0.2;
	// controls.constraint.smoothZoomSpeed = 2.0;


	var controls = new FPSMover( camera, container );
	// controls.getControls().enabled = true;
	
    return controls;
});