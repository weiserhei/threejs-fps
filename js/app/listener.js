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
	listener.setMasterVolume( 0.5 );

    // Do we have a saved value for this controller?
    // if (type != 'function' &&
    //     DAT.GUI.saveIndex < DAT.GUI.savedValues.length) {
    //   controllerObject.setValue(DAT.GUI.savedValues[DAT.GUI.saveIndex]);
    //   DAT.GUI.saveIndex++;
    // }

	camera.add( listener );

	var SoundControls = {
		master: listener.getMasterVolume()
	};

    var dg = debugGUI;
	// dg.remember( SoundControls );

	var folder = dg.getFolder( "Debug Menu" );
	folder.add( SoundControls, "master" ).min(0.0).max(1.0).step(0.01).name("Volume").onChange(
	    function() {
			listener.setMasterVolume( SoundControls.master );
		});

	if ( debugGUI.__rememberedObjects[ 0 ] !== undefined ) {
		var vol = debugGUI.__rememberedObjects[ 0 ].master;
		listener.setMasterVolume( vol );
	}

	return listener;

});