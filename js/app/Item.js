/**
* Item class
* 
*/

define([
	"three",
	"../libs/state-machine.min",
	"physics",
	"sounds",
	"InteractionBox"
], function ( THREE, StateMachine, physics, sounds, InteractionBox ) {

	'use strict';

	//pickableObject

	function Item( mesh ) {

		// mesh.userData = this;
		this.mesh = mesh;

		// function computeRaycastMesh( mesh ) {
		// }

		// temporär -.-
		this.pickedUp = false;

		this.name;
		this.hud = {};
		this.hud.action = "pickup the";

		// var proxymesh = this.physic( 5 );
		this.raycastMesh = this.computeRaycastMesh();

	}

	Item.prototype.computeRaycastMesh = function() {

		var bbox = new InteractionBox( this.mesh );
		bbox.rotation.copy( this.mesh.rotation );

		bbox.userData = this;

		return bbox;
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
		// !important: reset mesh position
		this.mesh.position.set( 0, 0, 0 );

		compundMesh.userData = this.mesh.userData;

		// mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 1.5, 0 );
		// mesh.rotation.z = Math.PI / 1.5;
		var rigidBody = physics.meshToBody( compundMesh, 10 * scale );
		this.mesh.goblin = rigidBody;

		// this.mesh = compundMesh;

		return compundMesh;

	};

	Item.prototype.highlight = function() {

		var material = this.mesh.material;
		if ( material instanceof THREE.MultiMaterial ) {
			for ( var i = 0; i < material.materials.length; i ++ ) {
				material.materials[ i ].emissive.setHex( 0xFF0000 );
			}
		} else if ( material instanceof THREE.Material ) {
			material.emissive.setHex( 0xFF0000 );
		} 
		else if ( this.mesh.children.length > 0 ) {
			for ( var i = 0; i < this.mesh.children.length; i ++ ) {
				// this.mesh.children[ i ].material.emissive.setHex( 0xFF0000 );
				// console.log( this.mesh.children );
				var child = this.mesh.children[ i ];

				if ( child.material instanceof THREE.MeshLambertMaterial ||
						child.material instanceof THREE.MeshPhongMaterial ) {
					child.material.emissive.setHex( 0xFF0000 );
				}
			}
		// 	console.warn("Unknown Material", this.mesh.material );
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
		} else if ( material instanceof THREE.Material ) {
			material.emissive.setHex( 0x000000 );
		} 
		else if ( this.mesh.children.length > 0 ) {
			for ( var i = 0; i < this.mesh.children.length; i ++ ) {
				// this.mesh.children[ i ].material.emissive.setHex( 0xFF0000 );
				// console.log( this.mesh.children );
				var child = this.mesh.children[ i ];

				if ( child.material instanceof THREE.MeshLambertMaterial ||
						child.material instanceof THREE.MeshPhongMaterial ) {
					child.material.emissive.setHex( 0x000000 );
				}
			}
		// 	console.warn("Unknown Material", this.mesh.material );
		}
		else {
			console.warn("Unknown Material", this.mesh.material );
		}
		// material.wireframe = false;

	};

	function isFunction(v){if(v instanceof Function){return true;}};

	Item.prototype.interact = function() {
		// pickup Item - hide it
		// console.log("pickup", this );

		// allow overlapping for multiple fast pickups
		sounds.wusch.isPlaying = false; 
		sounds.wusch.play();

		this.pickedUp = true;

		if ( isFunction( this.mesh.userData.customAction ) ){

			this.mesh.userData.customAction();
		}

		this.mesh.visible = false;
		// hide raycast mesh
		// visible = false affecting children in terms of rendering
		// but raycaster still intersects!
		this.raycastMesh.visible = false;

		if ( this.mesh.goblin !== undefined ) {
			// well hello there, physic item here

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