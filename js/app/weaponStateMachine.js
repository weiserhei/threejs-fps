/**
* Weapon StateMachine
* 
*/

define([
	"debugGUI",
	"sounds",
	"../libs/state-machine.min",
	"TWEEN",
	"controls"
], function ( debugGUI, sounds, StateMachine, TWEEN, controls ) {

	'use strict';

	function weaponStateMachine( weapon ) {

		// states: loaded, checking, reloading, emptyMag, outOfAmmo
		// events: fire, readyToFire, reload, empty, emptyFire

		var fsm = StateMachine.create({

			initial: 'loaded',
			events: [
				// { name: 'reset', from: '*',  to: 'locked' },
				{ name: 'fire', from: 'loaded', to: 'checking' },
				{ name: 'readyToFire', from: ['checking','reloading'], to: 'loaded' },
				{ name: 'fire', from: 'emptyMag', to: 'reloading' },
				{ name: 'fire', from: 'outOfAmmo', to: 'emptyMag' },
				{ name: 'reload', from: ['emptyMag','loaded'], to: 'reloading' },
				{ name: 'empty', from: 'checking', to: 'emptyMag' },
				{ name: 'emptyFire', from: 'emptyMag', to: 'outOfAmmo' },
				// { name: 'restock', from: '*', to: 'restocking' },
			],
			callbacks: {

				onenterstate: function( event, from, to ) {
					// console.log( "current state: ", this.current);
					// console.log( event, from, to );
				},

				onbeforefire: function() {

					if ( weapon.currentCapacity > 0 ) {
						weapon.currentCapacity -= 1;
					}

					weapon.onChanged();
					
				},

				onfire: function( event, from, to ) {

					if ( to === "checking" ) {

						weapon.fire();

					}

				},

				onchecking: function() {

					if( weapon.currentCapacity === 0 ) {
						fsm.empty();
					} else {
						fsm.readyToFire();
					}


				},

				onemptyFire: function() {

					// sound click
					sounds.weaponclick.play();

				},

				onemptyMag: function() {

					if ( weapon.magazines <= 0 ) {

						fsm.emptyFire();

					}

					weapon.emptySound.play();

				},

				onbeforereload: function() {
					// stop reloading without magazines left
					// and if magazines full, stop too ofc -.-
					var fullMagazines = weapon.maxCapacity === weapon.currentCapacity;
					var noMagazinesLeft = weapon.magazines <= 0;

					if ( noMagazinesLeft || fullMagazines ) {
						return false;
					}

				},

				onreloading: function() {

					weapon.reload( fsm.readyToFire, fsm );

				},
				
			}

		});

		var folder = debugGUI.getFolder("Shoot me Up");
		folder.open();
		folder.add( fsm, "current" ).name("Current State").listen();
		folder.add( fsm, "fire" ).name("fire");
		folder.add( fsm, "reload" ).name("reload");

		return fsm;

	}
	
	return weaponStateMachine;

});