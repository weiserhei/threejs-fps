/**
* Safe Object (interactive)
* consists of
* Model (mesh)
* Tweens
* State Machine
* Sounds
*/

var box;

define([
	"three",
	"../libs/state-machine.min",
	"TWEEN",
	"scene",
	"debugGUI",
	"physics",
	"sounds"
], function ( THREE, StateMachine, TWEEN, scene, debugGUI, physics, sounds ) {

	'use strict';

	var sicherungssound = sounds.positional.sicherungskasten;

	function sicherungskasten( preloaded, constraint, constraint2, hudElement ) {
		// console.log("constraint", constraint );
		// analyser1 = new THREE.AudioAnalyser( sound1, 32 );
		
		var name = "Sicherungskasten";
		var folder = debugGUI.getFolder( name );

		var meshes = preloaded.meshes;
		// var sicherung = meshes.sicherung;
		var schalter = meshes.schalter;
		var schrank = meshes.schrank;
		var tuere = meshes.tuere;

		var sicherung = new THREE.Mesh( new THREE.CylinderGeometry( 0.02, 0.02, 0.09, 16 ), new THREE.MeshPhongMaterial( { color: 0xFFaa00 } ) );
		sicherung.position.set( -0.010, -0.013, -0.11 );
		
		// folder.add( sicherung.position, "x" ).min( -2 ).max( 2 ).step( 0.01 );
		// folder.add( sicherung.position, "y" ).min( -2 ).max( 2 ).step( 0.01 );
		// folder.add( sicherung.position, "z" ).min( -2 ).max( 2 ).step( 0.01 );

	    var sicherungsgruppe = new THREE.Group();
		// sicherungsgruppe.add( sicherung );
		sicherungsgruppe.add( schalter );
		sicherungsgruppe.add( schrank );
		sicherungsgruppe.add( tuere );

		sicherungsgruppe.position.set( -2.5, 1.5, 4.5 );
		sicherungsgruppe.rotation.set( 0, Math.PI, 0 );

		scene.add( sicherungsgruppe );

		// DEBUG GUI
		// scene.updateMatrixWorld();
		// console.log( sicherung.getWorldPosition() );

		sicherungsgruppe.add( sicherungssound.schlag ); // schalter
		sicherungsgruppe.add( sicherungssound.sicherung2 ); // summen
		// safeGroup.add( sound3 );
		// safegriff.add( sound4 ); // clicks

		// var sound1 = preloaded.sounds.sound1;
		// var sound2 = preloaded.sounds.sound2;
		// var sound3 = preloaded.sounds.sound3;

		// collision
		// physics.makeStaticBox(new THREE.Vector3( 1.1, 1.2, 1.1 ), safeGroup.position, undefined );

		// var box = new THREE.Box3();
		// box.setFromObject( safedoorGroup );

		function addHighlight( mesh, constraint ) {

			mesh.userData.highlight = function( inventar, hudElement ) {

				if ( constraint.active === true ) {
					var innerHTML = "You need to " + constraint2.hud.action + " <span class='highlight-inactive'>" + constraint.name + "</span>";
					innerHTML += " to " + fsm.transitions()[ 0 ] + " the " + this.name;
					hudElement.setHTML( innerHTML );
				}

				// for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

					// var mesh = safedoorGroup.children[ i ];
					var mesh = schalter;
					if ( mesh.userData.highlightMaterial !== undefined ) {
						mesh.material = mesh.userData.highlightMaterial;
					}

				// }

			}

			mesh.userData.reset = function() {

				// for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

					// var mesh = safedoorGroup.children[ i ];
					var mesh = schalter;
					if ( mesh.userData.stdMaterial !== undefined ) {
						mesh.material = mesh.userData.stdMaterial;
					}

				// }

			}

			mesh.userData.name = "schalter";

			// for ( var i = 0; i < safedoorGroup.children.length; i ++ ) {

				// var mesh = safedoorGroup.children[ i ];
				var mesh = schalter;

				mesh.userData.stdMaterial = mesh.material;
				mesh.userData.highlightMaterial = mesh.material.clone();

				// if ( mesh.userData.highlightMaterial instanceof THREE.MultiMaterial ) {

				// 	// console.log( "material", child.material )

				// 	for ( var i = 0; i < mesh.userData.highlightMaterial.materials.length; i ++ ) {
				// 		var material = mesh.userData.highlightMaterial.materials[ i ];
				// 		// if ( mesh.userData.color === undefined ) {
				// 		// mesh.userData.color = [];
				// 		// }
				// 		// mesh.userData.color.push( material.color.clone() );
				// 		// material.wireframe = true;
				// 		// material.color.setHex( 0xFF0000 );
				// 		// material.emissive.setHex( 0x112211 );
				// 		// material.emissive.setHex( 0x011001 );
				// 		// material.transparent = true;
				// 		// material.opacity = 0.8;
				// 		material.color.offsetHSL( 0, 0.04, 0.08 );
				// 	}

				// } else {
					// target.material.wireframe = true;
					mesh.userData.highlightMaterial.color.offsetHSL( 0, 0.04, 0.1 );
				// }

			// }

		}

		// door bounding box for raycasting

		// var box = new THREE.Box3();
		// box.setFromObject( schalter );
		// console.log( box );

		// var boundingBoxSize = bbox.boundingBox.max.sub( geometry.boundingBox.min );

		schalter.scale.multiplyScalar( 1.5 );
		var bbox = new THREE.BoundingBoxHelper( schalter );
		bbox.update();
		
		schalter.scale.multiplyScalar( 2/3 );
		// bbox.geometry.translate( 0, bbox.size.y, 0 );
		// bbox.position.set( - 0.02, 0.40, -0.54 );
		// var pos1 = safedoorGroup.position.clone();
		// pos1.add( safeGroup.getWorldPosition() );
		// bbox.position.copy( pos1 );
		bbox.material.visible = true;
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );
		addHighlight( bbox, constraint2 );
		// bbox.userData.fsm = fsm;
		// bbox.position.set( 0, 0, 0 );
		schalter.add ( bbox );
		bbox.position.z = 0;
		// bbox.position.copy( schalter.position );

		// if(color == "kerze"){ c = 0xFACC2E; }
		// else if(color == "mystic") { c = 0x00ffaa; }

		scene.updateMatrixWorld(); // !!
		var pos = constraint2.mesh.getWorldPosition();
		pos.z -= 0.1;
		pos.x += 0.1;
		// console.log( pos );
		var pl = new THREE.PointLight( 0xFFAA00, 0, 1 );
		// THREE.SpotLight = function ( color, intensity, distance, angle, penumbra, decay ) {
		// var pl = new THREE.SpotLight( 0xFFAA00, 1, 5, Math.PI / 2.5 );
		// pl.target.position.set( 0, 1.5, 4.5 );
		// pl.penumbra = 0.8;
		// scene.add( pl.target );
		pl.position.copy( pos );
		scene.add( pl );
		// https://github.com/mrdoob/three.js/issues/5555
		// pl.target.updateMatrixWorld();

		// var spotLightHelper = new THREE.SpotLightHelper( pl );
		// scene.add( spotLightHelper );

		// var helper = new THREE.PointLightHelper( pl, 0.5 );
		// helper.update();
		// scene.add(helper);


		var tweens = setupTweens();
		var fsm = setupFSM( tweens );

		// fsm.unlock();

		bbox.userData.fsm = fsm;

		// flackern( pl );

		// FLACKERN
		function flackern( light ) {

			var lightOn = new Boolean();

			var handle = setInterval(function(){
				if ( Math.random() > 0.95 ){ //a random chance
					if ( lightOn ){ //if the light is on...
						lightOn = !lightOn; //turn it off
						light.intensity = 0;
						//lights[14].intensity = 0;
					}
					else{
						lightOn = !lightOn; //turn it on
						light.intensity = 1.5;
						//lights[14].intensity = 2;
					}
				} else { 
					light.intensity = 1;
					//lights[14].intensity = 2;
				}
			},50);

			return handle;
			
		}


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
			var source = schalter.rotation;
			var target = new THREE.Vector3( 0, 0, Math.PI / 1.5 );
			var time = 1000;
			// var easing = TWEEN.Easing.Sinusoidal.InOut;
			// var easing = TWEEN.Easing.Quartic.In;
			var easing = TWEEN.Easing.Sinusoidal.In;
			var turn_switch = tweenVector( source, target, time, easing );			

			var target = new THREE.Vector3( 0, 0, 0 );
			var reset_switch = tweenVector( source, target, time, easing );

			return {
				schalter: turn_switch,
				reset_switch: reset_switch
			};

		}

		function setupFSM( tweens ) {

			// states: open, closed, locked, unlocked
			// events: opening, closing, interact, unlock

			var fsm = StateMachine.create({

				initial: 'up',
				events: [
					{ name: 'reset', from: '*',  to: 'up' },
					{ name: 'flip', from: 'up', to: 'down' },
					{ name: 'flip', from: 'down', to: 'up' },
					{ name: 'interact', from: 'up', to: 'down' },
					{ name: 'interact', from: 'down', to: 'up' },
				],
				callbacks: {
					// constrain safe door to itemslot
					onenterstate: function( event, from, to ) {

						if ( constraint2.active ) {
							return;
						}
						var action = this.transitions()[ 0 ] + " the";
						// var text = action + " <span class='highlight-item'>" + bbox.userData.name + "</span>";
						var text = action + bbox.userData.name;
						hudElement.setText( text );

					},
					oninteract: function( event, from, to ) {
						// console.log( event, from, to );
						sicherungssound.schlag.play();

					},
					onleaveup: function( event, from, to ) {
						if ( to === "down" ) {
							tweens.schalter.onComplete( fsm.transition );
							tweens.schalter.start();
						}
						return StateMachine.ASYNC;
					},
					onleavedown: function( event, from, to ) {
						if ( to === "up" ) {
							tweens.reset_switch.onComplete( fsm.transition );
							tweens.reset_switch.start();
						}
						return StateMachine.ASYNC;
					},
					onup: function() {
						pl.intensity = 0;
						if ( sicherungssound.sicherung2.isPlaying ) {
							sicherungssound.sicherung2.stop();
						}
						constraint2.mesh.material.emissive.setHex( 0x000000 );
					},
					ondown: function() {
						pl.intensity = 1;
						constraint2.mesh.material.emissive.setHex( 0x885533 );
						if ( constraint2.active ) {
							this.interact();
							return false;
						}
						sicherungssound.sicherung2.play();
					},
					// onclosed: function(event, from, to, msg) { 

					// 	tweens.open.stop();
					// 	tweens.close.start();
					// 	tweens.close.onComplete( 
					// 	                function() { 
					// 	                	sound2.play(); 
					// 	                	// stop soundfile before finished
					// 						setTimeout(function(){ sound2.stop(); }, 600);
					// 	                } );
					// 	sound3.play();

					// },
					// onunlocked: function() {
					//     // this.open();
					// },
					// onleavestate: function( event, from, to, msg ) {
					// onafterinteract: function( event, from, to, msg ) {
					// console.log("leaving state", event, from, to, fsm.transitions() );

					// },
					onbeforereset: function( event, from, to ) {

						// if ( to !== "locked" && this.can ( "close" ) ) {
						//     this.close();
						// }
						TWEEN.removeAll();
						schalter.rotation.set ( 0, 0, 0 );

					},
				}

			});

			// folder.open();

			folder.add( fsm, "current" ).name("Current State").listen();
			folder.add( fsm, "interact" ).name("interact");
			folder.add( fsm, "reset" ).name("Reset");

			// folder.add( fsm, "up" ).name("up");
			// folder.add( fsm, "down" ).name("down");

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
			// fsm: fsm,
			object: sicherungsgruppe,
			// door: safedoorGroup,
			raycastMesh: bbox
		};

		return exports;

	}
	// function safe

	return sicherungskasten;

});