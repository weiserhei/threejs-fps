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
	"classes/Weapon",
	"loadingManager"
], function ( THREE, scene, debugGUI, physics, sounds, controls, camera, Weapon, loadingManager ) {

	'use strict';

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


	var textureLoader = new THREE.TextureLoader( loadingManager );
	var t_shotgun = textureLoader.load( 'assets/models/shotgun_l4d/twd_shotgun.png' );

	var loader = new THREE.OBJLoader( loadingManager );
	var shotgunMesh;
	loader.load( 'assets/models/shotgun_l4d/shotgun.obj', function ( object ) {

		/*		
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = T_shotgun;
			}
		} );
		*/

		object = object.children[0];

		object.scale.set( 0.55,0.55,0.55 ); 
		object.receiveShadow = true;

		object.material.color.setHSL( 0, 0, 1 );
		object.material.map = t_shotgun;
		object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		object.rotation.y = -90 * Math.PI / 180;
		object.rotation.x = -2 * Math.PI / 180;
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
		
		var pyramidPercentX = 56;
		var pyramidPercentY = -28;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		object.position.x = pyramidPositionX * camera.aspect;
		object.position.y = pyramidPositionY;
		object.position.z = -0.5;
				
		var pyramidPercentX = 58;
		var pyramidPercentY = 35;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );

		// console.log( object );

		// object.position.y = -1;
		shotgunMesh = object;

	});


	var t_sniper = textureLoader.load( 'assets/models/scoped_rifle/twd_riflescoped.png' );
	var sniperMesh;
	loader.load( 'assets/models/scoped_rifle/scoped_rifle.obj', function ( object ) {

		var object = object.children[0];
		object.traverseVisible ( function ( object ) { object.visible = false; } );

		object.scale.set( 0.8,0.8,0.8 ); 
		object.receiveShadow = true;

		object.material.color.setHSL( 0, 0, 1 );
		object.material.map = t_sniper;
		object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		// object.position.set( 40,-15,-10 );
		object.rotation.y = -90 * Math.PI / 180;
		object.rotation.x = -2 * Math.PI / 180; // + positiv = weiter nach unten
		// scene.add( object );
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs

		var pyramidPercentX = 55;
		var pyramidPercentY = -79;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
		object.position.x = pyramidPositionX * camera.aspect;
		object.position.y = pyramidPositionY;
		object.position.z = -0.5;

		var pyramidPercentX = 55;
		var pyramidPercentY = 38;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.6 );

		sniperMesh = object;

	} );	
	
	function init( playerMesh ) {

		var shotgun = new Weapon();
		shotgun.name = "shotgun";
		shotgun.maxCapacity = 8;
		shotgun.currentCapacity = 20;
		shotgun.magazines = 1;
		shotgun.shootDelay = 0.15;
		shotgun.shootSound = sounds.railgun;
		shotgun.reloadSound = sounds.shellload;
		shotgun.reloadTime = 0.3;
		shotgun.mesh = shotgunMesh;
		// shotgun.emitterPool = "shotgun";

		playerMesh.add( shotgunMesh );

		var sniper = new Weapon();
		sniper.name = "Sniper"
		sniper.maxCapacity = 6;
		sniper.currentCapacity = 6;
		sniper.magazines = 2; 
		sniper.reloadTime = 4; 
		sniper.shootDelay = 1;
		sniper.shootSound = sounds.sniperrifle;
		sniper.reloadSound = sounds.sniperreload;
		sniper.mesh = sniperMesh;
		// emitterPool: this.muzzleFlash,

		playerMesh.add( sniperMesh );

		return {
			shotgun: shotgun,
			sniper: sniper
		};

	}

	return init;

});