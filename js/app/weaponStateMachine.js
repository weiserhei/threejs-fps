/**
* Weapon StateMachine
* 
*/

define([
	"debugGUI",
	"sounds",
	"../libs/state-machine.min"
], function ( debugGUI, sounds, StateMachine ) {

	'use strict';

	function weaponStateMachine( weapon ) {

		// states: ready, fireing, reloading, emptyMag, outOfAmmo
		// events: fire, readyToFire, reload, empty, emptyFire

		var fsm = StateMachine.create({

			initial: 'ready',
			events: [
				// { name: 'reset', from: '*',  to: 'locked' },
				{ name: 'readyToFire', from: ['fireing','reloading'], to: 'ready' },
				{ name: 'fire', from: ['ready','outOfAmmo'], to: 'fireing' },
				{ name: 'fire', from: 'emptyMag', to: 'reloading' },
				{ name: 'reload', from: ['emptyMag','ready','outOfAmmo'], to: 'reloading' },
				{ name: 'empty', from: 'fireing', to: 'emptyMag' },
				{ name: 'emptyFire', from: 'emptyMag', to: 'outOfAmmo' },
				// { name: 'restock', from: '*', to: 'restocking' },
			],
			callbacks: {

				// onenterstate: function( event, from, to ) {
				// 	console.log( "current state: ", this.current);
				// 	console.log( event, from, to );
				// },

				// onbeforefire: function() {
					
				// },

				// onfire: function( event, from, to ) {

				// },

				onfireing: function() {

					if ( weapon.currentCapacity > 0 ) {

						weapon.fire();
						weapon.currentCapacity -= 1;
						weapon.onChanged();
						
					}

					// ready to fire another?
					if ( weapon.currentCapacity > 0 ) {
						// yes, lets go
						fsm.readyToFire();

					} else {
						
						fsm.empty();

					}

				},

				onemptyFire: function() {

					// sound click
					sounds.weaponclick.play();

				},

				onemptyMag: function() {

					if ( weapon.magazines <= 0 ) {

						fsm.emptyFire();

					// } else {

						// weapon.statusText.show( true, "press <span class='highlight-actionkey'>[ R ]</span> to reload " + weapon.name );
						
					} else if ( weapon.magazines > 0 && weapon.emptySound instanceof THREE.Audio ) {

						weapon.emptySound.play();

					}

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
		// folder.open();
		folder.add( fsm, "current" ).name("Current State").listen();
		folder.add( fsm, "fire" ).name("fire");
		folder.add( fsm, "reload" ).name("reload");

		return fsm;

	}
	
	return weaponStateMachine;

});