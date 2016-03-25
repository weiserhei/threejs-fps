/**
 * Core application handling
 * Initialize Viewer
 */
define([
    "three",
    "TWEEN",
    "scene",
    "camera",
    "renderer",
    "controls",
    "stats",
    "debugGUI",
    "tweenHelper",
    "skycube",
    "lights",
    "PhysicFactory"
], function ( 
             THREE, 
             TWEEN, 
             scene, 
             camera, 
             renderer, 
             controls, 
             stats, 
             debugGUI, 
             tweenHelper, 
             skycube,
             lights,
             PhysicFactory
             ) {
	
	'use strict';

	var physicFactory = new PhysicFactory();

	// Start program
    var initialize = function () {

		// INITIAL CAMERA POSITION AND TARGET
		camera.position.set( 0, 2, -8 );
		controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

		// set Reset Values
		controls.target0 = controls.target.clone();
		controls.position0 = camera.position.clone();
		controls.zoom0 = camera.zoom;
	
		// GRID FOR ORIENTATION
		var gridXZ = new THREE.GridHelper( 1, 0.1 );
		gridXZ.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
		scene.add(gridXZ);
		gridXZ.position.y = 0;
		gridXZ.visible = true;

		// var static_box = new Goblin.RigidBody( box_shape, Infinity ); // Mass of Infinity means the box cannot move
		// static_box.position.set( 0, 0, 0 ); // Set the static box's position 5 units down
		// world.addRigidBody( static_box );

		var box_geometry = new THREE.BoxBufferGeometry( 1, 1, 1 ), // note that the `BoxGeometry` arguments are the box's full width, height, and depth, while the parameters for `Goblin.BoxShape` are expressed as half sizes
		// var box_geometry = new THREE.SphereBufferGeometry( 1, 32, 32 ), // note that the `BoxGeometry` arguments are the box's full width, height, and depth, while the parameters for `Goblin.BoxShape` are expressed as half sizes
		    box_material = new THREE.MeshLambertMaterial({ color: 0xaa8833 });

		// box_geometry.translate( 0, 1, 0 );

		var dynamic_mesh = new THREE.Mesh( box_geometry, box_material ),
		    static_mesh = new THREE.Mesh( box_geometry, box_material );

		dynamic_mesh.position.set( 0, 0.5, 0 );
		static_mesh.rotation.set( 0, 0, 45 * Math.PI / 180 );
		scene.add( dynamic_mesh );
		physicFactory.meshToBody( dynamic_mesh, 5 );

		static_mesh.position.set( 0, static_mesh.geometry.parameters.height / 2, 0 );
		// static_mesh.position.set( 0, static_mesh.geometry.boundingSphere.radius, 0 );
		// scene.add( static_mesh );
		// physicFactory.meshToBody( static_mesh, 0 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( left );
		physicFactory.meshToBody( left, 5 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( left );
		physicFactory.meshToBody( left, 5 );

		var right = dynamic_mesh.clone();
		right.position.set( -2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( right );
		physicFactory.meshToBody( right, 5 );

		var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.5, 16, 16 ), new THREE.MeshNormalMaterial() );
		sphere.position.set( -2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( sphere );
		physicFactory.meshToBody( sphere, 5 );


		function onError() {
			console.log("error");
		}

		function onProgress() {

		}

		var textureLoader = new THREE.TextureLoader();

		// barrel_02
		var directoryPath = "assets/models/";
		var name = "Barrel_02";
		var spawnObject;

		var mtlLoader = new THREE.MTLLoader();
		var url = directoryPath + name + "/";
		mtlLoader.setBaseUrl( url );
		mtlLoader.setPath( url );

		mtlLoader.load( name + ".mtl", function( materials ) {

		    materials.preload();

		    var objLoader = new THREE.OBJLoader();
		    objLoader.setMaterials( materials );
		    objLoader.setPath( url );
		    objLoader.load( name + ".obj", function ( object ) {
				
				// console.log( object );

				var object = object.children[ 0 ];
				var material = object.material;
				// object.scale.set( 0.5,0.5,0.5 ); 
				// console.log( "barrel", object );

				// object.material.map.anisotropy = 8;
				object.castShadow = true;

				var url = directoryPath + name + "/" + name + "_N.jpg";
				var normalMap = textureLoader.load( url );
				material.normalMap = normalMap;
				// material.normalScale.set ( 1, 1 );

				scene.add( object );
				
				if ( physicFactory !== undefined ) {
					var mesh = physicFactory.getProxyMesh( object, "Cylinder" );
					mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 3, 0 );
					// mesh.rotation.z = Math.PI / 1.5;
					physicFactory.meshToBody( mesh, 2 );
					scene.add( mesh );
				}

				// this.sceneObjects.add( mesh );
				// this.barrel_02 = mesh;
				spawnObject = mesh.clone();

		    }, onProgress, onError );

		});

		var plane = physicFactory.createPlane ( 1, 5, 5, 0, new THREE.MeshNormalMaterial() )
		scene.add( plane );

		// DEBUG GUI
        var dg = debugGUI;
        dg.open();
		dg.add( plane, "visible" ).name("Show Floor");

		/*
		var name = "Environment";
		if ( dg.__folders[ name ] ) {
			var folder = dg.__folders[ name ];
		} else {
			var folder = dg.addFolder( name );
		}
		*/

		var options = {
			reset: function() { 
				tweenHelper.resetCamera( 600 );
			},
			respawn: function() {
				
				var newBarrel = spawnObject.clone();

				newBarrel.position.set( 0, newBarrel.geometry.parameters.height / 2 + 3, 0 );
				physicFactory.meshToBody( newBarrel, 2 );
				scene.add( newBarrel );


			}
		};
		dg.add( options, "reset" ).name("Reset Camera");
		dg.add( options, "respawn" ).name("Spawn new barrel");

		// DEBUG GUI

	};

	var clock = new THREE.Clock();

	// MAIN LOOP
    var animate = function () {

    	var delta = clock.getDelta();

    	physicFactory.update( delta );

		TWEEN.update();
		controls.update();
		stats.update();

		skycube.update( camera, renderer );
		renderer.render( scene, camera );

		requestAnimationFrame( animate );

    };

    return {
        initialize: initialize,
        animate: animate
    }
});