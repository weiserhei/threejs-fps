/**
* Itemslot class
* creates Hull for an Item
* 
*/

define([
	"three",
	"TWEEN",
	"debugGUI",
	"physics",
	"sounds",
	"InteractionBox",
], function ( THREE, TWEEN, debugGUI, physics, sounds, InteractionBox ) {

	'use strict';

	function Itemslot( item ) {

		// clear children for clone
		var temp = item.mesh.children;
		item.mesh.children = [];

		var mesh = item.mesh.clone();
		mesh.material = mesh.material.clone();
		mesh.rotation.set( 0, 0, 0 );
		mesh.position.set( 0, 0, 0 );

		// give children back
		item.mesh.children = temp;

		// materials
		mesh.material.opacity = 0.4;
		mesh.material.transparent = true;
		// mesh.material.color.setHex( 0xFFFFFF );
		this.stdMaterial = mesh.material;

		var hasItemHighlightMaterial = new THREE.MeshPhongMaterial();
		hasItemHighlightMaterial.emissive.setHex( 0x005500 );
		hasItemHighlightMaterial.opacity = 0.9;

		this.hasItemHighlightMaterial = modifiyMaterial( this.stdMaterial.clone(), hasItemHighlightMaterial );

		// var missingItemHighlightMaterial = new THREE.MeshPhongMaterial();
		// missingItemHighlightMaterial.emissive.setHex( 0x550000 );
		// missingItemHighlightMaterial.opacity = 0.4;

		// this.missingItemHighlightMaterial = modifiyMaterial( this.stdMaterial.clone(), missingItemHighlightMaterial );
		this.missingItemHighlightMaterial = this.stdMaterial.clone();

		// scale collision box
		// mesh.scale.set( 0.7, 0.7, 0.7 );
		this.name = item.name;
		this.active = true;

		// mesh.userData = this;
		this.mesh = mesh;
		this.item = item;

		this.hud = {};
		this.hud.action = "insert the";

		this.raycastMesh = this.computeRaycastMesh();

		this.effect;

	}

	function modifiyMaterial( currentMaterial, newMaterial ) {

		if ( currentMaterial instanceof THREE.MultiMaterial ) {
			// for ( var i = 0; i < currentMaterial.materials.length; i ++ ) {
			// 	material.materials[ i ].emissive = newMaterial.emissive;
			// 	material.materials[ i ].opacity = newMaterial.opacity;
			// 	material.materials[ i ].transparent = newMaterial.transparent;
			// }
		} else {
			currentMaterial.emissive = newMaterial.emissive;
			currentMaterial.opacity = newMaterial.opacity;
			currentMaterial.transparent = newMaterial.transparent;
		}

		return currentMaterial;
	}
	
	Itemslot.prototype.computeRaycastMesh = function() {

		var bbox = new InteractionBox( this.mesh );

		bbox.rotation.copy( this.mesh.rotation );
		bbox.userData = this;

		return bbox;
	};
	/*
	Itemslot.prototype.physic = function( scale ) {

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
		scene.add( compundMesh );
		var rigidBody = physics.meshToBody( compundMesh, 20 );
		this.mesh.goblin = rigidBody;
		return compundMesh;

	};
	*/

	Itemslot.prototype.highlight = function( inventar, hudElement ) {

		var checkInventar = inventar.containsObject( this.item, inventar );
		// console.log("highlight", checkInventar, inventar);

		if ( checkInventar ) {
			// active highlight
			this.mesh.material = this.hasItemHighlightMaterial;
		} else {
			// inactive highlight
			// hudElement.show( true, "hahaha rekt" );
			var innerHTML = "Press <span class='highlight-inactivekey'>[ e ]</span> to " + this.hud.action + " <span class='highlight-inactive'>" + this.name + "</a>";
			hudElement.setHTML( innerHTML );
			this.mesh.material = this.missingItemHighlightMaterial;
		}

	};

	Itemslot.prototype.reset = function() {
		// console.log( "reset", this );
		// dont change material
		// if slot is filled

		if ( this.active ) {
			this.mesh.material = this.stdMaterial;
		}

	};

	Itemslot.prototype.tweenVector = function( source, target, time, easing ) {

		function tweenVector( source, target, time, easing ) {
			return new TWEEN.Tween( source ).to( {
				x: target.x,
				y: target.y,
				z: target.z
				}, time )
				.easing( easing );
		}

		this.animation = tweenVector( source, target, time, easing );

	};

	Itemslot.prototype.interact1 = function( inventar ) {

		// console.log("fire", this.effect, this.mesh.position );
		this.effect.mesh.position.copy( this.mesh.position );
		// this.effect.emitter.position.spreadClamp
		// console.log( this.effect );
		// console.log( this.effect.attributes );
		// this.effect.attributes.emitters[ 0 ].position._radius = 0.5;

		// var boundingBoxSize = this.raycastMesh.box.max.sub( this.raycastMesh.box.min );

		// console.log( this.raycastMesh )
		// console.log( this.raycastMesh.geometry.boundingSphere.radius )

		var size = this.mesh.geometry.boundingSphere.radius;

		// console.log( this.mesh, size );

		for ( var i = 0; i < this.effect.emitters.length; i ++ ) {
			this.effect.emitters[ i ].position._radius = size / 5;
		}
		this.effect.triggerPoolEmitter( 1 );
		// this.effect.triggerPoolEmitter( 1, this.mesh.position );

		sounds.harfe.play();
		sounds.schlag.play();

		if ( this.animation !== undefined ) {
			// this.animation.start();
		}

		// hide raycast mesh
		// visible = false affecting children in terms of rendering
		// but raycaster still intersects!
		this.raycastMesh.visible = false;

		this.mesh.material = this.item.mesh.material;
		this.active = false;

		// if ( this.mesh.goblin !== undefined ) {
		// 	// well hello there, physic item here

		// 	// remove physic body
		// 	physics.getWorld().removeRigidBody( this.mesh.goblin );

		// 	// hide compound mesh
		// 	// this.mesh.parent.visible = false;
		// }

		setTimeout( function() { 
			this.mesh.material = this.item.mesh.material;
			this.raycastMesh.visible = true;
			this.mesh.rotation.set( 0, 0, 0 );
			this.active = true;
		}.bind( this ), 1000 );


	};

	Itemslot.prototype.interact = function( inventar ) {
		// insert Item - remove from inventar, apply item material to item slot
		// todo
		// replace hull with the real item

		var checkInventar = inventar.containsObject( this.item, inventar );

		if ( ! checkInventar ) {
			// allow overlapping sound for multiple fast keypresses
			sounds.lightswitch.isPlaying = false; 
			sounds.lightswitch.play();		
			return false;
		}

		var size = this.mesh.geometry.boundingSphere.radius;

		for ( var i = 0; i < this.effect.emitters.length; i ++ ) {
			this.effect.emitters[ i ].position._radius = size / 5;
		}
		this.effect.mesh.position.copy( this.mesh.position );
		this.effect.triggerPoolEmitter( 1 );
		// this.effect.triggerPoolEmitter( 1, this.mesh.getWorldPosition() );
		// 
		// remove item from inventar
		inventar.removeItem( this.item );

		sounds.harfe.play();		
		sounds.schlag.play();

		if ( this.animation !== undefined ) {
			this.animation.start();
		}

		// hide raycast mesh
		// visible = false affecting children in terms of rendering
		// but raycaster still intersects!
		this.raycastMesh.visible = false;

		this.mesh.material = this.item.mesh.material;
		this.active = false;

		// if ( this.mesh.goblin !== undefined ) {
		// 	// well hello there, physic item here

		// 	// remove physic body
		// 	physics.getWorld().removeRigidBody( this.mesh.goblin );

		// 	// hide compound mesh
		// 	// this.mesh.parent.visible = false;
		// }
		return true;

	};

	Itemslot.prototype.getRaycastMesh = function() {
		return this.raycastMesh;
	};
	

	return Itemslot;

});