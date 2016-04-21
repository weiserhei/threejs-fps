/**
 * lights
 */
define(["three", "scene", "debugGUI"], function ( THREE, scene, debugGUI ){

    'use strict';

    var ambientLight = new THREE.AmbientLight( 0x444444 );
    scene.add( ambientLight );

    var folder = debugGUI.getFolder("Light");

	// Spot Top
	var dirLight = addShadowedLight( 2.1, 8, 3, 0xffffff, 0.6 ); //0.6
	folder.add( dirLight, "intensity" ).min( 0 ).max( 3 );
	folder.addThreeColor( dirLight, "color" );
		
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


		// var light = new THREE.SpotLight( 0xffffff, 1.5 );
		// light.position.set( 0, 500, 2000 );
		// light.castShadow = true;
		// directionalLight.shadow = new THREE.SpotLightShadow( new THREE.PerspectiveCamera( 50, 1, 0.1, 20 ) );
		// directionalLight.shadow = new THREE.SpotLightShadow( new THREE.PerspectiveCamera() );
		// console.log( directionalLight.shadow );
		// light.shadow.bias = - 0.00022;
		// directionalLight.shadow.mapSize.width = 2048;
		// directionalLight.shadow.mapSize.height = 2048;


		// var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
		// scene.add( helper );

		scene.add( directionalLight );

		return directionalLight;

	}

});