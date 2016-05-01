/**
* Init Weapons
* 
*/

/*
	TODO render weapon always on top?
*/

define([
	"three",
	"debugGUI",
	"physics",
	"sounds",
	"classes/Weapon",
	"loadWeapons"
], function ( THREE, debugGUI, physics, sounds, Weapon, loadWeapons ) {

	'use strict';

	// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs

	// weapons.portalgun = new Weapon( "portalgun", {
	// 	maxCapacity: 0, 
	// 	magazines: 0, 
	// 	reloadTime: 0, 
	// 	shootDelay: 0.5,
	// 	shootSound: that.sounds.swosh1,
	// 	altSound: that.sounds.swosh5,
	// 	// reloadSound: that.sounds.sniperreload,
	// 	// emitterPool: this.muzzleFlash,
	// 	} );

	// for ( var key in weapons ) {
	// 	weapons[key].emitterPool = this.muzzleFlash;
	// 	weapons[key].emptySound = this.sounds.soundClick;
	// 	weapons[key].restockSound = this.sounds.sound3;
	// }

	function init( hud ) {

		// var weapons = new THREE.Group();

		var shotgun = new Weapon( loadWeapons.shotgun );
		shotgun.name = "Shotgun";
		shotgun.maxCapacity = 8;
		shotgun.currentCapacity = 8;
		shotgun.magazines = 1;
		shotgun.shootDelay = 0.15;
		shotgun.shootSound = sounds.railgun;
		shotgun.reloadSound = sounds.shellload;
		shotgun.reloadTime = 0.3;
		shotgun.power = 20;
		// shotgun.ironSightPosition = new THREE.Vector3( 0.000, -0.14, shotgunMesh.position.z );
		shotgun.ironSightPosition = new THREE.Vector3( 0.014, -0.03, shotgun.mesh.position.z + 0.15 );
		// weapons.add( shotgun.mesh );

		var sniper = new Weapon( loadWeapons.sniper );
		sniper.name = "MK 14"
		sniper.maxCapacity = 6;
		sniper.currentCapacity = 6;
		sniper.magazines = 2; 
		sniper.reloadTime = 4; 
		sniper.shootDelay = 0.8;
		sniper.power = 100;
		sniper.shootSound = sounds.sniperrifle;
		sniper.reloadSound = sounds.sniperreload;
		sniper.emptySound = sounds.cling;
		sniper.ironSightPosition = new THREE.Vector3( 0.006, -0.125, sniper.mesh.position.z );
		sniper.ironSightRotation = new THREE.Vector3( 0, 0.0 * Math.PI / 180, 0 );
		// weapons.add( sniper.mesh );

		var rifle = new Weapon( loadWeapons.rifle );
		rifle.name = "G36C"
		rifle.maxCapacity = 30;
		rifle.currentCapacity = 30;
		rifle.magazines = 2; 
		rifle.reloadTime = 3.1; 
		rifle.shootDelay = 0.1;
		rifle.power = 50;
		rifle.shootSound = sounds.rifleshot;
		rifle.reloadSound = sounds.g36reload;
		rifle.ironSightPosition = new THREE.Vector3( 0.000, -0.27, rifle.mesh.position.z );
		// weapons.add( rifle.mesh );

		// debugGUI.add( rifle.mesh.position, "y", -2.0, 2.0 ).step( 0.01 ).listen();

		return {
			shotgun: shotgun,
			sniper: sniper,
			rifle: rifle,
		};

	}

	return init;

});