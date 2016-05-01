/**
* Weapon Class
* 
*/

/*
	TODO: decals, hit effects
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"sounds",
	"controls",
	"camera",
	"muzzleparticle",
	"weaponStateMachine",
	"puffParticles"
], function ( THREE, scene, debugGUI, physics, sounds, controls, camera, muzzleparticle, weaponStateMachine, puffParticles ) {

	'use strict';

	function setIntervalX(callback, delay, repetitions) {
	    var x = 0;
	    var intervalID = window.setInterval(function () {

	       callback(x);

	       if (++x === repetitions) {
	           window.clearInterval(intervalID);
	       }
	    }, delay);
	}

	// var emitterHelper = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshNormalMaterial({ wireframe: true }));
	// scene.add( emitterHelper );
	// folder.add( emitterHelper.material, "visible" );

	var folder = debugGUI.getFolder("Shoot me Up");
	// folder.open();

	function Weapon( mesh, statusText ) {

		this.statusText = statusText;

		// gun attributes
		this.name = "";
		this.maxCapacity = 30;
		this.currentCapacity = this.maxCapacity;
		this.magazines = 3;
		this.shootDelay = 1;

		// sounds
		this.shootSound;
		this.reloadSound;
		this.emptySound;

		// weapon state
		this.fsm = weaponStateMachine( this );
		
		// model
		this.mesh = mesh;
		// mesh.updateMatrix();
		// var position = new THREE.Vector3().setFromMatrixPosition( mesh.matrix );
		this.originPos = mesh.position.clone();
		this.originRot = mesh.rotation.clone();
		this.ironSightPosition = new THREE.Vector3( 0, 0, 0 );
		this.ironSightRotation = new THREE.Vector3( 0, 0, 0 );

		// iron sights
		this.aiming = false;
		this.transition = false;

		// physical
		this.power = 50;

		// particles
		this.muzzleparticle = muzzleparticle;

		folder.add( this, "power" ).min( 1 ).max( 100 ).listen();

	}

	Weapon.prototype.toString = function() {

		return this.name + ": " + this.currentCapacity + "/" + this.maxCapacity * this.magazines + " Ammo";

	};

	Weapon.prototype.activate = function() {
		
		// reposition muzzle particle
		// and add to weapon mesh
		// so its position is updated automatically on move


		if ( typeof this.muzzleparticle !== 'undefined' ) { 

			if ( this.mesh.userData.emitterVector !== undefined ) {

				this.mesh.add( this.muzzleparticle.mesh );
				// performance
				// this.muzzleparticle.mesh.matrixAutoUpdate = false;
				this.muzzleparticle.mesh.position.copy( this.mesh.userData.emitterVector );

				// this.mesh.add( emitterHelper );
				// emitterHelper.position.copy( this.mesh.userData.emitterVector );
			}
			// emitterHelper.position.copy( this.mesh.emitterVector );

		}
		//todo: only make material invisible, not object
		this.mesh.traverse( function ( object ) { object.visible = true; } );

		this.onChanged();

	};

	var lastShotFired = 0;
	Weapon.prototype.shoot = function() {

		// if fsm.reloading dont count delay?

		var seconds = new Date() / 1000;

		if ( seconds < lastShotFired + this.shootDelay ) {
			return false;
		}

		// var delay = clock.getElapsedTime() - this.lastShotFired;
		// exit when fireing to fast
		// if ( delay < this.shootDelay ) { return false; }
		// this.lastShotFired = clock.getElapsedTime();
		lastShotFired = seconds;
		
		// performance: set matrixAutoUpdate = false;
		//this.muzzleparticle.mesh.updateMatrix();
		this.fsm.fire();

	};

	var impactPosition = new THREE.Vector3();
	Weapon.prototype.fire = function() {

		// play sound
		this.shootSound.isPlaying = false;
		// sounds.shootSound.stop();
		this.shootSound.play();
		
		// fire emitter
		this.muzzleparticle.triggerPoolEmitter( 1 );

		// var startPoint = camera.getWorldPosition();
		var startPoint = controls.getControls().getObject().getWorldPosition();
		var direction = camera.getWorldDirection();

		// scene.remove( arrowHelper );
		// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// var arrowHelper = new THREE.ArrowHelper( direction, pP, 5, 0xFF0000 );
		// scene.add( arrowHelper );

		var intersections = physics.raycast( startPoint, direction );

		if ( intersections.length > 0 ) {

			var target = intersections[ 0 ];

			// console.log( target );
			// on Hit something trigger hit effect emitter
			puffParticles.setNormal( target.normal );
			// puffParticles.triggerPoolEmitter( 1 );
			// puffParticles.mesh.position.copy( target.point );
			puffParticles.triggerPoolEmitter( 1, ( impactPosition.set( target.point.x, target.point.y, target.point.z ) ) );

			if ( isFinite( target.object.mass ) ) {
				// is not static object
				// -> launch into space

				sounds.positional.bow.bow.play();

				var from = camera.getWorldPosition();
				physics.applyDirectionalImpulse( target, from, this.power );

			}

		}

	};

	// var x = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 1.5 ), new THREE.MeshNormalMaterial() );
	// controls.getControls().getObject().add( x );
	// x.position.set( 0.1, -0.2, 0 );
	var swayFactor = 0;
	var swayPosition = new THREE.Vector3();

	function sway( velocity, oldPos, elapsedTime ) {

		// weapon sway logic by makc
		// holy shit that genius
		// https://github.com/makc/fps-three.js/blob/gh-pages/scripts/modules/systems/handleShotgun.js#L10-L15

		// sway the weapon as you go
		var t = 5e-3 * (Date.now() % 6283); // = elapsedTime, resets at 30s
		// console.log( t );
		// var a = motion.airborne ? 0 : motion.velocity.length(), b;
		var a = velocity.length(), b;
		swayFactor *= 0.8; // how fast reposition to zero
		swayFactor += 0.001 * a;  //how much swing x-axis
		a = swayFactor; 
		b = 0.2 * a; // how much swing y-axis

		swayPosition.set( oldPos.x + a * Math.cos( t ), oldPos.y + b * ( Math.cos( t * 2 ) - 1 ) , oldPos.z );

		return swayPosition;

	}

	Weapon.prototype.update = function() {

		var velocity = controls.getVelocity();
		var swayPosition = sway( velocity, this.originPos );

		// only sway when not in iron sights
		if ( this.aiming === false ) {
			this.mesh.position.copy( swayPosition );
		}

	};


	function tweenVector ( source, target, time ) {

		var time = time || 800;
		// TWEEN.removeAll();
		return new TWEEN.Tween( source ).to( {
			x: target.x,
			y: target.y,
			z: target.z }, time )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			// .easing( TWEEN.Easing.Quadratic.InOut)
			// .easing( TWEEN.Easing.Elastic.Out)
			.start();
	}

	Weapon.prototype.enterIronSights = function( time ) {

		setTimeout( function(){ 
			this.aiming = !this.aiming;
			this.transition = false;
		}.bind( this ), time );

		var source = this.mesh.position;
		var target = this.ironSightPosition;
		tweenVector( source, target, time );

		var source = this.mesh.rotation;
		var target = this.ironSightRotation;
		tweenVector( source, target, time );

		new TWEEN.Tween( controls.crosshair.material ).to( { opacity: 0 }, time ).start();

		new TWEEN.Tween( camera ).to( { fov: 40 }, time )
			// .easing( TWEEN.Easing.Sinusoidal.InOut )
			.easing( TWEEN.Easing.Quartic.InOut )
			.onUpdate( camera.updateProjectionMatrix )
			// .onComplete( fsm.transition )
			// .easing( TWEEN.Easing.Quadratic.InOut)
			// .easing( TWEEN.Easing.Elastic.Out)
			.start();

		// size up particle emitters
		// to show up behind weapon
		var particleGroup = this.muzzleparticle;
		for ( var i = 0; i < particleGroup.emitters.length; i ++ ) {
			particleGroup.emitters[ i ].size.value = [ 0.3, 0.3, 0.1 ];
			// particleGroup.emitters[ i ].position.value = new THREE.Vector3( 0, 0.5, 0 );
			// particleGroup.emitters[ i ].velocity.value = new THREE.Vector3( 0, 1, -10 );
			particleGroup.emitters[ i ].position.spread = new THREE.Vector3( 0.2, 0.2, 0.1 );
			particleGroup.emitters[ i ].acceleration.value = new THREE.Vector3( 10, 10, 2 );
		}


	};

	Weapon.prototype.leaveIronSights = function( time ) {

		setTimeout( function(){ 
			this.aiming = !this.aiming;
			this.transition = false;
		}.bind( this ), time );

		var source = this.mesh.position;
		var target = this.originPos;
		tweenVector( source, target, time );

		var source = this.mesh.rotation;
		var target = this.originRot;
		tweenVector( source, target, time );
		
		new TWEEN.Tween( controls.crosshair.material ).to( { opacity: 1 }, time ).start();

		new TWEEN.Tween( camera ).to( { fov: 60 }, time )
			// .easing( TWEEN.Easing.Sinusoidal.InOut )
			// .easing( TWEEN.Easing.Quartic.InOut )
			.easing( TWEEN.Easing.Cubic.InOut )
			.onUpdate( camera.updateProjectionMatrix )
			// .onComplete( fsm.transition )
			// .easing( TWEEN.Easing.Quadratic.InOut)
			// .easing( TWEEN.Easing.Elastic.Out)
			.start();

		// console.log( this.muzzleparticle );
		// reset emitter to default values
		var particleGroup = this.muzzleparticle;
		for ( var i = 0; i < particleGroup.emitters.length; i ++ ) {
            particleGroup.emitters[ i ].size.value = [ 0.1, 0.1, 0.02 ];
            // particleGroup.emitters[ i ].position.value = new THREE.Vector3( 0, 0.5, 0 );
            // particleGroup.emitters[ i ].velocity.value = new THREE.Vector3( 0, 1, -10 );
            particleGroup.emitters[ i ].position.spread = new THREE.Vector3( 0.05, 0.05, 0.02 );
            particleGroup.emitters[ i ].acceleration.value = new THREE.Vector3( 5, 5, 2 );
        }

	};

	Weapon.prototype.aim = function( time ) {

		// sway -> only vertical when aimed

		// prevent trigger multiple tweens
		if ( this.transition === true ) {
			return false;
		}

		var time = time || 500;
		this.transition = true;
		if ( ! this.aiming ) {
			// zoom In
			this.enterIronSights( time );

		} else {
			// zoom Out
			this.leaveIronSights( time );

		}

	};

	Weapon.prototype.reload = function( callback, scope ) {

		var weapon = this;

		if ( this.name === "Shotgun" ) {

			// var toggle = 2;
			var missing = this.maxCapacity - this.currentCapacity;

			var numberToReload = missing;
			if ( missing > this.magazines * this.maxCapacity ) {
				numberToReload = this.magazines * this.maxCapacity;
			}

			// that.magazines = ( that.magazines * that.maxCapacity - missing ) / that.maxCapacity; 
			// that.magazines--;

			var intervalHandle = setIntervalX ( function ( x ) {

				// var origin = camera.getWorldPosition();
				// origin.x += toggle;
				// toggle *= -1;

				// that.reloadSound.playAtWorldPosition( origin );
				weapon.reloadSound.isPlaying = false;
				weapon.reloadSound.play();
				weapon.magazines -= ( 1 / weapon.maxCapacity );

				weapon.currentCapacity ++;
				// that.alterCapacity( 1 );

				// if ( that.currentCapacity === that.maxCapacity ) {
				// wat?
				if ( weapon.currentCapacity - numberToReload === weapon.maxCapacity - missing ) {
					weapon.fsm.readyToFire();
				}

				weapon.onChanged();

			}, this.reloadTime * 1000, numberToReload );

		} else {

			this.reloadSound.play();

			setTimeout( function () { 
				
				weapon.magazines--;
				weapon.reloading = false;
				weapon.currentCapacity = weapon.maxCapacity;
				weapon.onChanged();
				// that.alterCapacity( that.maxCapacity );
				weapon.fsm.readyToFire();

			}, weapon.reloadTime * 1000 );

		}

	};

	Weapon.prototype.restock = function( number ) {

		this.magazines += number;
		sounds.cling.play();
		this.onChanged();

	};

	Weapon.prototype.fireEffect = function( ammoPoint, ammoNormal, body ) {

	};

	
	Weapon.prototype.setCallback = function ( scope, callbackFunction )
	{

		this.scope = scope;
		this.callbackFunction = callbackFunction;

	};


	Weapon.prototype.onChanged = function () 
	{

		if( this.scope != null )
		{
			this.callbackFunction.call( this.scope );
		}

	};
	
	return Weapon;

});