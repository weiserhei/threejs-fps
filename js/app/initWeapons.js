/**
* Weapon Class
* 
*/

/*
	TODO weapon always on top?
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"sounds",
	"camera",
	"classes/Weapon",
	"loadingManager"
], function ( THREE, scene, debugGUI, physics, sounds, camera, Weapon, loadingManager ) {

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

	function gunHelper( mesh, offset ) {

		var test = mesh.clone();
		scene.add( test );
		test.position.set( 0, 1.2, 0 );

		var x = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshNormalMaterial({wireframe:true}) );
		test.add( x );
		x.position.copy( offset );

	}

	function screenPosition( percentX, percentY, posz ) {

		var position = new THREE.Vector3();
		
		var pyramidPositionX = (percentX / 100) * 2 - 1;
		var pyramidPositionY = (percentY / 100) * 2 - 1;

		position.set( pyramidPositionX * camera.aspect, pyramidPositionY, posz );

		return position;

	}

	function init() {

		var weapons = new THREE.Group();

		var shotgun = new Weapon( shotgunMesh );
		shotgun.name = "shotgun";
		shotgun.maxCapacity = 8;
		shotgun.currentCapacity = 8;
		shotgun.magazines = 1;
		shotgun.shootDelay = 0.15;
		shotgun.shootSound = sounds.railgun;
		shotgun.reloadSound = sounds.shellload;
		shotgun.reloadTime = 0.3;
		shotgun.mesh = shotgunMesh;
		// shotgun.emitterPool = "shotgun";
		shotgun.ironSightPosition = new THREE.Vector3( 0.000, -0.14, shotgunMesh.position.z );
		weapons.add( shotgunMesh );

		var sniper = new Weapon( sniperMesh );
		sniper.name = "Sniper"
		sniper.maxCapacity = 6;
		sniper.currentCapacity = 6;
		sniper.magazines = 2; 
		sniper.reloadTime = 4; 
		sniper.shootDelay = 1;
		sniper.shootSound = sounds.sniperrifle;
		sniper.reloadSound = sounds.sniperreload;
		// sniper.mesh = sniperMesh;
		// emitterPool: this.muzzleFlash,
		weapons.add( sniperMesh );

		sniper.ironSightPosition = new THREE.Vector3( 0.006, -0.125, sniperMesh.position.z );
		sniper.ironSightRotation = new THREE.Vector3( 0, 0.0 * Math.PI / 180, 0 );

		var rifle = new Weapon( rifleMesh );
		rifle.name = "G36C"
		rifle.maxCapacity = 30;
		rifle.currentCapacity = 30;
		rifle.magazines = 2; 
		rifle.reloadTime = 2; 
		rifle.shootDelay = 0.1;
		rifle.shootSound = sounds.sniperrifle;
		rifle.reloadSound = sounds.sniperreload;
		// rifle.mesh = rifleMesh;
		rifle.ironSightPosition = new THREE.Vector3( 0.000, -0.27, rifleMesh.position.z );

		// debugGUI.add( rifle.mesh.position, "y", -2.0, 2.0 ).step( 0.01 ).listen();
		// console.log( rifle.mesh );

		weapons.add( rifleMesh );

		// playerMesh.add( weapons );

		return {
			shotgun: shotgun,
			sniper: sniper,
			rifle: rifle,
		};

	}

	// MODELS AND TEXTURES

	var textureLoader = new THREE.TextureLoader( loadingManager );
	var loader = new THREE.OBJLoader( loadingManager );

	var t_shotgun = textureLoader.load( 'assets/models/shotgun_l4d/twd_shotgun.png' );
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

		var s = 0.55;
		object.geometry.scale( s, s, s );
		object.geometry.center();
		object.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( -90 * Math.PI / 180 ) );

		var bbox = new THREE.BoundingBoxHelper( object );
		bbox.update();
		var boundingBoxSize = bbox.box.max.sub( bbox.box.min );

		var offset = new THREE.Vector3( 0, boundingBoxSize.y / 3.5, - ( boundingBoxSize.z / 2 + 0.05 ) );
		object.userData.emitterVector = offset;

		// gunHelper( object, offset );

		object.receiveShadow = true;

		object.material.color.setHSL( 0, 0, 1 );
		object.material.map = t_shotgun;
		object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		// object.rotation.y = -90 * Math.PI / 180;
		// object.rotation.x = -2 * Math.PI / 180;
		
		// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
		
		var position = screenPosition( 54, 37, -0.5 );
		object.position.copy( position );

		shotgunMesh = object;

	});

	/*
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
		var pyramidPercentY = 38;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;


		var position = screenPosition( 55, -79, -0.5 );
		object.position.copy( position );
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.6 );

		sniperMesh = object;

	} );
	*/

	
	var t_sniper = textureLoader.load( 'assets/models/mk14/MK14.jpg' );
	var t_sniper_n = textureLoader.load( 'assets/models/mk14/MK14_normalprot.jpg' );
	var t_sniper_s = textureLoader.load( 'assets/models/mk14/MK14_specular.jpg' );
	var sniperMesh;
	loader.load( 'assets/models/mk14/MK14-2.obj', function ( object ) {

		var object = object.children[0];

		var s = 0.003;
		object.geometry.center();
		object.geometry.scale( s, s, s );

		var bbox = new THREE.BoundingBoxHelper( object );
		bbox.update();
		var boundingBoxSize = bbox.box.max.sub( bbox.box.min );
		
		var offset = new THREE.Vector3( 0, boundingBoxSize.y / 3.5, - ( boundingBoxSize.z / 2 + 0.05 ) );
		object.userData.emitterVector = offset;

		// console.log( object );
		// object.receiveShadow = true;

		// object.material.color.setHSL( 0, 0, 1 );
		var material = object.material;
		material.map = t_sniper;
		material.normalMap = t_sniper_n;
		material.normalScale.set( -1, -1 );
		material.specularMap = t_sniper_s;
		material.specular.setHex( 0x444444 );
		material.shininess = 30;
		// object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		// var somevalue = { scale: 1 };
		// function xasd() { material.normalScale.set( somevalue.scale, somevalue.scale ); }
		// debugGUI.add( somevalue, "scale" ).min( -2 ).max( 2 ).onChange( xasd );

		// object.rotation.y = - 1 * Math.PI / 180; // + rotation nach links
		object.rotation.x = - 3 * Math.PI / 180; // - positiv = weiter nach unten

		var position = screenPosition( 53, 39, -0.5 );
		object.position.copy( position );
		
		// var test = object.clone();
		// scene.add( test );
		// test.position.set( 0, 1.2, 0 );
		// scene.add( object );
		sniperMesh = object;

	} );
	
	/*
	var t_sniper = textureLoader.load( 'assets/models/g36c/mat/g36c_d_fin.jpg' );
	var t_sniper_n = textureLoader.load( 'assets/models/g36c/mat/g36c_n_fin.jpg' );
	var t_sniper_s = textureLoader.load( 'assets/models/g36c/mat/g36c_spec.jpg' );	
	var t_sniper_ao = textureLoader.load( 'assets/models/g36c/mat/basic/g36c_bake_ao.png' );	
	var t_sniper_l = textureLoader.load( 'assets/models/g36c/mat/basic/g36c_bake_general_light_fine.png' );	
	var sniperMesh;
	loader.load( 'assets/models/g36c/g36c_arby26.obj', function ( object ) {

		var parent = object;
		// var object = object.children[3]; 
		// 0 = eotech
		// 1 = main body
		// 2 = mag + muzzle + upper guard
		// 3 = glass
		// object.traverseVisible ( function ( object ) { object.visible = false; } );

		object.scale.set( 0.05, 0.05, 0.05 );
		object.position.set( 0, 0.2, 0 );
		console.log( object );
		// object.receiveShadow = true;

		// object.material.color.setHSL( 0, 0, 1 );
		var material = object.children[ 0 ].material;
		material.map = t_sniper;
		material.normalMap = t_sniper_n;
		material.normalScale.set( -1, -1 );
		material.specularMap = t_sniper_s;
		material.aoMap = t_sniper_ao;
		console.log( material );
		// material.lightMap = t_sniper_l;

		// material.specular.setHex( 0x444444 );
		// material.shininess = 30;
		// material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		var somevalue = { scale: 1 };
		function xasd() { material.normalScale.set( somevalue.scale, somevalue.scale ); }

		debugGUI.add( somevalue, "scale" ).min( -2 ).max( 2 ).onChange( xasd );

		var position = screenPosition( 53, 35, -0.4 );
		object.position.copy( position );

		var pyramidPercentX = 53;
		var pyramidPercentY = 41;
		var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
		var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			
		object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.4 );
		
		var test = object.clone();
		scene.add( test );
		test.position.set( 0, 1.2, 0 );
		// scene.add( object );
		sniperMesh = object;

	} );
	*/

	var t_rifle = textureLoader.load( 'assets/models/g36c/mat/g36c_d_fin.jpg' );
	var t_rifle_n = textureLoader.load( 'assets/models/g36c/mat/g36c_n_fin.jpg' );
	var t_rifle_s = textureLoader.load( 'assets/models/g36c/mat/g36c_spec.jpg' );	
	var t_rifle_ao = textureLoader.load( 'assets/models/g36c/mat/basic/g36c_bake_ao.png' );	
	var t_rifle_l = textureLoader.load( 'assets/models/g36c/mat/basic/g36c_bake_general_light_fine.png' );	
	var rifleMesh;
	loader.load( 'assets/models/g36c/g36c_arby26.obj', function ( object ) {

		var object = object.children[ 0 ];

		var s = 0.05;
		object.geometry.center();
		object.geometry.scale( s, s, s );

		var bbox = new THREE.BoundingBoxHelper( object );
		bbox.update();
		var boundingBoxSize = bbox.box.max.sub( bbox.box.min );

		var offset = new THREE.Vector3( 0, boundingBoxSize.y / 5, - ( boundingBoxSize.z / 2 + 0.05 ) );
		object.userData.emitterVector = offset;

		// console.log( object );
		// object.receiveShadow = true;

		// object.material.color.setHSL( 0, 0, 1 );
		var material = object.material;
		material.map = t_rifle;
		material.normalMap = t_rifle_n;
		material.normalScale.set( -1, -1 );
		material.specularMap = t_rifle_s;
		material.aoMap = t_rifle_ao;
		// material.lightMap = t_rifle_l;
		// console.log( material );

		// material.specular.setHex( 0x444444 );
		// material.shininess = 30;
		// material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		// var somevalue = { scale: 1 };
		// function xasd() { material.normalScale.set( somevalue.scale, somevalue.scale ); }
		// debugGUI.add( somevalue, "scale" ).min( -2 ).max( 2 ).onChange( xasd );

		// object.rotation.y = 90 * Math.PI / 180;
		object.rotation.x = - 3 * Math.PI / 180; // + positiv = weiter nach unten

		var position = screenPosition( 54, 31, -0.5 );
		object.position.copy( position );

		rifleMesh = object;

	} );

	return init;

});