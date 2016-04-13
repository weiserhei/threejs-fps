/**
 * Create Crosshair geometry
 * and add to camera
 *
 * TODO
 * should be seperate render pass
 * to render always in front
 */

define([
       "three",
       ], function ( THREE ) {

    function Crosshair( size, padding, camera ) {

	    var size = 0.003;
	    var padding = 0.002;

		// MATERIAL
	    var material = new THREE.LineBasicMaterial({
	        // color: 0xffffff
	        // color: 0xAAAAff //hellblau
	        color: 0xAAFFAA
	        // color: 0xFF0000
	    });

	    // GEOMETRY
	    var geometry = new THREE.Geometry();
	    var geometry2 = new THREE.Geometry();
	    var geometry3 = new THREE.Geometry();
	    var geometry4 = new THREE.Geometry();

	  	// // cross
	    // geometry.vertices.push(new THREE.Vector3(0, y, 0));
	    // geometry.vertices.push(new THREE.Vector3(0, -y, 0));
	    // geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	    // geometry.vertices.push(new THREE.Vector3(x, 0, 0));    
	    // geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

		// var transformation = new THREE.Matrix4().makeTranslation( 0, 0, 0 ).makeRotationZ( Math.PI );

	    // // closed triangle
	    // geometry.vertices.push(new THREE.Vector3(-0.03, 0, 0));
	    // geometry.vertices.push(new THREE.Vector3(0, 0.03, 0));
	    // geometry.vertices.push(new THREE.Vector3(0.03, 0, 0));    
	    // geometry.vertices.push(new THREE.Vector3(-0.03, 0, 0));

	    // open crosshair
	    geometry.vertices.push(new THREE.Vector3(0, size + padding, 0));
	    geometry.vertices.push(new THREE.Vector3(0, padding, 0));

	    geometry2 = geometry.clone();
	    geometry2.rotateZ( Math.PI );

	    geometry3 = geometry.clone();
	    geometry3.rotateZ( - Math.PI / 2 );

	    geometry4 = geometry.clone();
	    geometry4.rotateZ( Math.PI / 2 );

	    var line = new THREE.Line( geometry, material );
	    var line2 = new THREE.Line( geometry2, material );
	    var line3 = new THREE.Line( geometry3, material );
	    var line4 = new THREE.Line( geometry4, material );

	    line.add( line2 );
	    line.add( line3 );
	    line.add( line4 );

	    // POSITION
	    var crosshairPercentX = 50;
		var crosshairPercentY = 50;
		var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
		var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
	    // geometry.computeBoundingBox();
		// var crosshairPositionY = -geometry.boundingBox.max.y / 2;
		line.position.x = crosshairPositionX * camera.aspect;
		line.position.y = crosshairPositionY;
		line.position.z = -0.2;

		// var geometry = new THREE.BufferGeometry();
		// create a simple square shape. We duplicate the top left and bottom right
		// vertices because each vertex needs to appear once per triangle. 

		// var x = 0.05;
		// var y = 0.05;

		// var vertexPositions = [ 
		// 	// bottom right side
		// 	[-x, -x,  x ],
		// 	[ x, -x,  x ],
		// 	[ x,  x,  x ],

		// 	// top left
		// 	[ y,  y,  y ],
		// 	[-y,  y,  y ],
		// 	[-y, -y,  y ]
		// ];
		// var vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

		// // components of the position vector for each vertex are stored
		// // contiguously in the buffer.
		// for ( var i = 0; i < vertexPositions.length; i++ )
		// {
		// 	vertices[ i*3 + 0 ] = vertexPositions[i][0];
		// 	vertices[ i*3 + 1 ] = vertexPositions[i][1];
		// 	vertices[ i*3 + 2 ] = vertexPositions[i][2];
		// }

		// // itemSize = 3 because there are 3 values (components) per vertex
		// geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		// var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		// var mesh = new THREE.Mesh( geometry, material );

		// mesh.position.x = crosshairPositionX * camera.aspect;
		// mesh.position.y = crosshairPositionY;
		// mesh.position.z = -0.3;
		camera.add( line );

		return line

	}

    return Crosshair;
});