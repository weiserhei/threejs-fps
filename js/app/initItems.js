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

		raycastMeshes.push( wrenchkey.getRaycastMesh() );
		// mesh.scale.set( 0.1, 0.1, 0.1 );
		wrenchkey.mesh.position.set( 0, 1, 0.5 );

		scene.add( wrenchkey.mesh );


		// key
		var mesh = preloaded.key.mesh;

		var key = new Item( mesh );
		raycastMeshes.push( key.getRaycastMesh() );

		key.name = "Zauberschlüssel"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		key.mesh.position.set( 0.8, 1, 0.8 );
		key.mesh.rotation.set( 0, Math.PI / 2, Math.PI / 2 );

		scene.add( key.mesh );

		// buch
		var mesh = preloaded.buch.mesh;

		var buch = new Item( mesh.clone() );
		raycastMeshes.push( buch.getRaycastMesh() );

		buch.name = "Buch"


		var spawn = {
			scale: 5,
			book: function() {

				var mesh = preloaded.buch.mesh;

				var buch = new Item( mesh.clone() );
				raycastMeshes.push( buch.getRaycastMesh() );

				buch.name = "Buch"

				buch.physic( this.scale );

			}
		}

		buch.physic( spawn.scale );
		debugGUI.add( spawn, "scale" ).min( 0.5 ).max( 10 ).step( 0.5 );;
		debugGUI.add( spawn, "book" ).name("spawn book");

		// buch
		// var mesh = preloaded.buch.mesh;

		// var buch = new Item( mesh );
		// raycastMeshes.push( buch.getRaycastMesh() );

		// buch.name = "Buch"

		// buch.physic( 2 );
		// buch.mesh.position.set( -0.8, 1, 0.8 );
		// buch.mesh.rotation.set( 0, Math.PI / 2, Math.PI / 2 );

		// scene.add( buch.mesh );

		// buch
		var mesh = preloaded.darkkey.mesh;

		var darkkey = new Item( mesh );
		raycastMeshes.push( darkkey.getRaycastMesh() );

		darkkey.name = "darkkey"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		darkkey.mesh.position.set( -0.8, 1, -0.8 );
		darkkey.mesh.rotation.set( 0, Math.PI / 2, Math.PI / 2 );

		scene.add( darkkey.mesh );

		
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