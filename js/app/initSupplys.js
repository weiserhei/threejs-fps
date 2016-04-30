/**
* Init supplys
* 
*/

define([
	"three",
	"scene",
	"debugGUI",
	"sounds",
	"loadingManager",
	"classes/Item",
	"physics"
], function ( THREE, scene, debugGUI, sounds, loadingManager, Item, physics ) {

	'use strict';


	function onError( xhr ) {
		console.log( "error", xhr );
	}

	function onProgress() {

	}

	// supply model
	var supplyMesh;
	var directoryPath = "assets/models/";
	var name = "Supplies";        

	var mtlLoader = new THREE.MTLLoader( loadingManager );
	var url = directoryPath + name + "/";
	mtlLoader.setPath( url );

	mtlLoader.load( name + ".mtl", function( materials ) {
		var directoryPath = "assets/models/";
		var name = "Supplies";
		var url = directoryPath + name + "/";

		materials.preload();

		var objLoader = new THREE.OBJLoader( loadingManager );
		objLoader.setMaterials( materials );
		objLoader.setPath( url );
		objLoader.load( name + ".obj", function ( object ) {

			// console.log( object );

			var object = object.children[ 0 ];

			var s = 0.045;
			// object.geometry.center();
			object.geometry.scale( s, s, s );

			object.castShadow = true;
			var length = object.material.materials.length;
			for ( var i = 0; i < length; ++ i ) {

				var material = object.material.materials[ i ];
				// material.color.setHex( 0xAAAAAA );
				material.color.setHex( 0xFFFFFF );
				// material.color.setRGB( 1, 1, 1 );
				// material.color.offsetHSL ( 0, 0, 1 );
				material.shininess = 10;
				// material.specular.setHex( 0x555555 );

			}

			supplyMesh = object;

		}, onProgress, onError );

	});


	function initSupplys( player ) {

		// var clone = object.clone();
		// CALCULATE BOUNDING BOX BEFORE ROTATION!

		var helper = new THREE.BoundingBoxHelper( supplyMesh, 0xff0000 );
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		
		supplyMesh.position.set( 3.8, 0, 4.1 );
		// object.rotation.y = 170 * Math.PI / 180;
		
		// clone.position.set( 4.3, 0, 3.3 );
		// clone.rotation.y = -90 * Math.PI / 180;
		
		scene.add( supplyMesh );
		// room.add( clone );

		// makeStaticBox( boundingBoxSize.clone(), clone.position, clone.rotation );		
		// makeStaticBox( new THREE.Vector3(1.3,1.8,1.1), new THREE.Vector3( -3.7, 0, -4.6 ), undefined , staticGeometry );
		// makeStaticBox( new THREE.Vector3(1.1,1.8,1.3), new THREE.Vector3( -2.9, 0, -3.3 ), undefined, staticGeometry );

		// scene.add( object );

		var size = boundingBoxSize.clone().multiplyScalar( 2 );
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( size.x, size.y, size.z ), new THREE.MeshLambertMaterial({ transparent:true, opacity: 0.1 } ) );
		console.log( size, mesh );
		scene.add( mesh );
		mesh.position.copy( supplyMesh.position );
		mesh.rotation.copy( supplyMesh.rotation );

		physics.makeStaticBox( boundingBoxSize.clone(), supplyMesh.position, supplyMesh.rotation );
		var ghost_body = physics.ghostBody( boundingBoxSize.clone().multiplyScalar( 2 ), supplyMesh.position, supplyMesh.rotation );

		// Set masks to only collide with player body
		// https://github.com/chandlerprall/GoblinPhysics/wiki/Collision-Masking
		var INCLUSIVE_MASK = 1,
		    GROUP_PLAYER = 2;

		ghost_body.collision_mask = INCLUSIVE_MASK | GROUP_PLAYER;

		// ghost_body.addListener(
		// 				'contactStart',
		// 				function() {
		// 					// console.log("contactStart");
		// 				}
		// 			);
	
		var lastUpdate = 0;
		function contactContinue() {
			// console.log("contactContinue");

			// var t = 5e-3 * (Date.now() % 6283);
			var seconds = new Date() / 1000;
			// console.log( t );

			if ( seconds > lastUpdate + 2 ) {
				lastUpdate = seconds;
				player.inHands.restock( 1 );
			}

			// if ( this._onTrigger2 === false ) {

			// 	player.inHands.restock( 1 );
			// 	this._onTrigger2 = true;
				
			// 	setTimeout( function() { this._onTrigger2 = false; }.bind( this ), 2000 );
			// }

		}

		ghost_body.addListener( 'contactContinue', contactContinue );				

		// ghost_body.addListener(
		// 				'contactEnd',
		// 				function() {
		// 					// console.log("contactEnd");
		// 				}
		// 			);
		/*
		// dynamic_body.addListener( "speculativeContact", function(e){ console.log("wtf"); } );
		dynamic_body.addListener(
						'speculativeContact',
						function() {
							console.log("speculativeContact");
						}
					);
		dynamic_body.addListener(
						'contact',
						function() {
							console.log("contact");
						}
					);
		*/
		// b2.addEventListener("collide", function(e){ console.log("sphere collided"); } );

		return supplyMesh;

	}

	return initSupplys;

});