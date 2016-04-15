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
	"scene"
], function ( THREE, StateMachine, debugGUI, physics, scene ) {

	'use strict';

	//pickableObject

	function Item( mesh ) {

		mesh.userData = this;
		this.mesh = mesh;
		this.raycastMesh = computeRaycastMesh( mesh );

		function computeRaycastMesh( mesh ) {

			// door bounding box for raycasting
			var bbox = new THREE.BoundingBoxHelper( mesh );
			bbox.update();
			// bbox.position.set( - 0.02, 0.40, -0.54 );
			// var pos1 = safedoorGroup.position.clone();
			// pos1.add( safeGroup.getWorldPosition() );
			// bbox.position.copy( pos1 );
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
		this.hud.action = "pickup";

	}

	Item.prototype.physic = function( scale ) {

		/*
		var type = this.mesh.geometry.type;
		// console.log( type );

		var helper = new THREE.BoundingBoxHelper( this.mesh, 0xff0000 );
		helper.update();

		var bbox = new THREE.Box3().setFromObject( this.mesh );
		var size = bbox.size();
		// console.log( bbox.size(), bbox.center() );
		// var boundingBoxSize2 = bbox.max.sub( bbox.min );

		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		var geometry = new THREE.BoxGeometry( boundingBoxSize.x , boundingBoxSize.y, boundingBoxSize.z );
		var geometry = new THREE.BoxGeometry( size.x , size.y, size.z );
		var material = new THREE.MeshBasicMaterial( { visible:true, wireframe: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.y = 1;

		// this.mesh.geometry.translate( 0, - boundingBoxSize.y / 2, 0 );
		mesh.add( this.mesh );
		scene.add( mesh );

		if ( mesh.geometry.parameters !== undefined ) {
		
			var width = mesh.geometry.parameters.width;
			var height = mesh.geometry.parameters.height;
			var depth = mesh.geometry.parameters.depth;

		}

		var shape = new Goblin.BoxShape( width / 2, height / 2, depth / 2 );
		console.log("shape", shape );
		    
		var dynamic_body = new Goblin.RigidBody( shape, 5 );
		var position = mesh.getWorldPosition();
		dynamic_body.position.copy( position );

		var rotation = mesh.quaternion;
		dynamic_body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );

		physics.world.addRigidBody( dynamic_body );

		// // dynamic_body.friction = 0.8; // reibung
		// // dynamic_body.restitution = 0.0; //spring or bounciness
		// // dynamic_body.angularDamping = 0.5;

		// // if ( mass !== 0.0 ) {
		physics.addBody( dynamic_body, mesh );
		*/

		this.mesh.scale.set( scale, scale, scale );
		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( this.mesh, 0xff0000 );
		helper.update();

		// var bbox = new THREE.Box3().setFromObject( object );
		// var boundingBoxSize2 = bbox.max.sub( bbox.min );

		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		var geometry = new THREE.BoxGeometry( boundingBoxSize.x , boundingBoxSize.y, boundingBoxSize.z );

		var material = new THREE.MeshBasicMaterial( { visible: false, wireframe: true } );
		var itemMesh = new THREE.Mesh( geometry, material );

		// object.geometry.translate( 0, - boundingBoxSize.y / 2, 0 );
		itemMesh.add( this.mesh );
		itemMesh.userData = this.mesh.userData;
		itemMesh.position.set( 0, 5, 0 );
		// mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 1.5, 0 );
		// mesh.rotation.z = Math.PI / 1.5;
		scene.add( itemMesh );
		physics.meshToBody( itemMesh, 20 );
		

	}

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
		// this.mesh.material.visible = false;
		this.mesh.visible = false;
		// var material = this.mesh.material.materials[0];
	};

	Item.prototype.getRaycastMesh = function() {
		return this.raycastMesh;
	};


	return Item;

});