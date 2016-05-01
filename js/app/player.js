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
	"classes/Player",
	"debugGUI",
	"controls",
	"scene",
	"classes/Weapon",
	"container",
	"initWeapons",
	"renderer",
	"camera"
], function ( THREE, Player, debugGUI, controls, scene, Weapon, container, initWeapons, renderer, camera ) {

	'use strict';

	function createPlayer( hud ) {

		hud.weaponText = hud.box();
		var player = new Player( hud );
		hud.weaponText.show( true, player.inHands );
		hud.weaponText.setHTML = "";
		hud.weaponText.style = "padding:4px; background:rgba( 0, 0, 0, 0.25 ); width: unset; text-align:right; right: 100px;";

		function update() {
			hud.weaponText.show( true, this.inHands );
		}

		var weapons = initWeapons( hud );
	    // register update hud on ammo change and reload
		for ( var key in weapons ) {

			// set HUD callback
			weapons[key].setCallback( player, update );

			// fill players inventar
			player.weapons.push( weapons[key] );

			// add weapon models to the scene
			player.getPawn().add( weapons[ key ].mesh );

			// hide all weapon models
			weapons[key].mesh.traverseVisible ( function ( object ) { object.visible = true; } );

		}
		player.inHands = weapons.shotgun;
		// this.inHands.mesh.traverseVisible ( function ( object ) { object.visible = true; } );
		renderer.render( scene, camera );
		for ( var key in weapons ) {
			weapons[key].mesh.traverseVisible ( function ( object ) { object.visible = false; } );
		}
		// this.inHands.mesh.traverseVisible ( function ( object ) { object.visible = false; } );
		player.switchWeapon( 1 );


		var toggle = false; // toggle key down
		var toggle2 = false; // toggle key down

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

		document.addEventListener('keydown', onDocumentKeyDown.bind( player ), false);
		document.addEventListener('keyup', onDocumentKeyUp, false);

		// if (document.mozFullScreen && document.webkitFullScreen) {
		// 	console.log("fullscreen");
		// }
		// container.addEventListener( "mousedown", handleMouseDown );
		document.body.addEventListener( "mousedown", handleMouseDown.bind( player ) );
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

		document.addEventListener("mousewheel", MouseWheelHandler.bind( player ), false);
		// Firefox
		document.addEventListener("DOMMouseScroll", MouseWheelHandler.bind( player ), false);
		function MouseWheelHandler(e) {

			// cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
			
			// env.player.selectWeapon( delta );
			this.selectWeapon( delta );

			return false;
		}

		/*
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


		Player.prototype.use = function() {

			var hudElement = this.hud.infoText;
			if ( hudElement.visible ) {
				hudElement.fadeOut();
			}

			if ( this.tools.flashlight.pickedUp ) {
				this.tools.flashlight.toggle();
			}

		};
		*/

		return player;

	}

	return createPlayer;

});