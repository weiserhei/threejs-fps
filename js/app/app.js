/**
 * Core application handling
 * Initialize App
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
    "physics",
    "Room",
    "initSafe",
    "HUD",
    "initItems"
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
         physics,
         Room,
         initSafe,
         HUD,
         initItems
         ) {
	
	// 'use strict';

	function isFunction(v){if(v instanceof Function){return true;}};

	var caster;
	var objects = [];

	// Start program
    var initialize = function ( preloaded ) {

    	var safe = initSafe( preloaded.safe );
    	objects.push( safe.raycastMesh );

    	var items = new initItems( preloaded.items );
    	var meshes = items.getRaycastMeshes();
    	objects = objects.concat( meshes );
    	console.log( objects );

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

		// require(["objects"]);
		require(["lights"]);

		// floor
		var plane = physics.createPlane ( 1, 10, 10, 0, new THREE.MeshNormalMaterial() )
		scene.add( plane );

		// DEBUG GUI
        var dg = debugGUI;
        dg.open();
		dg.add( plane, "visible" ).name("Show Floor");

		var options = {

			respawn: function() {
				
				var newBarrel = spawnObject.clone();

				newBarrel.position.set( 0, newBarrel.geometry.parameters.height / 2 + 3, 0 );
				physics.meshToBody( newBarrel, 2 );
				scene.add( newBarrel );

			},
			thirdPerson: false
		};
		// dg.add( options, "respawn" ).name("Spawn new barrel");

        // var options = {
        // 	safe: function() {
        // 		require(["safe"]);
        // 	}
        // }
        // dg.add( options, "safe" );

        var raycaster = new THREE.Raycaster();
        var intersections = [];
        var interactionDistance = 1.5;

        active = [];
        var toggle = false;

        var hud = new HUD( container );
        var safetext = hud.box("Press E");
        var itemText = hud.box("Press E to pickup");

        function setActive( object ) {
        	// console.log( "setActive", object );

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
					if ( isFunction( child.userData.highlight ) ) {
						child.userData.highlight();
					}

				}
			}
			else if ( ! object.userData.active ) {
				// items
				// console.log("active", object );
				console.log( object.userData.name );

				itemText.show( true, object.userData.name );
				object.userData.highlight();
				object.userData.active = true;
				active.push( object );

			}

        }

		function resetActive() {

			if ( active.length > 0 ) {

				for ( var j = 0; j < active.length; j ++ ) {

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
							if ( isFunction( child.userData.reset ) ) {
								child.userData.reset();
							}

						}
					}
					else {

						itemText.show( false );
						active[ 0 ].userData.reset();
						active[ 0 ].userData.active = false;

						/* meh */
						/* overlapping bounding boxes */
						for ( var i = 0; i < active.length; i ++ ) {

							if ( active[ i ].parent instanceof THREE.Group ) {

								var parent = active[ i ].parent;
								var child = active[ i ];
								parent.userData.active = false;
								if ( isFunction( child.userData.reset ) ) {
									child.userData.reset();
								}

							}
						}
						active = [];

					}
				}
			}

		}

		// todo
		// raycaster has to wait for bounding box meshes
		// chain it / use loading manager
        caster = {
        	fire: function( objects ) {

				// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
				// scene.add( arrowHelper );

	        	raycaster.setFromCamera( new THREE.Vector2(), camera );
	        	intersections = raycaster.intersectObjects( objects );

        		// console.log("fire", intersections);
        		
	        	if ( intersections.length > 0 ) {
        			var target = intersections[ 0 ];
        			// console.log( intersections[ 0 ] );

        			if ( target.distance < interactionDistance ) {

        				setActive( target.object );

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

					var object = active[ 0 ];
	        		if ( object !== undefined ) {
						// console.log( object );
	        			if ( object.parent.userData.fsm !== undefined ) {

		        			if ( isFunction( object.parent.userData.fsm.interact() ) ) {
		        				object.parent.userData.fsm.interact();
		        			} 

	        			}
	        			else if ( isFunction( object.userData.interact() ) ) {
	        				object.userData.interact();
	        			}
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
	var delta;

	// MAIN LOOP
    var animate = function () {

    	caster.fire( objects );

    	delta = clock.getDelta();

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