/**
* Safe Object (interactive)
* consists of
* Model (mesh)
* Tweens
* State Machine
* Sounds
*/

define([
	"three",
	"../libs/state-machine.min",
	"TWEEN",
	"scene",
	"debugGUI",
	"physics",
	"sounds",
	"InteractionElement",
	"InteractionBox"
], function ( THREE, StateMachine, TWEEN, scene, debugGUI, physics, sounds, InteractionElement, InteractionBox ) {

	'use strict';

	var safesound = sounds.positional.safe;

	function safe( preloaded, constraint, hudElement ) {
		// console.log("constraint", constraint );
		
		var name = "Safe";
		var folder = debugGUI.getFolder( name );

		var meshes = preloaded.meshes;
		var safewheel = meshes.safewheel;
		var safegriff = meshes.safegriff;
		var safedoor = meshes.safedoor;
		var safebase = meshes.safebase;
		// var safemiddledoor = meshes.safemiddledoor;
		safebase.castShadow = true;

	    var safedoorGroup = new THREE.Group();
		safedoorGroup.add( safewheel );
		safedoorGroup.add( safegriff );
		safedoorGroup.add( safedoor );
		// safebase.add( safemiddledoor );

		// DEBUG GUI		
		// var folder = debugGUI.getFolder( "Item" );
		// folder.add( safemiddledoor.position, "x" ).min( -3 ).max( 3 ).step( 0.05 );
		// folder.add( safemiddledoor.position, "y" ).min( -3 ).max( 3 ).step( 0.05 );
		// folder.add( safemiddledoor.position, "z" ).min( -3 ).max( 3 ).step( 0.05 );		

		// folder.add( safemiddledoor.rotation, "x" ).min( -Math.PI ).max( Math.PI ).step( 0.05 );
		// folder.add( safemiddledoor.rotation, "y" ).min( -Math.PI ).max( Math.PI ).step( 0.05 );
		// folder.add( safemiddledoor.rotation, "z" ).min( -Math.PI ).max( Math.PI ).step( 0.05 );

	    safedoorGroup.position.set( - 0.55, 0.615, 0.54 );

		// safemiddledoor.position.set( -0.25, -0.435, 0.3 );

	    var safeGroup = new THREE.Group();
	    safeGroup.add( safebase );
	    safeGroup.add( safedoorGroup );

		scene.add( safeGroup );

		safeGroup.rotation.y = Math.PI / 2;
		safeGroup.position.set ( 0, 0, -1 );
		
		safewheel.add( safesound.safe_door ); // wheel sound
		safeGroup.add( safesound.door );
		safeGroup.add( safesound.quietsch2 );
		safegriff.add( safesound.click_slow ); // clicks

		// collision
		// physics.makeStaticBox(new THREE.Vector3(1,0.3,1), safeGroup.position, undefined );
		physics.makeStaticBox(new THREE.Vector3( 1.1, 1.2, 1.1 ), safeGroup.position, undefined );

		// var box = new THREE.Box3();
		// box.setFromObject( safedoorGroup );

		// door bounding box for raycasting
		var bbox = new InteractionBox( safedoorGroup, 1 );
		bbox.position.set( - 0.02, 0.40, -0.54 );
		// bbox.rotation.copy( safeGroup.rotation );

		var tweens = setupTweens();
		var fsm = setupFSM( tweens, bbox );
		// fsm.unlock();

		var iE = new InteractionElement( "safe door" );
		iE.addHighlightMaterial( safedoorGroup );
		iE.addHighlightFunction( bbox, fsm, constraint );

		bbox.userData.fsm = fsm;


		function setupTweens() {

			function tweenVector( source, target, time, easing ) {
				return new TWEEN.Tween( source ).to( {
					x: target.x,
					y: target.y,
					z: target.z
					}, time )
					.easing( easing );
			}

			// open wheel
			var source = safewheel.rotation;
			var target = new THREE.Vector3( Math.PI * 2, 0, 0 );
			var time = 2000;
			var easing = TWEEN.Easing.Sinusoidal.InOut;
			var turn_wheel = tweenVector( source, target, time, easing );

			// close wheel
			var target = new THREE.Vector3( - Math.PI * 2, 0, 0 );
			var close_wheel = tweenVector( source, target, time, easing );

			// open door
			var source = safedoorGroup.rotation;
			var target = new THREE.Vector3( 0, Math.PI / 2, 0 );
			var time = 2000;
			var easing = TWEEN.Easing.Back.Out;
			var open_door = tweenVector( source, target, time, easing );

			// close door
			var target = new THREE.Vector3( 0, 0, 0 );
			var time = 1000;
			var easing = TWEEN.Easing.Quadratic.In;
			var close_door = tweenVector( source, target, time, easing );

			// open grip
			var source = safegriff.rotation;
			var target = new THREE.Vector3( Math.PI * 1.5, 0, 0 );
			var time = 2000;
			var easing = TWEEN.Easing.Quadratic.InOut;
			var spin_griff = tweenVector( source, target, time, easing );

			// rotation (using slerp)  
			// var euler = new THREE.Euler( Math.PI * 2, 0, 0, 'XYZ');
			// var qend = new THREE.Quaternion().setFromEuler(euler); //dst quaternion
			// console.log( qend );
			// var source = safegriff;
			// var qstart = new THREE.Quaternion().copy(source.quaternion); // src quaternion
			// var qtemp = new THREE.Quaternion();

			// var o = {t: 0};
			// var spin_griff = new TWEEN.Tween(o).to({t: 1}, time )
			// 	  .easing ( easing )
			//       .onUpdate(function () {
			//         THREE.Quaternion.slerp(qstart, qend, qtemp, o.t);
			//         safegriff.quaternion.copy( qtemp );
			//       });	

			// var o = {t: 0};
			// var spin_griff = new TWEEN.Tween(o).to({t: 1}, time )
			// 	  .easing ( easing )
			//       .onUpdate(function () {
			//         safegriff.quaternion.slerp( qend, o.t );
			//       });		


			// close_door.chain( close_wheel );      
			// wheel.chain( door );
			// griff.chain( wheel );

			return {
				unlock: spin_griff,
				wheel: turn_wheel,
				open: open_door,
				close: close_door
			};

		}


		function setupFSM( tweens, bbox ) {

			// todo: user interaction to unlock / keypad overlay

			// states: open, closed, locked, unlocked
			// events: opening, closing, interact, unlock

			var fsm = StateMachine.create({

				initial: 'locked',
				events: [
					{ name: 'reset', from: '*',  to: 'locked' },
					{ name: 'open', from: ['closed','unlocked'], to: 'opened' },
					{ name: 'close', from: 'opened', to: 'closed'   },
					{ name: 'unlock', from: 'locked', to: 'unlocked' },
					{ name: 'interact', from: ['closed','unlocked'], to: 'opened' },
					{ name: 'interact', from: 'opened', to: 'closed' },
					{ name: 'interact', from: 'locked', to: 'opened' },
				],
				callbacks: {
					// constrain safe door to itemslot
					// fsm.onafterinteract = function( event, from, to, msg ) {
					onenterstate: function( event, from, to ) {

						// todo: centralize this callback
						// if constraints active
						// return
						// else
						// todo set text only when no other text is active!!

						var action = this.transitions()[ 0 ];
						var text = action + " the " + bbox.userData.name;
						hudElement.setText( text );

					},
					onbeforeinteract: function(event, from, to) { 

						if ( this.is( "locked" ) ) {
						    // some UI action, minigame, unlock this shit
						   	// return if itemslot isnt filled
						    if ( constraint.active === true ) {
						    	sounds.beep.play();
						    	// cancel transition
						    	return false;
						    }

						    // safe.raycastMesh.userData.innerHTML = "";

						}

					},
					onclosed: function(event, from, to, msg) { 

						tweens.open.stop();
						tweens.close.start();
						tweens.close.onComplete( 
						                function() { 
						                	safesound.door.play(); 
						                	// stop soundfile before finished
											setTimeout(function(){ safesound.door.stop(); }, 600);
						                } );
						safesound.quietsch2.play();

					},
					onopened: function() {

						tweens.close.stop();
						tweens.open.start();
						safesound.quietsch2.play();

					},
					// onunlocked: function() {
					//     // this.open();
					// },
					// onleavestate: function( event, from, to, msg ) {
					// onafterinteract: function( event, from, to, msg ) {
					// 	console.log("leaving state", event, from, to, fsm.transitions() );

					// },
					onleavelocked: function() {

						tweens.wheel.onComplete( function() { 
							fsm.transition(); 
							safesound.safe_door.stop();						
						} );
						tweens.unlock.chain( tweens.wheel );
						tweens.unlock.onComplete( function() { 

							safesound.safe_door.play(); 
							// broken
							// sound1.gain.gain.exponentialRampToValueAtTime( 0.01, sound1.context.currentTime + 2.5 );

						} );
						tweens.unlock.onStart( 
							function() { 
								// sound is too short for the animation :s
								// setTimeout( function() { sound4.play(); }, 300 );
								safesound.click_slow.play() 
							} 
						);
						tweens.unlock.start();

						return StateMachine.ASYNC;

					},
					onbeforereset: function( event, from, to ) {

						// if ( to !== "locked" && this.can ( "close" ) ) {
						//     this.close();
						// }
						TWEEN.removeAll();
						safedoorGroup.rotation.set ( 0, 0, 0 );
						safewheel.rotation.set( 0, 0, 0 );
						safegriff.rotation.set( 0, 0, 0 );
						safegriff.quaternion.set( 0, 0, 0, 1 );

					},
				}

			});

			// folder.open();

			folder.add( fsm, "current" ).name("Current State").listen();
			folder.add( fsm, "interact" ).name("interact");
			folder.add( fsm, "reset" ).name("Reset");

			folder.add( fsm, "unlock" ).name("unlock");
			folder.add( fsm, "open" ).name("open");
			folder.add( fsm, "close" ).name("close");

			return fsm;

		}


		/*
		fsmKeypad = StateMachine.create({

		initial: 'locked',
		events: [
		{ name: 'pressing', from: 'idle', to: 'pressed' },
		{ name: 'idle', from: 'pressed', to: 'idle' },
		{ name: 'grant', from: 'locked', to: 'unlocked'   },
		{ name: 'deny', from: 'locked', to: 'locked' },
		],
		callbacks: {
		onpressing: function(event, from, to, msg) {  },
		onidle: function(event, from, to, msg) {  },
		ongrant: function(event, from, to, msg) { console.log("granted", this.current ); },
		ondeny: function(event, from, to, msg) { console.log("deny", this.current ); },
		}
		});
		*/


		var exports = {
			fsm: fsm,
			object: safeGroup,
			door: safedoorGroup,
			raycastMesh: bbox
		};

		return exports;

	}
	// function safe

	return safe;

});