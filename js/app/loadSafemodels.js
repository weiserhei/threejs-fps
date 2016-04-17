/**
 * Preload
 */

define([ 
	"three", 
	"loadingManager" 
], function ( THREE, loadingManager ) {

	var jsonLoader = new THREE.JSONLoader( loadingManager );

	// safe
	var safe = { meshes: {} };

	//safe
	// var url = "assets/models/safe/safe_joined.js";
	// safeloader.load( url, function callback(geometry, materials) {
	//     // safedoor = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
	// safedoor.material.materials[ 2 ].shading = THREE.FlatShading;
	// }, onLoad, onProgress, onError );

	// safe base
	var url = "assets/models/safe/safe.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		geometry.computeBoundingBox();
		geometry.center();
		var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
		// geometry.translate( xoffset, boundingBoxSize.y / 2, zoffset );

		// for ( var i = 0; i < materials.length; i ++ ) {
		// var material = materials[ i ];
		// console.log( material );
		// material.shading = THREE.FlatShading;
		// }

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		mesh.position.set( 0, boundingBoxSize.y / 2, 0 );
		safe.meshes.safebase = mesh;

	} );

	// // safe middle door
	// var url = "assets/models/safe/safe_middle_door.js";
	// jsonLoader.load( url, function callback(geometry, materials) {

	// 	// geometry.center();
	// 	geometry.computeBoundingBox();
	// 	// var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
	// 	// geometry.translate( 0, 0, - boundingBoxSize.z / 2 );

	// 	var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
	// 	// mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

	// 	safe.meshes.safemiddledoor = mesh;

	// });

	// safe door
	var url = "assets/models/safe/safe_great_door.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		geometry.center();
		geometry.computeBoundingBox();
		var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
		geometry.translate( 0, 0, - boundingBoxSize.z / 2 );

		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

		safe.meshes.safedoor = mesh;

	});

	// big wheel
	var url = "assets/models/safe/safe_wheel.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		// geometry.center();
		// geometry.translate( -0.531 + xoffset, 0.681 + 0.25, 0.106 + zoffset );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		mesh.position.set( - 0.106, 0.38, -0.545 );

		safe.meshes.safewheel = mesh;

	} ); 

	// griff
	var url = "assets/models/safe/safe_griff.js";
	jsonLoader.load( url, function callback(geometry, materials) {

		// geometry.translate( -0.8216, 1.2544 + 0.25, 0.04 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		mesh.position.set( - 0.04, 0.975, -0.835 );

		safe.meshes.safegriff = mesh;

	});

	return safe;

});