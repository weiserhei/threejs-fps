/**
* Init supplys
* 
*/

define([
	"three",
	"scene",
	"debugGUI",
	"loadingManager",
	"physics",
	"classes/Weapon"
], function ( THREE, scene, debugGUI, loadingManager, physics, Weapon ) {

	'use strict';

	function onError( xhr ) {
		console.error( "error", xhr );
	}

	function onProgress( xhr ) {
		// console.warn("on progress", xhr );
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

	}, onProgress, onError );


	function supplyGhostBody( supplyMesh, boundingBoxSize, player ) {

		showGhost( boundingBoxSize, supplyMesh );

		var ghost_body = physics.ghostBody( boundingBoxSize.clone().multiplyScalar( 2 ), supplyMesh.position, supplyMesh.rotation );

		// Set masks to only collide with player body
		// https://github.com/chandlerprall/GoblinPhysics/wiki/Collision-Masking
		var INCLUSIVE_MASK = 1,
		    GROUP_PLAYER = 2;

		ghost_body.collision_mask = INCLUSIVE_MASK | GROUP_PLAYER;

		// callbacks

		// ghost_body.addListener(
		// 				'contactStart',
		// 				function() {
		// 					// console.log("contactStart");
		// 				}
		// 			);
	
		var lastUpdate = 0;
		function contactContinue() {
			// console.log("contactContinue");
			// todo: show restock zone icon

			// var t = 5e-3 * (Date.now() % 6283);
			var seconds = new Date() / 1000;
			// console.log( t );

			if ( seconds > lastUpdate + 2 ) {
				lastUpdate = seconds;

				if ( player.inHands instanceof Weapon ) {

					player.inHands.restock( 1 );

				}
			}

			// alternative
			// if ( this._onTrigger2 === false ) {

			// 	player.inHands.restock( 1 );
			// 	this._onTrigger2 = true;
				
			// 	setTimeout( function() { this._onTrigger2 = false; }.bind( this ), 2000 );
			// }

		}

		ghost_body.addListener( 'contactContinue', contactContinue );

		// ghost_body.addListener(
		                // todo: hide restock zone icon
		// 				'contactEnd',
		// 				function() {
		// 					// console.log("contactEnd");
		// 				}
		// 			);

		return ghost_body;

	}

	function showGhost( boundingBoxSize, object ) {

		var size = boundingBoxSize.clone().multiplyScalar( 2 );
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( size.x, size.y, size.z ), new THREE.MeshLambertMaterial({ transparent:true, opacity: 0.1 } ) );
		scene.add( mesh );
		mesh.position.copy( object.position );
		mesh.rotation.copy( object.rotation );
		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		return mesh;

	}

	function initSupplys( player ) {

		var object = supplyMesh;

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		
		object.position.set( 3.8, 0, 4.1 );
		// object.rotation.y = 170 * Math.PI / 180;
		object.matrixAutoUpdate = false;
		object.updateMatrix();
		scene.add( object );

		physics.makeStaticBox( boundingBoxSize.clone(), object.position, object.rotation );
		supplyGhostBody( object, boundingBoxSize, player );
		
		// var clone = object.clone();
		// clone.position.set( 4.3, 0, 3.3 );
		// clone.rotation.y = -90 * Math.PI / 180;
		// physics.makeStaticBox( boundingBoxSize.clone(), clone.position, clone.rotation );		
		// supplyGhostBody( clone, boundingBoxSize, player );
		// scene.add( clone );


		/*
		// b2.addEventListener("collide", function(e){ console.log("sphere collided"); } );
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

		return object;

	}

	return initSupplys;

});