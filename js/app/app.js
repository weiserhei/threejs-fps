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
	"skycube",
	"physics",
	"classes/HUD",
	"initItems",
	"classes/Player",
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
	skycube,
	physics,
	HUD,
	initItems,
	Player,
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

	function shoot( target ) {

		// console.log( target );
		var normal = target.normal;
		var body = target.object;
		var point = target.point;

		// body.applyForceAtWorldPoint ( normal, point )
		// body.applyForceAtLocalPoint( normal, point );
		body.applyImpulse( normal )

	}

	// hud.x = hud.box( "end: " );
	// hud.x2 = hud.box( "start: " );
	// hud.x2.style.bottom = "50px";
	// hud.x2.show( true );
	// hud.x.show( true );

	// MAIN LOOP
	var animate = function () {

		// var pP = controls.getControls().getObject().getWorldPosition();
		var pP = camera.getWorldPosition();
		var start = new Goblin.Vector3( pP.x, pP.y, pP.z );

		// var direction = new THREE.Vector3( 0, 0, 1 );
		// direction = direction.applyMatrix4( camera.matrixWorld );

		// hud.x2.setText( direction.x + "/"+ direction.y + "/"+ direction.z );

		var startPos = pP;
		var direction = camera.getWorldDirection();
		var distance = 20;

		var newPos = new THREE.Vector3();
		newPos.addVectors ( startPos, direction.multiplyScalar( distance ) );

		// scene.remove( arrowHelper );
		// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// var arrowHelper = new THREE.ArrowHelper( direction, pP, 5, 0xFF0000 );
		// scene.add( arrowHelper );

		// var btRayToPoint = camera.getWorldPosition().clone().add( camera.getWorldDirection().clone().multiplyScalar( distance ) );
		var btRayToPoint = newPos;

		// var btRayToPoint = new THREE.Vector3( 0, 0, -distance ).applyMatrix4( controls.getControls().getObject().matrixWorld )
		// hud.x.setText( btRayToPoint.x + " " + btRayToPoint.y + " "+ btRayToPoint.z );
		// hud.x2.setText( start.x + " " + start.y + " "+ start.z );

		var end = new Goblin.Vector3( btRayToPoint.x, btRayToPoint.y, btRayToPoint.z );

		// var end = new Goblin.Vector3( 0, 0, 0 );
		// console.log( start, end );
		var intersections = physics.getWorld().rayIntersect( start, end );
		// todo
		// dont intersect with player cylinder -.-
		if ( intersections.length > 1 ) {

			var target = intersections[ 0 ];
			shoot( target );
		}

		delta = clock.getDelta();

		// todo
		// performance opt: only tick when triggered
		// using setIntervall instead of in main loop
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