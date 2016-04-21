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
	"sounds",
	"InteractionElement",
	"InteractionBox",
	"loadSicherungskasten"
], function ( THREE, StateMachine, TWEEN, scene, debugGUI, physics, sounds, InteractionElement, InteractionBox, loadSicherungskasten ) {

	'use strict';

	function sicherungskasten( constraint, hudElement ) {
		// console.log("constraint", constraint );
		// analyser1 = new THREE.AudioAnalyser( sound1, 32 );
		
		var name = "Sicherungskasten";
		var folder = debugGUI.getFolder( name );

		var sicherungssound = sounds.positional.sicherungskasten;

		var meshes = loadSicherungskasten.meshes;
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

		// collision
		// physics.makeStaticBox(new THREE.Vector3( 1.1, 1.2, 1.1 ), safeGroup.position, undefined );

		// var box = new THREE.Box3();
		// box.setFromObject( safedoorGroup );

		// var box = new THREE.Box3();
		// box.setFromObject( schalter );
		// console.log( box );

		// var boundingBoxSize = bbox.boundingBox.max.sub( geometry.boundingBox.min );

		// bbox.geometry.translate( 0, bbox.size.y, 0 );
		// bbox.position.set( - 0.02, 0.40, -0.54 );
		// var pos1 = safedoorGroup.position.clone();
		// pos1.add( safeGroup.getWorldPosition() );
		// bbox.position.copy( pos1 );
		// bbox.material.visible = true;
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );

		// if(color == "kerze"){ c = 0xFACC2E; }
		// else if(color == "mystic") { c = 0x00ffaa; }

		// scene.updateMatrixWorld(); // !!
		schalter.updateMatrixWorld();
		var pos = constraint.mesh.getWorldPosition();
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


		// raycast box
		var bbox = new InteractionBox( schalter );
		bbox.position.z = 0;
		var tweens = setupTweens();
		var fsm = setupFSM( tweens );
		bbox.userData.fsm = fsm;

		var iE = new InteractionElement( "schalter" );
		// schalter.add ( bbox );
		iE.addHighlightMaterial( schalter );
		iE.addHighlightFunction( bbox, fsm, constraint );

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

						if ( constraint.active ) {
							return;
						}
						var action = this.transitions()[ 0 ];
						// var text = action + " <span class='highlight-item'>" + bbox.userData.name + "</span>";
						var text = action + " the " + bbox.userData.name;
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
						constraint.mesh.material.emissive.setHex( 0x000000 );
					},
					ondown: function() {
						pl.intensity = 1;
						constraint.mesh.material.emissive.setHex( 0x885533 );
						if ( constraint.active ) {
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