/**
 * lights
 */
define(["three", "scene"], function ( THREE, scene ){

    'use strict';

    var ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add( ambientLight );

	// Spot Top
	var dirLight = addShadowedLight( 2.1, 8, 3, 0xffffff, 0.6 );
		
	function addShadowedLight( x, y, z, color, intensity ) {

		var directionalLight = new THREE.DirectionalLight( color, intensity );
		directionalLight.position.set( x, y, z );
		scene.add( directionalLight );

		directionalLight.castShadow = true;
		// directionalLight.shadowDarkness = 0.1; //removed :(
		// directionalLight.shadowBias = -0.005;

		var d = 6;
		directionalLight.shadow.camera.left = -d;
		directionalLight.shadow.camera.right = d;
		directionalLight.shadow.camera.top = d;
		directionalLight.shadow.camera.bottom = -d;

		directionalLight.shadow.camera.near = directionalLight.position.y - d;
		directionalLight.shadow.camera.far = directionalLight.position.y + d;

		directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 2048;

		// var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
		// scene.add( helper );

		scene.add( directionalLight );

		return directionalLight;

	}

});