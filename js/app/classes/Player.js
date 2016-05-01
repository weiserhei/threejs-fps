/**
* Player
* can raycast to interact with objects
* has Inventar
*
* Todo
* oh god that flashlight - ECS Systen
*
*/

define([
	"three",
	"classes/Item",
	"classes/Itemslot",
	"debugGUI",
	"controls",
	"scene",
	"classes/Inventar",
	"classes/Weapon",
	"physics",
	"camera"
], function ( THREE, Item, Itemslot, debugGUI, controls, scene, Inventar, Weapon, physics, camera ) {

	'use strict';


	function isAnyObject(value) {
		return value != null && (typeof value === 'object' || typeof value === 'function');
	}
	function isFunction(v){if(v instanceof Function){return true;}};

	var intersections = [];
	var interactionDistance = 1.8;
	var raycaster = new THREE.Raycaster();

	Player.prototype.getPawn = function() {
		return this._playerMesh;
	};

	function Player( hud ) {

		this.tools = {};
		this.tools.flashlight = {};

		var playerMesh = controls.getControls().getObject();
		this._playerMesh = playerMesh;

		this.target = undefined;
		this.hud = hud;

		this.inventar = new Inventar();

		this.inHands;

		this.weapons = [];
		// hud.weaponStatusText.style = "padding:4px; background:rgba( 0, 0, 0, 0.25 ); width: unset; text-align:right; right: 100px;";

	}

	// mousewheel selection
	Player.prototype.selectWeapon = function( delta ) {
		
		var currentIndex = this.weapons.indexOf( this.inHands );
		var size = 0;
		var select = currentIndex - delta;
		
		for ( var key in this.weapons ) {
			if (this.weapons.hasOwnProperty(key)) size++;
		}
		
		// select the first weapon after last weapon and vice versa
		if ( select > size-1 ) { select = 0; } 
		else if ( select < 0 ) { select = size-1; }

		this.switchWeapon ( select );

	};

	Player.prototype.switchWeapon = function( number ) {

		if ( ! this.inHands instanceof Weapon ) {
			return false;
		}

		//dont switch weapons while reloading
		// console.log( "current", this.inHands.fsm.current );
		// console.log( "can", this.inHands.fsm.transitions() );
		var fsm = this.inHands.fsm;
		var aimfsm = this.inHands.aimfsm;
		// if ( fsm.cannot( "fire" ) && fsm.cannot( "reload" ) ) {
		if ( fsm.is( "reloading" ) ) {
			return false;
		}

		// transition back from aiming
		if ( this.inHands.aiming === true ) {
			this.inHands.aim();
			// this.inHands.leaveIronSights( 300 );
		}
		
		var newWeapon = number || 0;
		// if ( this.inHands !== this.weapons[ newWeapon ] ) { this.onChanged(); }

		// Hide all, then show new selected
		// for ( var key in this.weapons ) {
		// 	if (this.weapons.hasOwnProperty(key)) {

		// 		this.weapons[ key ].mesh.traverseVisible ( function ( object ) { object.visible = false; } );
		// 	}
		// }

		// if ( this.inHands !== undefined ) {
			//todo: only make material invisible, not object
			this.inHands.mesh.traverseVisible ( function ( object ) { object.visible = false; } );
			// this.inHands.mesh.material.visible = false;

		// }

		// this.weapons.traverseVisible ( function ( object ) { object.visible = false; } );
		// this.weapons.visible = true;

		this.inHands = this.weapons[ newWeapon ];

		this.inHands.activate();
		
	};

	Player.prototype.LMB = function() {

		if ( this.inHands instanceof Weapon ) {
			this.inHands.shoot();
		}

	};

	Player.prototype.RMB = function() {

		if ( this.inHands instanceof Weapon ) {
			this.inHands.aim();
		}

	};

	Player.prototype.use = function() {

		var hudElement = this.hud.infoText;
		if ( hudElement.visible ) {
			hudElement.fadeOut();
		}

		if ( this.tools.flashlight.pickedUp ) {
			this.tools.flashlight.toggle();
		}

	};

	Player.prototype.interact = function() {

		var object = this.target;
		// dont do nuffin if no object is in target
		if ( object === undefined ) {
			return false;
		}

		// var hudElement = this.hud.interactionText;
		var hudElement = this.hud.infoText;
		// console.log( object );
		var interact = object.userData.interact;

		if ( object.userData.fsm !== undefined ) {
			var fsm = object.userData.fsm;

			if ( isFunction( fsm.interact ) ) {
				fsm.interact();
			}

		} else if ( object.userData instanceof Item ) {

			if ( isFunction( object.userData.interact ) ) {
				object.userData.interact( hudElement );
				this.inventar.addItem( object.userData );
			}

		} else if ( object.userData instanceof Itemslot ||
		        
		        isFunction( object.userData.interact ) ) {

				object.userData.interact( this.inventar );

		} else {

			console.warn("Object has no interaction", object );

		}

	};

	// Player.prototype.raycast = (function() {
	// 	console.log("once");
	// 	return function( objects ) {
	// 		console.log("loop");
	// 	};
	// })();

	Player.prototype.update = function( objects ) {
		this.raycast( objects );
		// move weapon
		this.inHands.update();
	};

	Player.prototype.raycast = function( objects ) {

		// pitchObject (parent of camera in First person mode)
		// origin.copy( controls.getControls().getObject().getWorldPosition() );
		// direction.set( 0, 0, - 1 ).normalize(); // direction vector must have unit length
		// direction.copy( camera.getWorldDirection() );
		raycaster.set( controls.getControls().getObject().getWorldPosition(), camera.getWorldDirection() );
		intersections = raycaster.intersectObjects( objects, false );
		// raycaster.setFromCamera( vector, camera );
		// intersections = raycaster.intersectObjects( objects );

		// scene.remove( arrowHelper );
		// // var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// var arrowHelper = new THREE.ArrowHelper( direction, origin, 5, 0xFF0000 );
		// scene.add( arrowHelper );

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