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
		this.name;
		this.active = false;

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

		// door bounding box for raycasting
		var bbox = new THREE.BoundingBoxHelper( this.mesh );
		bbox.update();
		// bbox.position.set( - 0.02, 0.40, -0.54 );
		// var pos1 = safedoorGroup.position.clone();
		// pos1.add( safeGroup.getWorldPosition() );
		// bbox.position.copy( pos1 );
		// bbox.material.visible = false;
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );
		// this.mesh.add ( bbox );

		// safedoorGroup.userData.bbox = bbox;

		return this.mesh;
	};

	return Item;

});