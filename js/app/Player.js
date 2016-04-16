/**
* Player
* can raycast to interact with objects
* has Inventar
*/

define([
	"three",
	"Item",
	"debugGUI"
], function ( THREE, Item, debugGUI ) {

	'use strict';

	function isFunction(v){if(v instanceof Function){return true;}};

	var intersections = [];
	var interactionDistance = 1.6;
    var raycaster = new THREE.Raycaster();
	var folder = debugGUI.getFolder( "Inventar" );

	function Player( hud ) {

		this.target;
		this.interactionText = hud.box("Press <span class='highlight'>[ e ]</span> to ");

		this.inventar = [];

	}

	Player.prototype.interact = function() {

		var object = this.target;

		if ( object !== undefined ) {

			// console.log( object );
			if ( object.parent.userData.fsm !== undefined ) {

				if ( isFunction( object.parent.userData.fsm.interact() ) ) {
					object.parent.userData.fsm.interact();
				} 

			}
			else if ( isFunction( object.userData.interact ) ) {

				if( object.userData instanceof Item ) {

					object.userData.interact();
					folder.add( object.userData, "name" );
					this.inventar.push( object.userData );

				}
			}
		}

	};

	Player.prototype.raycast = function( objects ) {
		// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// scene.add( arrowHelper );

		raycaster.setFromCamera( new THREE.Vector2(), camera );
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
			this.interactionText.show( true, object.userData.hud.action + " " + object.userData.name );
			object.userData.highlight();
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