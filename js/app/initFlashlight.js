/**
* Init flashlight
* 
*/

define([
	"three",
	"scene",
	"debugGUI",
	"sounds",
	"loadingManager",
	"classes/Item",
	"physics"
], function ( THREE, scene, debugGUI, sounds, loadingManager, Item, physics ) {

	'use strict';

	function onError( xhr ) {
		console.error( "error", xhr );
	}

	function onProgress( xhr ) {
		// console.log( "onProgress", xhr );
	}


	// flashlight model
	var flashlightMesh;
	var directoryPath = "assets/models/";
	var name = "flashlight";        

	var mtlLoader = new THREE.MTLLoader( loadingManager );
	var url = directoryPath + name + "/";
	mtlLoader.setPath( url );

	mtlLoader.load( name + ".mtl", function( materials ) {
		var directoryPath = "assets/models/";
		var name = "flashlight";
		var url = directoryPath + name + "/";

		materials.preload();

		var objLoader = new THREE.OBJLoader( loadingManager );
		objLoader.setMaterials( materials );
		objLoader.setPath( url );
		objLoader.load( name + ".obj", function ( object ) {

			// console.log( object );

			object = object.children[ 0 ];
			object.scale.set( 0.8, 0.8, 0.8 ); 
			flashlightMesh = object;
			// scene.add( object );

			/*
			var object = object.children[ 0 ];
			var material = object.material;
			// console.log( "barrel", object );

			// object.material.map.anisotropy = 8;
			object.castShadow = true;

			var url = directoryPath + name + "/" + name + "_N.jpg";
			var normalMap = textureLoader.load( url );
			material.normalMap = normalMap;
			// material.normalScale.set ( 1, 1 );

			scene.add( object );

			if ( physics !== undefined ) {
			var mesh = physics.getProxyMesh( object, "Cylinder" );
			mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 1.5, 0 );
			// mesh.rotation.z = Math.PI / 1.5;
			physics.meshToBody( mesh, 2 );
			scene.add( mesh );
			}

			// this.sceneObjects.add( mesh );
			// this.barrel_02 = mesh;
			spawnObject = mesh.clone();
			*/

		}, onProgress, onError );

	}, onProgress, onError );

	function createFlashlight( player ) {

		var mesh = flashlightMesh;

		var flashlight = new Item( mesh );
		flashlight.name = "flashlight"
		flashlight.mesh.position.set( -3.2, 1.05, -0.2 );
		flashlight.mesh.castShadow = true;
		scene.add( mesh );

		//spotlight
		var spotLight = new THREE.SpotLight( 0xf1ffb1, 0 ); //0xFFFFFF //0x44ffaa mystic green 500, 4 0xCCFF88
		// spotLight.angle = 40 * Math.PI / 180; // = 0.7
		spotLight.angle = 0.5; 
		spotLight.distance = 15;
		spotLight.penumbra = 0.5;
		spotLight.decay = 1.5;
		// spotLight.position.set( 0.1, -0.1, 0.1 );
		// spotLight.position.copy( flashlight.mesh.position );
		spotLight.castShadow = true;
		// spotLight.shadowBias = 50;
		// spotLight.shadowCameraFov = 60;
		spotLight.shadow.camera.near = 0.01;
		spotLight.shadow.camera.far = 30;
		// spotLight.shadowMapWidth = spotLight.shadowMapHeight = 1024;
		// spotLight.shadowDarkness = 0.5;

		// light helper
		var spotLightHelper = new THREE.SpotLightHelper( spotLight );
		scene.add( spotLightHelper );
		spotLightHelper.updateMatrixWorld();
		spotLightHelper.visible = false;

		// add spotlight to flashlight mesh
		mesh.add( spotLight );
		spotLight.position.set( 0, 0, 0.3 );
		spotLight.target.position.set( 0, 0, 10 );
		mesh.add( spotLight.target );
		mesh.updateMatrixWorld();
		spotLightHelper.update();

		/* ugh */
		flashlight.toggle = function() {

			if ( this.active ) {
				spotLight.intensity = 1;
				flashlight.mesh.visible = true;

			} else {
				spotLight.intensity = 0;
				flashlight.mesh.visible = false;
			}

			sounds.lightswitch.play();
			this.active = !this.active;

		};

		flashlight.mesh.userData.customAction = function() {

			// setup flashlight mesh 
			// for in player-hand mode
			spotLight.position.set( 0, 0, -0.2 );
			flashlight.active = true;
			flashlight.toggle();

			flashlight.mesh.visible = true;
			flashlight.mesh.castShadow = false;
			flashlight.mesh.rotation.y = Math.PI;
			flashlight.mesh.position.set( 0.1, -0.25, -0.1 );

			player.getPawn().add( flashlight.mesh );
			player.tools.flashlight = flashlight;

		};
		// flashlight.mesh.userData.customAction();
		

		// gui
		var gui = debugGUI.getFolder("Flashlight");
		
		buildGui( spotLight );

		function buildGui( light ) {

			gui.addThreeColor( light, "color" );
			gui.add( light, "intensity" ).min( 0 ).max( 5 );
			gui.add( light, "distance" ).min( 0 ).max( 20 );
			gui.add( light, "angle" ).min( 0 ).max( Math.PI / 2 ).onChange( update );
			gui.add( light, "penumbra" ).min( 0 ).max( 1 );
			gui.add( light, "decay" ).min( 0 ).max( 100 );
			gui.add( spotLightHelper, "visible" ).name("Helper visible");

			function update() {
				spotLightHelper.update();
			}

		}

		return flashlight;
	}

	return createFlashlight;

});