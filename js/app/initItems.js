/**
* Initialize Items
* and some scene objects
*/

define([
	"three",
	"scene",
	"debugGUI",
	"physics",
	"Item",
	"Itemslot"
], function ( THREE, scene, debugGUI, physics, Item, Itemslot ) {

	'use strict';

	// table
	var dimension = new THREE.Vector3( 2, 1, 1 );
	var position = new THREE.Vector3( -3, 0, 0 );
	var table = new THREE.Mesh( new THREE.BoxGeometry( dimension.x, dimension.y, dimension.z ), new THREE.MeshPhongMaterial() );
	table.position.set( position.x, position.y + dimension.y / 2, position.z );
	table.matrixAutoUpdate = false;
	table.updateMatrix();
	table.castShadow = true;
	scene.add( table );
	physics.makeStaticBox( dimension, position );

	// table2
	var dimension = new THREE.Vector3( 2, 1, 1 );
	var position = new THREE.Vector3( 3, 0, 0 );
	var table = new THREE.Mesh( new THREE.BoxGeometry( dimension.x, dimension.y, dimension.z ), new THREE.MeshPhongMaterial() );
	table.position.set( position.x, position.y + dimension.y / 2, position.z );
	table.matrixAutoUpdate = false;
	table.updateMatrix();
	table.castShadow = true;
	scene.add( table );
	physics.makeStaticBox( dimension, position );


	function initItems( preloaded, raycastArray ) {
		// console.log("preloaded", preloaded );
		var raycastMeshes = [];

		// werenchkey
		var mesh = preloaded.wrenchkey.mesh.clone();

		var wrenchkey = new Item( mesh );
		wrenchkey.name = "Wrenchkey"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		wrenchkey.mesh.position.set( 0, 1, 0.5 );
		raycastMeshes.push( wrenchkey.getRaycastMesh() );

		scene.add( wrenchkey.mesh );

		// zahnrad
		var mesh = preloaded.zahnrad.mesh.clone();

		// scale collision box
		mesh.scale.set( 0.8, 0.8, 0.8 );
		var zahnrad = new Item( mesh );
		zahnrad.name = "Zahnrad"

		zahnrad.mesh.position.set( -2.5, 2, 0 );
		zahnrad.mesh.rotation.set( Math.PI / 2, 0, 0 );
		raycastMeshes.push( zahnrad.getRaycastMesh() );
		var compoundMesh = zahnrad.physic( 1 );
		scene.add( compoundMesh );

		var itemslot = new Itemslot( zahnrad );
		itemslot.mesh.position.set( 2.5, 1.05, 0 );
		// itemslot.mesh.rotation.set( Math.PI / 2, 0, 0 );
		raycastMeshes.push( itemslot.getRaycastMesh() );
		scene.add( itemslot.mesh );

		// key
		var mesh = preloaded.key.mesh;

		var key = new Item( mesh );
		raycastMeshes.push( key.getRaycastMesh() );

		key.name = "Zauberschlüssel"

		// mesh.scale.set( 0.1, 0.1, 0.1 );
		// key.mesh.position.set( 0.0, 1.3, -0.9 );
		key.mesh.position.set( 0.0, 1.3, -0.9 );
		// key.mesh.rotation.set( 0, Math.PI / 2, Math.PI / 2 );
		key.mesh.rotation.set( 0, -2.6, 0 );

		/*
		var folder = debugGUI.getFolder( "Item" );
		folder.add( key.mesh.position, "x" ).min( -3 ).max( 3 );
		folder.add( key.mesh.position, "y" ).min( -3 ).max( 3 );
		folder.add( key.mesh.position, "z" ).min( -3 ).max( 3 );		

		folder.add( key.mesh.rotation, "x" ).min( -Math.PI ).max( Math.PI );
		folder.add( key.mesh.rotation, "y" ).min( -Math.PI ).max( Math.PI );
		folder.add( key.mesh.rotation, "z" ).min( -Math.PI ).max( Math.PI );
		*/

		scene.add( key.mesh );
		// key.physic( 2 );

		// buch
		var mesh = preloaded.buch.mesh;
		var buch = new Item( mesh.clone() );
		// buch.mesh.position.set( 0, 1, 0 );
		raycastMeshes.push( buch.getRaycastMesh() );

		buch.name = "Book"
		// scene.add( buch.mesh );
		buch.mesh.position.set( 0, 5, 0 );
		var compoundMesh = buch.physic( 2 );
		scene.add( compoundMesh );

		var spawn = {
			scale: 5,
			book: function() {

				var mesh = preloaded.buch.mesh;
				mesh.material = preloaded.buch.mesh.material.clone();

				var buch = new Item( mesh.clone() );
				// raycastMeshes.push( buch.getRaycastMesh() );
				buch.mesh.position.set( 0, 5, 0 );
				buch.name = "Book"

				var compoundMesh = buch.physic( this.scale );
				scene.add( compoundMesh );

				raycastArray.push( buch.getRaycastMesh() );

			}
		}

		// buch.physic( spawn.scale );
		var folder = debugGUI.getFolder( "Debug Menu" );
		folder.add( spawn, "scale" ).min( 0.5 ).max( 10 ).step( 0.5 );
		folder.add( spawn, "book" ).name("spawn book");


		// darkkey
		// var mesh = preloaded.darkkey.mesh;

		// var darkkey = new Item( mesh );
		// raycastMeshes.push( darkkey.getRaycastMesh() );

		// darkkey.name = "darkkey"

		// // mesh.scale.set( 0.1, 0.1, 0.1 );
		// darkkey.mesh.position.set( -0.8, 1, -0.8 );
		// darkkey.mesh.rotation.set( 0, Math.PI / 2, Math.PI / 2 );

		// scene.add( darkkey.mesh );

		// concat loses context
		// http://stackoverflow.com/questions/16679565/why-cant-i-concat-an-array-reference-in-javascript
		raycastArray.push.apply( raycastArray, raycastMeshes );

		// or do this
		// for ( var i = 0; i < raycastMeshes.length; i ++ ) {
		// 	raycastArray.push( raycastMeshes[ i ] );
		// }

		return itemslot;

	}

	// initItems.prototype.getRaycastMeshes = function() {
	// 	return raycastMeshes;
	// }

	return initItems;

});