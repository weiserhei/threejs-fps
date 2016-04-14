/**
 * Setup the control method
 */

define([
       "three",
       "camera",
       "container",
       "FPSMover",
       "Crosshair",
       "debugGUI"
       ], function ( THREE, camera, container, FPSMover, Crosshair, debugGUI ) {

    'use strict';

	// CONTROLS
	/*
	camera.position.set( 0, 2, 8 );
	
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

	var crosshair = new Crosshair( 0.003, 0.002, camera );

	function thirdPerson( value ) {
		if( value ) {
			camera.position.set( 0, 1.5, 6 );
			controls.mesh.material.visible = value;
			crosshair.visible = false;

		} else {
			camera.position.set( 0, 0, 0 );
			controls.mesh.material.visible = value;
			crosshair.visible = true;
		}
	}

	var options = {
		thirdPerson: false,
		reset: function() { 
			tweenHelper.resetCamera( 600 );
		},
	}
	var dg = debugGUI.getFolder("Controls")
	dg.add( options, "thirdPerson" ).name("Third Person Camera").onChange( thirdPerson );
	dg.add( controls, "reset" ).name("Reset Player");
	// dg.add( options, "reset" ).name("Reset Camera");

    return controls;
});