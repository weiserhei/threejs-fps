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

	var intersections = [];
	var interactionDistance = 1.8;
    var raycaster = new THREE.Raycaster();
	var vector = new THREE.Vector2();

	var folder = debugGUI.getFolder( "Inventar" );

	function Player( hud ) {

		this.target = undefined;
		this.hud = hud;
		this.inventar = [];

	}
	// meh remove pls
	var dgitem;
	Player.prototype.interact = function() {

		var object = this.target;
		var hudElement = this.hud.interactionText;

		// dont do nuffin if no object is in target
		if ( object === undefined ) {
			return;
		}

		// console.log( object );
		if ( object.userData.fsm !== undefined ) {
			var fsm = object.userData.fsm;

			if ( isFunction( fsm.interact ) ) {
				fsm.interact();
			}

		}
		else if ( isFunction( object.userData.interact ) ) {

			if( object.userData instanceof Item ) {

				object.userData.interact();
				// todo remove item from inventar on use!
				dgitem = folder.add( object.userData, "name" );
				this.inventar.push( object.userData );

			}
			else if ( object.userData instanceof Itemslot ) {
				// todo remove item from inventar on use!
				object.userData.interact( this.inventar );
			}
			else {
				console.warn("unknown interaction item");
				if ( isFunction( object.userData.interact ) ) {
					object.userData.interact( this.inventar );
				}
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

	function isAnyObject(value) {
		return value != null && (typeof value === 'object' || typeof value === 'function');
	}
	function isFunction(v){if(v instanceof Function){return true;}};

	Player.prototype.setTarget = function( object ) {
		// console.log( "setActive", object );

		 if ( object !== this.target ) {

		 	this.resetActive();
			// console.log("active", object );
			// console.log( "userdata", object.userData.fsm );

			// todo check for interaction class item
			// instead of ausschlussverfahren
			var isItem = object.userData instanceof Item;
			var isItemslot = object.userData instanceof Itemslot;

			if ( ! isItem && ! isItemslot ) {

				var hasFSM = isFunction( object.userData.fsm.transitions );

				if ( hasFSM ) {

					var action = object.userData.fsm.transitions()[ 0 ] + " the ";
					var text = action + object.userData.name;

				}
			} else if ( isAnyObject( object.userData.hud ) ) {
				var action = object.userData.hud.action;
				var text = action + " <span class='highlight-item'>" + object.userData.name + "</span>";
			}
			this.hud.interactionText.show( true, text );
			object.userData.highlight( this.inventar, this.hud.interactionText );
			this.target = object;

		}

	};

	Player.prototype.resetActive = function() {

		if ( this.target !== undefined ) {

			this.hud.interactionText.show( false );

			if ( isFunction( this.target.userData.reset ) ) {
				this.target.userData.reset();
			}
			this.target = undefined;

		}

	};

	return Player;

});