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
* Weapon Class
* + models
* + goblin raycast
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
	"classes/HUD",
	"initItems",
	"classes/Player",
	"listener",
	"particles"
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
	HUD,
	initItems,
	Player,
	listener,
	particles
) {

	'use strict';

	var objects = []; // raycast meshes

	var hud = new HUD( container );
	hud.interactionText = hud.box("Press <span class='highlight-actionkey'>[ e ]</span> to ");
	hud.infoText = hud.box("Press <span class='highlight-actionkey'>[ f ]</span> to ");
	hud.infoText.style.bottom = "50px";
	// var infoText = hud.box("Press <span class='highlight'>[ e ]</span> to ");

	var player = new Player( hud );

	var particleGroup;

	// Start program
	var initialize = function ( preloaded ) {

		// todo
		// abstract item initialization
		// and constraints to other game elemnts

		// adding item meshes to raycaster objects-array
		var items = initItems( preloaded.items, objects, player, hud.interactionText );

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
		loadingScreen.complete();
		animate();

	};

	var clock = new THREE.Clock();
	var delta;

	// MAIN LOOP
	var animate = function () {

		delta = clock.getDelta();

		particleGroup.tick( delta );
		physics.update( delta );
		player.raycast( objects );
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