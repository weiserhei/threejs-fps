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
    "container",
    "stats",
    "debugGUI",
    "tweenHelper",
    "skycube",
    "lights",
    "physics",
    "Room",
    "safe",
    "Crosshair",
    "HUD"
	], function ( 
             THREE, 
             TWEEN, 
             scene, 
             camera, 
             renderer, 
             controls,
             container,
             stats, 
             debugGUI, 
             tweenHelper, 
             skycube,
             lights,
             physics,
             Room,
             safe,
             Crosshair,
             HUD
             ) {
	
	// 'use strict';

	// Start program
    var initialize = function () {

		// controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

		// // set Reset Values
		// controls.target0 = controls.target.clone();
		// controls.position0 = camera.position.clone();
		// controls.zoom0 = camera.zoom;
	
		// GRID FOR ORIENTATION
		var gridXZ = new THREE.GridHelper( 1, 0.1 );
		gridXZ.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
		scene.add(gridXZ);
		gridXZ.position.y = 0;
		gridXZ.visible = true;

		// var roomGeometry = new THREE.BoxGeometry( 30, 10, 30 );
		// var roomMaterial = new THREE.MeshNormalMaterial( { side: THREE.BackSide, transparent: true, opacity: 0.5 } );
		// var room = new THREE.Mesh( roomGeometry, roomMaterial );
		// room.position.set( 0, roomGeometry.parameters.height / 3, 0 );
		// scene.add( room );

		var room1 = new Room( 10, 10, 3.2, false );
		scene.add( room1 );

		function objects() {

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
		physics.meshToBody( dynamic_mesh, 5 );

		static_mesh.position.set( 0, static_mesh.geometry.parameters.height / 2, 0 );
		// static_mesh.position.set( 0, static_mesh.geometry.boundingSphere.radius, 0 );
		// scene.add( static_mesh );
		// physics.meshToBody( static_mesh, 0 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( left );
		physics.meshToBody( left, 5 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( left );
		physics.meshToBody( left, 5 );

		var right = dynamic_mesh.clone();
		right.position.set( -2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( right );
		physics.meshToBody( right, 5 );

		var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.5, 16, 16 ), new THREE.MeshNormalMaterial() );
		sphere.position.set( -2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( sphere );
		physics.meshToBody( sphere, 5 );


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

		    }, onProgress, onError );

		});

		}
		// objects();

		var plane = physics.createPlane ( 1, 10, 10, 0, new THREE.MeshNormalMaterial() )
		scene.add( plane );

		// DEBUG GUI
        dg = debugGUI;
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
			reset: function() { 
				tweenHelper.resetCamera( 600 );
			},
			respawn: function() {
				
				var newBarrel = spawnObject.clone();

				newBarrel.position.set( 0, newBarrel.geometry.parameters.height / 2 + 3, 0 );
				physics.meshToBody( newBarrel, 2 );
				scene.add( newBarrel );

			},
			thirdPerson: false
		};
		dg.add( options, "respawn" ).name("Spawn new barrel");
		dg.add( options, "thirdPerson" ).name("Third Person Camera").onChange( thirdPerson );
		// dg.add( options, "reset" ).name("Reset Camera");
		dg.add( controls, "reset" ).name("Reset Player");

        var options = {
        	safe: function() {
        		require(["safe"]);
        	}
        }
        // dg.add( options, "safe" );

        var raycaster = new THREE.Raycaster();
        var intersections = [];
        var interactionDistance = 1.5;

        var active = [];
        var toggle = false;

        var hud = new HUD( container );
        var safetext = hud.box("Press E");

        function interact( object ) {

			if ( object.parent instanceof THREE.Group ) {

				var parent = object.parent;
				// console.log( "parent", parent );
				if ( parent.userData.active ) { return; }

				parent.userData.active = true;
				safetext.show( true );

				for ( var i = 0; i < parent.children.length; i ++ ) {
					var child = parent.children[ i ];
					// console.log( "child", child );

        			active.push( child );
        			highlight( child );

				}
			}

        }

        function highlight( mesh ) {

			if ( mesh.material instanceof THREE.MultiMaterial ) {

				// console.log( "material", child.material )
				
				for ( var j = 0; j < mesh.material.materials.length; j ++ ) {
					var material = mesh.material.materials[ j ];
					if ( mesh.userData.color === undefined ) {
						mesh.userData.color = [];
					}
					// mesh.userData.color.push( material.color.clone() );
					// material.wireframe = true;
					// material.color.setHex( 0xFF0000 );
					// material.emissive.setHex( 0x112211 );
					material.emissive.setHex( 0x011001 );
				}
				
			} else {
    			// target.material.wireframe = true;
			}
        }

        function removeHighlight( mesh ) {

			if ( mesh.material instanceof THREE.MultiMaterial ) {

				// console.log( "material", mesh.material )
				
				for ( var j = 0; j < mesh.material.materials.length; j ++ ) {

					if ( mesh.userData.color !== undefined ) {

    					var material = mesh.material.materials[ j ];
    					// var color = mesh.userData.color[ j ];
    					// console.log("color", color );
    					// material.color = color;
    					material.emissive.setHex( 0x000000 );
						// material.wireframe = true;
					}

				}
				
			} else {
    			// target.material.wireframe = true;
			}
        }

		function resetActive() {

			if ( active.length > 0 ) {

				if ( active[ 0 ].parent instanceof THREE.Group ) {

					var parent = active[ 0 ].parent;
					// console.log( "parent", parent );
					// if ( parent.userData.active ) { return; }

					parent.userData.active = false;
					safetext.show( false );

					for ( var i = 0; i < parent.children.length; i ++ ) {
						var child = parent.children[ i ];
						// console.log( "child", child );

						var index = active.indexOf(child);
						if (index > -1) {
							active.splice(index, 1);
						}
						removeHighlight( child );

					}
				}
			}

		}

        caster = {
        	fire: function() {

				// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
				// scene.add( arrowHelper );

	        	raycaster.setFromCamera( new THREE.Vector2(), camera );
	        	intersections = raycaster.intersectObjects( safe.door.children );

        		// console.log("fire", intersections);

	        	if ( intersections.length > 0 ) {
        			var target = intersections[ 0 ];
        			// console.log( intersections[ 0 ] );

        			if ( target.distance < interactionDistance ) {

        				interact( target.object );

        			} else {
        				resetActive();
        			}

	        	} else {
        			resetActive();
	        	}

        	}
        }

        document.addEventListener('keydown',onDocumentKeyDown,false);
		document.addEventListener('keyup',onDocumentKeyUp,false);

		function onDocumentKeyDown(event){
			event = event || window.event;
			var keycode = event.keyCode;

			switch( keycode ) {
				case 69 : //E
	        		// execute only once on keydown, until reset
					if( toggle ) { return; }
					toggle = !toggle;

	        		if ( active[ 0 ] !== undefined ) {
	        			active[ 0 ].parent.userData.fsm.interact();
	        		}
				break;
			}

		}

		function onDocumentKeyUp(event){
			event = event || window.event;
			var keycode = event.keyCode;

			switch( keycode ) {
				case 69 : //E
	        		// execute only once on keydown, until reset
					toggle = false;
				break;
			}

		}

        function handleMouseDown( event ) {
        	if ( event.button === 0 ) {

        	} else {

        	}
        }

        // document.body.addEventListener( "mousedown", handleMouseDown );

        // dg.add( caster, "fire" );

		// DEBUG GUI

	};

	var clock = new THREE.Clock();

	// MAIN LOOP
    var animate = function () {

    	caster.fire();

    	var delta = clock.getDelta();

    	physics.update( delta );
    	controls.update();

		TWEEN.update();
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
var dg;