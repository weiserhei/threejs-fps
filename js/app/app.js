/**
* Core application handling
* Initialize App
*/

/*
* ToDo
*
* Decouple HUD and Interaction Elements
* Observer Pattern? Events like in this one threejs PR?
* call infotext.update on player interaction
* register callbacks from iE in app.js
* how to handle defered states that change the hud text?
*
* Physical Doors + constraints
* Not movable but 
* having a collision mesh
*
* Ein level machen das komplett dunkel ist
* strom anschalten um weg zu finden 
* (random fässer im keller verteilen um labyrinth zu machen)
*
* Insert book in shelf and slide it away
*
* Schublade öffnen mit tastendruck
* Leere Schubladen einstreuen
*
* Menue
* GameState
* 
*/

define([
	"three",
	"TWEEN",
	"loadingScreen",
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
	"initItems",
	"Player",
	"listener",
	"initSicherungskasten",
	"particles",
	"Item"
], function ( 
	THREE, 
	TWEEN,
	loadingScreen,
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
	initItems,
	Player,
	listener,
	initSicherungskasten,
	particles,
	Item
) {

	'use strict';

	var objects = []; // raycast meshes

	var hud = new HUD( container );
	hud.interactionText = hud.box("Press <span class='highlight-actionkey'>[ e ]</span> to ");
	
	// var infoText = hud.box("Press <span class='highlight'>[ e ]</span> to ");
	var player = new Player( hud );

	var particleGroup;

	// Start program
	var initialize = function ( preloaded ) {

		// todo
		// abstract item initialization
		// and constraints to other game elemnts

		// adding item meshes to raycaster objects-array
		var items = initItems( preloaded.items, objects, player );

		var safe = initSafe( items.safeconstraint, hud.interactionText );
		objects.push( safe.raycastMesh );

		var sicherungskasten = initSicherungskasten( items.sicherungsslot, hud.interactionText );
		objects.push( sicherungskasten.raycastMesh );

		particleGroup = particles();
		scene.add( particleGroup.mesh );
		// var pos = items.safeconstraint.mesh.position;
		// particleGroup.mesh.position.copy( pos );
		// console.log( particle );
		// particleGroup.maxParticleCount = 500;

		items.safeconstraint.effect = particleGroup;
		items.sicherungsslot.effect = particleGroup;

		// controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

		// // set Reset Values
		// controls.target0 = controls.target.clone();
		// controls.position0 = camera.position.clone();
		// controls.zoom0 = camera.zoom;

		// require(["objects"]);
		require(["lights"]);
		require(["environment"]);
		// require(["sounds"]);

		// ready, set, go
		// wtf wtf man wtf
		// camera.add( listener );
		// controls.getControls().getObject().children[ 0 ].add( listener );
		// console.log( listener );
		// listener.context.listener.state = "running";
		loadingScreen.complete();
		animate();



		var toggle = false; // toggle key down

		document.addEventListener('keydown', onDocumentKeyDown, false);
		document.addEventListener('keyup', onDocumentKeyUp, false);

		function onDocumentKeyDown(event){

			event = event || window.event;
			var keycode = event.keyCode;
			// console.log( keycode );
			// var character = String.fromCharCode( event.keyCode );

			switch( keycode ) {
				case 69: //E
					// execute only once on keydown, until reset
					if( toggle ) { return; }
					toggle = !toggle;

					player.interact();

					break;

				case 70: //F
				console.log( "toggle flashlight", player.tools.flashlight);
					if( player.tools.flashlight.pickedUp ) {
						player.tools.flashlight.toggle();
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

		// document.body.addEventListener( "mousedown", handleMouseDown );
		// function handleMouseDown( event ) {
		// 	if ( event.button === 0 ) {

		// 	} else {

		// 	}
		// }

	};

	var clock = new THREE.Clock();
	var delta;

	// MAIN LOOP
	var animate = function () {

		delta = clock.getDelta();

		particleGroup.tick( delta );
		player.raycast( objects );
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