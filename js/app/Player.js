/**
* Player
* can raycast to interact with objects
* has Inventar
*/

define([
	"three",
	"Item",
	"Itemslot",
	"debugGUI"
], function ( THREE, Item, Itemslot, debugGUI ) {

	'use strict';

	function isFunction(v){if(v instanceof Function){return true;}};

	var intersections = [];
	var interactionDistance = 1.6;
    var raycaster = new THREE.Raycaster();
	var vector = new THREE.Vector2();

	var folder = debugGUI.getFolder( "Inventar" );

	function Player( hud ) {

		this.target = undefined;
		this.interactionText = hud.box("Press <span class='highlight'>[ e ]</span> to ");

		this.inventar = [];

	}

	Player.prototype.interact = function() {

		var object = this.target;
		var hudElement = this.interactionText;

		// dont do nuffin if no object is in target
		if ( object === undefined ) {
			return;
		}

		// console.log( object );
		if ( object.userData.fsm !== undefined ) {
			var fsm = object.userData.fsm;

			if ( isFunction( fsm.interact ) ) {
				// performance wise? assign new function on each call
				// maybe link hud element in init function

				// fsm.onafterinteract = function( event, from, to, msg ) {
				fsm.onenterstate = function( event, from, to, msg ) {
					// console.log("leaving state", event, from, to, fsm.transitions() );
					var action = fsm.transitions()[ 0 ] + " the";
					hudElement.setText( action + " " + object.userData.name );

				}

				fsm.interact();
			}

		}
		else if ( isFunction( object.userData.interact ) ) {

			if( object.userData instanceof Item ) {

				object.userData.interact();
				folder.add( object.userData, "name" );
				this.inventar.push( object.userData );

			}
			else if ( object.userData instanceof Itemslot ) {
				object.userData.interact( this.inventar );
				// this.inventar
			}
		}

	};

	// Player.prototype.raycast = (function() {
	// 	console.log("once");
	// 	return function( objects ) {
	// 		console.log("loop");
	// 	};
	// })();

	Player.prototype.raycast = function( objects ) {

		// todo
		// raycast from player mesh
		// cleaner and works in third person too then

		// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// scene.add( arrowHelper );

		raycaster.setFromCamera( vector, camera );
		intersections = raycaster.intersectObjects( objects );
		// console.log("fire", intersections);

		if ( intersections.length > 0 ) {
			var target = intersections[ 0 ];
			// console.log( target );

			if ( target.distance < interactionDistance ) {

				this.setTarget( target.object );

			} else {
				this.resetActive();
			}

		} else {
			this.resetActive();
		}

	};

	Player.prototype.setTarget = function( object ) {
		// console.log( "setActive", object );

		 if ( object !== this.target ) {

		 	this.resetActive();
			// items
			// console.log("active", object );
			// console.log( "userdata", object.parent.userData );

			// var action = object.userData.hud.action;
			var action = object.userData.hud.action;

			// if ( ! ( object.parent.userData instanceof Item ) ) {
			// todo check for interaction class item
			// instead of ausschlussverfahren
			var isItem = object.userData instanceof Item;
			var isItemslot = object.userData instanceof Itemslot;

			if ( ! isItem && ! isItemslot ) {
				// action = object.parent.userData.fsm.transitions()[ 0 ] + " the";
				action = object.userData.fsm.transitions()[ 0 ] + " the";
			}

			this.interactionText.show( true, action + " " + object.userData.name );
			object.userData.highlight( this.inventar );
			this.target = object;

		}

	};

	Player.prototype.resetActive = function() {

		if ( this.target !== undefined ) {

			this.interactionText.show( false );

			if ( isFunction( this.target.userData.reset ) ) {
				this.target.userData.reset();
			}
			this.target = undefined;

		}

	};

	return Player;

});