/**
* Safe Object (interactive)
* consists of
* Model (mesh)
* Tweens
* State Machine
* Sounds
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"Item"
], function ( THREE, scene, debugGUI, physics, Item ) {

	'use strict';

	var raycastMeshes = [];
	
	function initItems( preloaded ) {
		console.log("preloaded", preloaded );

		// werenchkey
		var mesh = preloaded.wrenchkey.mesh;

		var wrenchkey = new Item( mesh );
		wrenchkey.name = "Wrenchkey"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		wrenchkey.mesh.position.set( 0, 1, 0.5 );

		scene.add( wrenchkey.mesh );

		raycastMeshes.push( wrenchkey.getRaycastMesh() );

		// key
		var mesh = preloaded.key.mesh;

		var key = new Item( mesh );
		key.name = "Zauberschlüssel"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		key.mesh.position.set( 0, 1, 0.1 );

		scene.add( key.mesh );

		raycastMeshes.push( key.getRaycastMesh() );
		
	}

	initItems.prototype.getRaycastMeshes = function() {
		return raycastMeshes;
	}

	return initItems;

	// SOUNDS
    // var sound1 = new THREE.PositionalAudio( listener );
    // sound1.load( 'assets/sounds/safe_door.ogg' );
    // sound1.setRefDistance( 8 );
    // sound1.setVolume( 0.1 );

	// collision
	// physics.makeStaticBox(new THREE.Vector3(1,0.3,1), safeGroup.position, undefined );


});