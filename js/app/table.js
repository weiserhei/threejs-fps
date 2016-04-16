/**
 * Setup the control method
 */

define([
	"three",
	"scene",
	"physics"
	], function ( THREE, scene, physics ) {

	'use strict';

	console.log("table");

	var manager = new THREE.LoadingManager();

	var group = new THREE.Group();
	// group.visible = false;
	scene.add( group );
	
	var baseURL = "assets/models/table/";
	var tableURL = baseURL + "Table.dae";

	var textureLoader = new THREE.TextureLoader( manager );
	// var diffuseMap = textureLoader.load( baseURL + "seamlesstexture19_1024.jpg" );
	var diffuseMap = textureLoader.load( baseURL + "seamlesstexture21_1024.jpg" );
	diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
	diffuseMap.repeat.set( 1, 2 );
	// x = repeat in z direction
	// y = repeat in x direction
	var diffuseWood = textureLoader.load( baseURL + "Wood Texture.jpg" );

	// var loader = new THREE.OBJLoader( manager );
	var loader = new THREE.ColladaLoader( manager );
	loader.load( tableURL, table );

	function table ( object ) {
		
		var object = object.scene;
		// object.scale.multiplyScalar( 0.42 );
		
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				var scale = child.matrix.scale( new THREE.Vector3( 0.415, 0.415, 0.415 ) );
				child.geometry.applyMatrix( scale );

				var translation = new THREE.Matrix4().makeTranslation( 0, 0, -17.98 );
				child.geometry.applyMatrix( translation );
				// var rotation = new THREE.Matrix4().makeRotationZ( Math.PI/2 );
				// var rotation = new THREE.Matrix4().makeRotationY( Math.PI/2 );
				// child.geometry.applyMatrix( rotation );
				// console.log( child );
			}
		} );


		var restMaterial = new THREE.MeshPhongMaterial({
				// color: 0x888888,
				color: 0xFFFFFF,
				shininess: 1,
				specular: 0x111111,
				// emissive: 0x111111,
				map: diffuseWood,
			});

		var material = new THREE.MeshPhongMaterial( {
			color: 0xFFFFFF,
			// emissive: 0xFFaa00,
			map: diffuseMap
		} );

		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {

				// child.material = material;
				child.castShadow = true;
				child.receiveShadow = true;

				if ( child.material.name === "Rest" ) {
					child.material = restMaterial;
				} else {
					child.material = material;
				}

			}
		});

		// scene.add( object );
		group.add( object );

	}

});