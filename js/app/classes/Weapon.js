/**
* Weapon Class
* 
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"sounds",
	"controls",
	"camera",
	"../../libs/state-machine.min",
	"muzzleparticle"
], function ( THREE, scene, debugGUI, physics, sounds, controls, camera, StateMachine, muzzleparticle ) {

	'use strict';

	function setIntervalX(callback, delay, repetitions) 
	{
	    var x = 0;
	    var intervalID = window.setInterval(function () {

	       callback(x);

	       if (++x === repetitions) {
	           window.clearInterval(intervalID);
	       }
	    }, delay);
	}

	var options = {
		energy: 50
	};

	var folder = debugGUI.getFolder("Shoot me Up");
	folder.open();
	folder.add( options, "energy" ).min( 1 ).max( 100 );

	// var emitterHelper = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshLambertMaterial({ wireframe: true }));
	// camera.add( emitterHelper );
	// folder.add( emitterHelper.material, "visible" );

	var endPoint = new Goblin.Vector3();
	// var startPoint = new Goblin.Vector3();
	var startPoint = new THREE.Vector3();

	function raycast() {

		// var startPoint = camera.getWorldPosition();
		var startPoint = controls.getControls().getObject().getWorldPosition();
		var direction = camera.getWorldDirection();
		var distance = 40;

		endPoint.addVectors( startPoint, direction.multiplyScalar( distance ) );

		// scene.remove( arrowHelper );
		// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// var arrowHelper = new THREE.ArrowHelper( direction, pP, 5, 0xFF0000 );
		// scene.add( arrowHelper );

		// console.log( start, end );
		var intersections = physics.getWorld().rayIntersect( startPoint, endPoint );
		// todo
		// dont intersect with player cylinder -.-

		return intersections;

	}

	var invertNormalGoblin = new Goblin.Vector3();
	function applyImpulse( target ) {

		// console.log( target );
		sounds.positional.bow.bow.play();

		// var normal = target.normal;
		var body = target.object;
		var point = target.point;

		var pP = camera.getWorldPosition();
		// var invertPos = new THREE.Vector3();
		// var vec = new THREE.Vector3( point.x, point.y, point.z );
		// var vec = new Goblin.Vector3( pP.x, pP.y, pP.z );
		// var invertNormal = vec.clone().sub( pP ).normalize();

		// danger
		// math operation using THREE.Vector3
		// no obvious errors
		invertNormalGoblin.subtractVectors( point, pP );
		invertNormalGoblin.normalize();
		invertNormalGoblin.scale( options.energy );
		
		// body.applyImpulse( invertNormalGoblin );
		// body.applyForceAtLocalPoint( invertNormalGoblin, point );
		body.applyForceAtWorldPoint ( invertNormalGoblin, point );

	}

	function setupFSM( weapon ) {

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

					if( weapon.currentCapacity > 0 ) {
						weapon.currentCapacity -= 1;
					}

					weapon.onChanged();
					
				},

				onfire: function( event, from, to ) {

					if ( to === "checking" ) {

						// fire emitter
						weapon.shootSound.isPlaying = false;
						// // sounds.railgun.stop();
						weapon.shootSound.play();
						weapon.muzzleparticle.triggerPoolEmitter( 1 );

						var intersections = raycast();

						if ( intersections.length > 0 ) {

							var target = intersections[ 0 ];

							if ( isFinite( target.object.mass ) ) {
								// is not static object
								// -> launch into space
								applyImpulse( target );

							}

						}

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

		folder.open();

		folder.add( fsm, "current" ).name("Current State").listen();
		folder.add( fsm, "fire" ).name("fire");
		folder.add( fsm, "reload" ).name("reload");

		return fsm;

	}

	function Weapon() {

		this.name = "";
		this.maxCapacity = 30;
		this.currentCapacity = this.maxCapacity;
		this.magazines = 3;
		this.shootDelay = 1;
		this.shootSound;
		this.reloadSound;
		this.emptySound = sounds.weaponclick;

		this.mesh;

		this.muzzleparticle = muzzleparticle;

		this.fsm = setupFSM( this );

	}

	Weapon.prototype.toString = function() {

		return this.name + ": " + this.currentCapacity + "/" + this.maxCapacity * this.magazines + " Ammo";

	};


	Weapon.prototype.activate = function() {
		this.mesh.traverse( function ( object ) { object.visible = true; } );

		if ( typeof this.muzzleparticle !== 'undefined' ) { 

			this.muzzleparticle.mesh.position.copy( this.mesh.emitterVector );
			// emitterHelper.position.copy( this.mesh.emitterVector );

		}

		this.onChanged();

	};

	Weapon.prototype.shoot = function( clock ) {

		// if fsm.reloading dont count delay?

		var delay = clock.getElapsedTime() - this.lastShotFired;
		// exit when fireing to fast
		if ( delay < this.shootDelay ) { return false; }
		this.lastShotFired = clock.getElapsedTime();		

		this.fsm.fire();

	};

	Weapon.prototype.reload = function( callback, scope ) {

		var weapon = this;

		if ( this.name === "shotgun" ) {

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