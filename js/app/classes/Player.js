/**
* Player
* can raycast to interact with objects
* has Inventar
*
* Todo
* oh god that flashlight - ECS Systen
*
*/
var spotLightHelper;
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
	"sounds",
	"container",
	"initWeapons",
	"renderer",
	"camera"
], function ( THREE, Item, Itemslot, debugGUI, controls, scene, Inventar, Weapon, physics, sounds, container, initWeapons, renderer, camera ) {

	'use strict';


	function isAnyObject(value) {
		return value != null && (typeof value === 'object' || typeof value === 'function');
	}
	function isFunction(v){if(v instanceof Function){return true;}};

	var intersections = [];
	var interactionDistance = 1.8;
	var raycaster = new THREE.Raycaster();
	// var vector = new THREE.Vector2(); // used for raycaster.setFromCamera
	var origin = new THREE.Vector3();
	var direction = new THREE.Vector3();

	Player.prototype.getPawn = function() {
		return this._playerMesh;
	};

	function Player( hud, clock ) {

		this.tools = {};
		this.tools.flashlight = {};

		this.clock = clock;

		var playerMesh = controls.getControls().getObject();
		this._playerMesh = playerMesh;

		this.target = undefined;
		this.hud = hud;

		this.inventar = new Inventar();

		this.inHands;

		// hud.weaponStatusText.style = "padding:4px; background:rgba( 0, 0, 0, 0.25 ); width: unset; text-align:right; right: 100px;";

		var weapons = initWeapons( hud );
		this.weapons = [];

		this.inHands = weapons.shotgun;

		hud.weaponText = hud.box();
		hud.weaponText.show( true, this.inHands );
		hud.weaponText.setHTML = "";
		hud.weaponText.style = "padding:4px; background:rgba( 0, 0, 0, 0.25 ); width: unset; text-align:right; right: 100px;";

		function update() {
			hud.weaponText.show( true, this.inHands );
		}

	    // register update hud on ammo change and reload
		for ( var key in weapons ) {

			// set HUD callback
			weapons[key].setCallback( this, update );

			// fill players inventar
			this.weapons.push( weapons[key] );

			// add weapon models to the scene
			playerMesh.add( weapons[ key ].mesh );

			// hide all weapon models
			weapons[key].mesh.traverseVisible ( function ( object ) { object.visible = true; } );

		}

		// this.inHands.mesh.traverseVisible ( function ( object ) { object.visible = true; } );
		renderer.render( scene, camera );
		for ( var key in weapons ) {
			weapons[key].mesh.traverseVisible ( function ( object ) { object.visible = false; } );
		}
		// this.inHands.mesh.traverseVisible ( function ( object ) { object.visible = false; } );
		this.switchWeapon( 1 );

		var toggle = false; // toggle key down
		var toggle2 = false; // toggle key down

		document.addEventListener('keydown', onDocumentKeyDown.bind( this ), false);
		document.addEventListener('keyup', onDocumentKeyUp, false);


		function onDocumentKeyDown( event ){

			event = event || window.event;
			var keycode = event.keyCode;
			// console.log( keycode );
			// var character = String.fromCharCode( event.keyCode );

			switch( keycode ) {
				case 69: //E
					// execute only once on keydown, until reset
					if( toggle ) { return; }
					toggle = !toggle;

					this.interact();

					break;

				case 70: //F
					
					this.use();

					break;

				case 82: //R

					if( toggle2 ) { return; }
					toggle2 = !toggle2;

					if ( this.inHands instanceof Weapon ) {
						this.inHands.fsm.reload();
					}

					break;

			}

		}

		function onDocumentKeyUp(event){

			event = event || window.event;
			var keycode = event.keyCode;

			switch( keycode ) {
				case 69 : //E
					// execute only once on keydown, until reset
					toggle = false;
					break;
				
				case 82 : //R
					// execute only once on keydown, until reset
					toggle2 = false;
					break;
			}

		}

		// if (document.mozFullScreen && document.webkitFullScreen) {
		// 	console.log("fullscreen");
		// }
		// container.addEventListener( "mousedown", handleMouseDown );
		document.body.addEventListener( "mousedown", handleMouseDown.bind( this ) );
		function handleMouseDown( event ) {

			// cheap way of blocking shooting while entering fullscreen
			if ( !controls.getControls().enabled ) {
				return;
			}

			if ( event.button === 0 ) {

				this.LMB();

			} else {

				this.RMB();
			}
		}

		document.addEventListener("mousewheel", MouseWheelHandler.bind( this ), false);
		// Firefox
		document.addEventListener("DOMMouseScroll", MouseWheelHandler.bind( this ), false);
		function MouseWheelHandler(e) {

			// cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
			
			// env.player.selectWeapon( delta );
			this.selectWeapon( delta );

			return false;
		}



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

		// this.currentWeapon.mesh.position.z = initposz;
		// weapons.children[currentWeapon].position.z = initposz;
		
		// if( typeof this.flashlight !== "undefined" ) {
		// 	this.flashlight.intensity = 0;
		// }
		// if( this.currentWeapon.modelname === "flashlight" ) {
		// 	this.flashlight.intensity = 2.5;
		// }
		
		/*
		if ( this.currentWeapon.modelname === "shotgun" ) {
			initposz = -0.5;
			
			if (typeof initParticles === 'function') {

				var pyramidPercentX = 58;
				var pyramidPercentY = 35;
				var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
				var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
				tempVec = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );

			}
			
		} 
		else if ( this.currentWeapon.modelname === "sniper" ) {
			initposz = -0.5;
			
			// soundShotgunPump.play();
			env.sounds.ShotgunPump.play();
			
			if (typeof initParticles === 'function') { 

				var pyramidPercentX = 55;
				var pyramidPercentY = 38;
				var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
				var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
				tempVec = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.6 );
				
			}
			
		} 	
		// else if ( currentWeapon === 2 ) {
			// initposz = -0.4;
		// } 
		else if ( newWeapon === 2 ) {
			initposz = -0.3;
		}
		*/

		
		// if ( typeof this.currentWeapon.emitterPool !== 'undefined' ) { 

			// this.currentWeapon.emitterPool.particleGroup.mesh.position.copy( this.currentWeapon.mesh.emitterVector );
			// muzzleFlash.particleGroup.mesh.position.copy( this.currentWeapon.mesh.emitterVector );

			// emitterHelper.position.copy ( this.currentWeapon.mesh.emitterVector );
		// }

		// update hud to display the new weapon
		// env.hud.update();

		// var element = msDiv;
		// element.classList.remove("animate");

		// // https://css-tricks.com/restart-css-animation/
		// // -> triggering reflow /* The actual magic */
		// // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
		// element.offsetWidth = element.offsetWidth;
		// // -> and re-adding the class
		// element.classList.add("animate");
		
	};

	Player.prototype.LMB = function() {

		if ( this.inHands instanceof Weapon ) {
			this.inHands.shoot( this.clock );
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