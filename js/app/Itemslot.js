/**
* Item class
* 
*/

define([
	"three",
	"TWEEN",
	"debugGUI",
	"physics",
	"listener"
], function ( THREE, TWEEN, debugGUI, physics, listener ) {

	'use strict';

	// SOUNDS
	var sound1 = new THREE.Audio( listener );
	sound1.load( 'assets/sounds/lightswitch.ogg' );
	// sound1.autoplay = true;
	// sound1.setLoop( true );
	sound1.setVolume( 0.5 );	
	var sound2 = new THREE.Audio( listener );
	sound2.load( 'assets/sounds/harfe.ogg' );
	sound2.setVolume( 0.5 );	

	var sound3 = new THREE.Audio( listener );
	sound3.load( 'assets/sounds/schlag.ogg' );
	sound3.setVolume( 0.5 );

	//pickableObject Hull

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

	}

	function modifiyMaterial( currentMaterial, newMaterial ) {

		if ( currentMaterial instanceof THREE.MultiMaterial ) {
			for ( var i = 0; i < currentMaterial.materials.length; i ++ ) {
				material.materials[ i ].emissive = newMaterial.emissive;
				material.materials[ i ].opacity = newMaterial.opacity;
				material.materials[ i ].transparent = newMaterial.true;
			}
		} else {
			currentMaterial.emissive = newMaterial.emissive;
			currentMaterial.opacity = newMaterial.opacity;
			currentMaterial.transparent = true;
		}

		return currentMaterial;
	}
	
	Itemslot.prototype.computeRaycastMesh = function() {

		// bounding box for raycasting
		// scale up for easy access
		this.mesh.scale.multiplyScalar( 1.5 );
		var bbox = new THREE.BoundingBoxHelper( this.mesh );
		bbox.update();
		this.mesh.scale.multiplyScalar( 2/3 );
		// bbox.scale.set( 1.5, 1.5, 1.5 );
		// this.mesh.position.set( 0, 0, 0 );
		// bbox.position.set( - 0.02, 0.40, -0.54 );
		// bbox.material.visible = false;
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );
		this.mesh.add ( bbox );

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


	function containsObject(obj, list) {
		var i;
		for (i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return true;
			}
		}

		return false;
	}

	Itemslot.prototype.highlight = function( inventar, hudElement ) {

		var checkInventar = containsObject( this.item, inventar );
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

	Itemslot.prototype.interact = function( inventar, dgitem ) {
		// insert Item - remove from inventar, apply item material to item slot
		// todo
		// replace hull with the real item

		// console.log("use", this );

		var checkInventar = containsObject( this.item, inventar );

		if ( ! checkInventar ) {
			// allow overlapping sound for multiple fast keypresses
			sound1.isPlaying = false; 
			sound1.play();		
			return;
		}

		// remove item from inventar
		var index = inventar.indexOf( this.item );
		if (index > -1) {
			inventar.splice(index, 1);
		}

		sound2.play();		
		sound3.play();
		// console.log("removing", dgitem );

		var folder = debugGUI.getFolder("Inventar");
		// folder.remove( dgitem );

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

	};

	Itemslot.prototype.getRaycastMesh = function() {
		return this.raycastMesh;
	};
	

	return Itemslot;

});