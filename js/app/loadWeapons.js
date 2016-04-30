/**
* Init Weapons
* 
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"camera",
	"loadingManager"
], function ( THREE, scene, debugGUI, physics, camera, loadingManager ) {

	'use strict';

	function onProgress( xhr ) {
		// console.log("on progress", xhr );
	}

	function onError( xhr ) {
		console.error( "error", xhr );
	}

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

	var group = {};

	// MODELS AND TEXTURES

	//1912
	// scale 0.11, y+z* 0.15

	var textureLoader = new THREE.TextureLoader( loadingManager );
	var loader = new THREE.OBJLoader( loadingManager );

	var t_shotgun = textureLoader.load( 'assets/models/ithaca/M37_diffuse.jpg' );
	var t_shotgun_n = textureLoader.load( 'assets/models/ithaca/M37_normal.jpg' );
	var t_shells = textureLoader.load( 'assets/models/ithaca/Shells_diffuse.jpg' );
	var t_shells_n = textureLoader.load( 'assets/models/ithaca/Shells_normal.jpg' );
	var t_shotgun_s = textureLoader.load( 'assets/models/ithaca/M37_specular.jpg' );
	var shotgunMesh;
	// loader.load( 'assets/models/shotgun_l4d/shotgun.obj', function ( object ) {
	// loader.load( 'assets/models/shotgun_m1014/shotgun_m1014.obj', function ( object ) {
	loader.load( 'assets/models/ithaca/m37 tris.obj', function ( object ) {

		// object = object.children[0];
		// console.log( object );
		var s = 0.003;
		// object.scale.set( s, s, s );
		// object.rotation.y = 180 * Math.PI / 180;
		for ( var i = 0; i < object.children.length; i ++ ) {
			var obj = object.children[ i ];
			// console.log( obj );
			obj.geometry.scale( s, s, s );
			// obj.geometry.center();
			obj.geometry.applyMatrix( new THREE.Matrix4().makeRotationY( 180 * Math.PI / 180 ) );
		}

		var bbox = new THREE.BoundingBoxHelper( object );
		bbox.update();
		var boundingBoxSize = bbox.box.max.sub( bbox.box.min );

		var offset = new THREE.Vector3( -0.02, 0, - ( boundingBoxSize.z / 2 + 0.05 ) );
		object.userData.emitterVector = offset;

		// gunHelper( object, offset );

		object.receiveShadow = true;
		var material = object.children[0].material;
		material.color.setHSL( 0, 0, 2 );
		material.map = t_shotgun;
		material.normalMap = t_shotgun_n;
		material.specularMap = t_shotgun_s;
		material.specular.setHex( 0xFFFFFF );
		material.map.anisotropy = 8; //front barrel of the weapon gets blurry

		var material2 = object.children[2].material.clone();
		material2.map = t_shells;
		material2.normalMap = t_shells_n;
		object.children[2].material = material2;

		// var test = object.clone();
		// scene.add( test );
		// test.position.set( 0, 1.2, 0 );
		// scene.add( object );
		
		// var position = screenPosition( 54, 37, -0.5 );
		var position = screenPosition( 54, 42, -0.5 );
		object.position.copy( position );

		// shotgunMesh = object;

		group.shotgun = object;

	}, onProgress, onError );

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
		// sniperMesh = object;

		group.sniper = object;

	}, onProgress, onError );

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

		// rifleMesh = object;
		group.rifle = object;

	}, onProgress, onError );


	return group;

});