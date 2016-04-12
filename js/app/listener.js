/**
 * Move Camera
 * fit viewspace to model size
 */
define([
       "three", 
       "camera",
       "debugGUI"
], function ( THREE, camera, debugGUI ) {

    'use strict';

	var listener = new THREE.AudioListener();
	listener.setMasterVolume( 0 );

	camera.add( listener );

	var SoundControls = {
		master: listener.getMasterVolume()
	};

    var dg = debugGUI;
	var folder = dg.getFolder( "Debug Menu" );
	dg.add( SoundControls, "master" ).min(0.0).max(1.0).step(0.01).name("Volume").onChange(function() {
			listener.setMasterVolume(SoundControls.master);
		});

	return listener;

});