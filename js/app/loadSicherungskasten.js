/**
 * Preload
 */

define([ 
	"three", 
	"loadingManager" 
], function ( THREE, loadingManager ) {

	var jsonLoader = new THREE.JSONLoader( loadingManager );

	// safe
	var sicherungskasten = { meshes: {} };

	// sicherung
	// var url = "assets/models/sicherungskasten/sicherung.js";
	// jsonLoader.load( url, function callback(geometry, materials) {

	// 	// geometry.computeBoundingBox();
	// 	// geometry.center();
	// 	// var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
	// 	// geometry.translate( xoffset, boundingBoxSize.y / 2, zoffset );

	// 	// for ( var i = 0; i < materials.length; i ++ ) {
	// 	// var material = materials[ i ];
	// 	// console.log( material );
	// 	// material.shading = THREE.FlatShading;
	// 	// }

	// 	// var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
	// 	var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
	// 	// mesh.position.set( 0, boundingBoxSize.y / 2, 0 );
	// 	sicherungskasten.meshes.sicherung = mesh;

	// } );

	// sicherung schalter
	var url = "assets/models/sicherungskasten/sicherung_schalter.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		geometry.center();
		geometry.computeBoundingBox();
		var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
		geometry.translate( 0, boundingBoxSize.y / 4, 0 );

		// var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
		mesh.position.set( 0, 0, 0.16 );

		sicherungskasten.meshes.schalter = mesh;

	});

	// sicherungskasten
	var url = "assets/models/sicherungskasten/sicherung_schrank.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		geometry.center();
		// geometry.translate( -0.531 + xoffset, 0.681 + 0.25, 0.106 + zoffset );
		// var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
		// mesh.position.set( - 0.106, 0.38, -0.545 );

		sicherungskasten.meshes.schrank = mesh;

	} ); 

	// kasten türe
	var url = "assets/models/sicherungskasten/sicherung_tür.js";
	jsonLoader.load( url, function callback(geometry, materials) {
		geometry.center();
		geometry.computeBoundingBox();
		var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
		console.log( boundingBoxSize );
		var translateZ = boundingBoxSize.z / 2;
		geometry.translate( 0, 0, - translateZ );

		// geometry.translate( -0.8216, 1.2544 + 0.25, 0.04 );
		// var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
		// mesh.position.set( 0, 0, - 0.3 );

		var translateX = - 0.1;
		mesh.position.set( translateX, 0, - translateZ );

		sicherungskasten.meshes.tuere = mesh;

	});

	return sicherungskasten;

});