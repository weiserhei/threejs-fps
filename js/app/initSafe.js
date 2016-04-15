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
	"listener"
], function ( THREE, StateMachine, TWEEN, scene, debugGUI, physics, listener ) {

	'use strict';

	// SOUNDS
    var sound1 = new THREE.PositionalAudio( listener );
    sound1.load( 'assets/sounds/safe_door.ogg' );
    sound1.setRefDistance( 8 );
    sound1.setVolume( 0.1 );

    var sound2 = new THREE.PositionalAudio( listener );
    sound2.load( 'assets/sounds/door.ogg' );
    sound2.setRefDistance( 8 );
    sound2.setVolume( 0.1 );

    var sound3 = new THREE.PositionalAudio( listener );
    sound3.load( 'assets/sounds/quietsch2.ogg' );
    sound3.setRefDistance( 8 );
    sound3.setVolume( 0.1 );

	function safe( preloaded ) {

		// analyser1 = new THREE.AudioAnalyser( sound1, 32 );

		// DEBUG GUI
		var dg = debugGUI;

		var name = "Safe";
		var folder = dg.getFolder( name );

		var meshes = preloaded.meshes;
		var safewheel = meshes.safewheel;
		var safegriff = meshes.safegriff;
		var safedoor = meshes.safedoor;
		var safebase = meshes.safebase;

	    var safedoorGroup = new THREE.Group();
		safedoorGroup.add( safewheel );
		safedoorGroup.add( safegriff );
		safedoorGroup.add( safedoor );

	    safedoorGroup.position.set( - 0.58, 0.53, 0.54 );

	    var safeGroup = new THREE.Group();
	    safeGroup.add( safebase );
	    safeGroup.add( safedoorGroup );

		scene.add( safeGroup );

		safeGroup.rotation.y = Math.PI / 2;
		safeGroup.position.set ( 0, 0, -1 );
		
		safeGroup.add( sound1 );
		safeGroup.add( sound2 );
		safeGroup.add( sound3 );

		// var sound1 = preloaded.sounds.sound1;
		// var sound2 = preloaded.sounds.sound2;
		// var sound3 = preloaded.sounds.sound3;

		// collision
		// physics.makeStaticBox(new THREE.Vector3(1,0.3,1), safeGroup.position, undefined );
		physics.makeStaticBox(new THREE.Vector3(1,1.2,1), safeGroup.position, undefined );

		var tweens = setupTweens();
		var fsm = setupFSM( tweens );
		safedoorGroup.userData.fsm = fsm;

		// var box = new THREE.Box3();
		// box.setFromObject( safedoorGroup );


		function addHighlight( mesh ) {

			mesh.userData.highlight = function() {

				for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

					var mesh = safedoorGroup.children[ i ];
					if ( mesh.userData.highlightMaterial !== undefined ) {
						mesh.material = mesh.userData.highlightMaterial;
					}

				}

			}

			mesh.userData.reset = function() {

				for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

					var mesh = safedoorGroup.children[ i ];
					if ( mesh.userData.stdMaterial !== undefined ) {
						mesh.material = mesh.userData.stdMaterial;
					}

				}

			}

			mesh.userData.hud = {};
			mesh.userData.hud.action = "use the";
			mesh.userData.name = "safe";

			for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

				var mesh = safedoorGroup.children[ i ];

				mesh.userData.stdMaterial = mesh.material;
				mesh.userData.highlightMaterial = mesh.material.clone();

				if ( mesh.userData.highlightMaterial instanceof THREE.MultiMaterial ) {

					// console.log( "material", child.material )

					for ( var i = 0; i < mesh.userData.highlightMaterial.materials.length; i ++ ) {
						var material = mesh.userData.highlightMaterial.materials[ i ];
						// if ( mesh.userData.color === undefined ) {
						// mesh.userData.color = [];
						// }
						// mesh.userData.color.push( material.color.clone() );
						// material.wireframe = true;
						// material.color.setHex( 0xFF0000 );
						// material.emissive.setHex( 0x112211 );
						// material.emissive.setHex( 0x011001 );
						// material.transparent = true;
						// material.opacity = 0.8;
						material.color.offsetHSL( 0, 0.04, 0.08 );
					}

				} else {
					// target.material.wireframe = true;
				}

			}

		}

		// door bounding box for raycasting
		var bbox = new THREE.BoundingBoxHelper( safedoorGroup );
		bbox.update();
		bbox.position.set( - 0.02, 0.40, -0.54 );
		// var pos1 = safedoorGroup.position.clone();
		// pos1.add( safeGroup.getWorldPosition() );
		// bbox.position.copy( pos1 );
		bbox.material.visible = false;
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );
		addHighlight( bbox );

		safedoorGroup.add ( bbox );


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

		function setupFSM( tweens ) {

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
					onclosed: function(event, from, to, msg) { 

						tweens.open.stop();
						tweens.close.start();
						tweens.close.onComplete( 
						                function() { 
						                	sound2.play(); 
						                	// stop soundfile before finished
											setTimeout(function(){ sound2.stop(); }, 600);
						                } );
						sound3.play();

					},
					onopened: function() {

						tweens.close.stop();
						tweens.open.start();
						sound3.play();

					},
					onbeforeinteract: function(event, from, to) { 

						// console.log( "onbeforeinteract", this.current ); 

						// if ( this.is( "locked" ) ) {
						//     // alert("pause");
						//     // some UI action, minigame, unlock this shit

						// }

					},
					// onunlocked: function() {
					//     // this.open();
					// },
					onleavelocked: function() {

						tweens.wheel.onComplete( function() { 
							fsm.transition(); 
							sound1.stop();						
						} );
						tweens.unlock.chain( tweens.wheel );
						tweens.unlock.onComplete( function() { 

							sound1.play(); 
							// broken
							// sound1.gain.gain.exponentialRampToValueAtTime( 0.01, sound1.context.currentTime + 2.5 );

						} );
						tweens.unlock.start();
						// sound1.play();

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
						sound1.setVolume( 0.1 )

					},
				}

			});

			folder.open();

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