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
	"../libs/state-machine.min",
	"debugGUI",
	"physics",
	"scene",
	"listener"
], function ( THREE, StateMachine, debugGUI, physics, scene, listener ) {

	'use strict';

	// SOUNDS
	var sound1 = new THREE.Audio( listener );
	sound1.load( 'assets/sounds/wusch.ogg' );
	// sound1.autoplay = true;
	// sound1.setLoop( true );
	sound1.setVolume( 0.5 );

	//pickableObject

	function Item( mesh ) {

		mesh.userData = this;
		this.mesh = mesh;

		function computeRaycastMesh( mesh ) {

			// door bounding box for raycasting
			var bbox = new THREE.BoundingBoxHelper( mesh );
			bbox.update();
			// bbox.scale.set( 1.5, 1.5, 1.5 );
			// bbox.position.set( - 0.02, 0.40, -0.54 );
			// bbox.material.visible = false;
			// bbox.rotation.copy( safeGroup.rotation );
			// scene.add ( bbox );
			mesh.add ( bbox );
			bbox.userData = mesh.userData;

			return bbox;
			// return this.mesh;
		}

		this.name;
		this.hud = {};
		this.hud.action = "pickup the";
		// this.mesh.position.set( 0, 5, 0 );

		// var proxymesh = this.physic( 5 );
		this.raycastMesh = computeRaycastMesh( mesh );

	}

	Item.prototype.physic = function( scale ) {

		this.mesh.scale.set( scale, scale, scale );
		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( this.mesh, 0xff0000 );
		helper.update();

		var bbox = new THREE.Box3().setFromObject( this.mesh );
		var boundingBoxSize = bbox.max.sub( bbox.min );

		// var boundingBoxSize = helper.box.max.sub( helper.box.min );
		var geometry = new THREE.BoxGeometry( boundingBoxSize.x , boundingBoxSize.y, boundingBoxSize.z );

		var material = new THREE.MeshBasicMaterial( { visible: false, wireframe: true } );
		var compundMesh = new THREE.Mesh( geometry, material );

		// object.geometry.translate( 0, - boundingBoxSize.y / 2, 0 );
		compundMesh.position.copy( this.mesh.getWorldPosition() );
		compundMesh.add( this.mesh );

		console.log( "comp", compundMesh.position );
		console.log( "this.mesh", this.mesh.position );

		compundMesh.userData = this.mesh.userData;
		// compundMesh.position.set( 0, 5, 0 );
		this.mesh.position.set( 0, 0, 0 );
		// mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 1.5, 0 );
		// mesh.rotation.z = Math.PI / 1.5;
		scene.add( compundMesh );
		var rigidBody = physics.meshToBody( compundMesh, 20 );
		this.mesh.goblin = rigidBody;
		return compundMesh;

	};

	Item.prototype.highlight = function() {

		var material = this.mesh.material;
		if ( material instanceof THREE.MultiMaterial ) {
			for ( var i = 0; i < material.materials.length; i ++ ) {
				material.materials[ i ].emissive.setHex( 0xFF0000 );
			}
		} else {
			material.emissive.setHex( 0xFF0000 );
		}
		// material.wireframe = true;
	};

	Item.prototype.reset = function() {
		// console.log( "reset", this );
		var material = this.mesh.material;
		if ( material instanceof THREE.MultiMaterial ) {
			for ( var i = 0; i < material.materials.length; i ++ ) {
				material.materials[ i ].emissive.setHex( 0x000000 );
			}
		} else {
			material.emissive.setHex( 0x000000 );
		}
		// material.wireframe = false;

	};

	Item.prototype.interact = function() {
		// pickup Item - hide it
		console.log("pickup", this );

		// allow overlapping for multiple fast pickups
		sound1.isPlaying = false; 
		sound1.play();

		this.mesh.visible = false;

		if ( this.mesh.goblin !== undefined ) {
			// well hello there, physic item here

			// hide raycast mesh
			this.getRaycastMesh().visible = false;
			// remove physic body
			physics.getWorld().removeRigidBody( this.mesh.goblin );

			// hide compound mesh
			// this.mesh.parent.visible = false;
		}

	};

	Item.prototype.getRaycastMesh = function() {
		return this.raycastMesh;
	};


	return Item;

});