/**
 * Preload
 */

define([ "three", "loadingScreen" ], function ( THREE, loadingScreen ) {

	var loadingManager = new THREE.LoadingManager ();

	loadingManager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );
		// loadingScreen.setProgress( loaded, total );

	};

	loadingManager.onError = function ( url ) {

		console.warn( "Loading Error", url );

	}

	return loadingManager;

});