/**
* Interaction Box
* used by items and interaction elements
* box to raycast at
* 
*/

define([
	"three"
], function ( THREE ) {
	
	function InteractionBox( mesh, upscale ) {

		// bounding box for raycasting
		// scale up for easy access
		// http://www.calculator.net/fraction-calculator.html?c2d1=1.8&ctype=2&x=0&y=0
		mesh.updateMatrixWorld();
		var upscale = upscale || 1.3;
		mesh.scale.multiplyScalar( upscale / 1 );
		var bbox = new THREE.BoundingBoxHelper( mesh );
		bbox.update();
		mesh.scale.multiplyScalar( 1 / upscale );
		// bbox.scale.set( 1.5, 1.5, 1.5 );
		// this.mesh.position.set( 0, 0, 0 );
		// bbox.position.set( - 0.02, 0.40, -0.54 );
		bbox.material.visible = false;
		// bbox.position.set( 0, 0, 0 );
		// bbox.rotation.copy( safeGroup.rotation );
		// scene.add ( bbox );
		mesh.add ( bbox );

		return bbox;
	};

	return InteractionBox;

});