/**
 * Minimap
 */
define(["three", "camera", "renderer"], function ( THREE, camera, renderer ){

    'use strict';

	var sceneCube = new THREE.Scene();
	var fov = camera.fov;
	// var cameraCube = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1000 );
	// sceneCube.add( cameraCube );

	var screenCamera = new THREE.OrthographicCamera( 
		window.innerWidth  / -2, window.innerWidth  /  2, 
		window.innerHeight /  2, window.innerHeight / -2, 
		-1000, 1000 );
	// screenCamera.position.z = 1;

	sceneCube.add( screenCamera );

	/*
	var shader = THREE.ShaderLib[ "cube" ];

	var material = new THREE.ShaderMaterial( {

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide,
		// wireframe: true,

	} );

	// material.uniforms[ "tCube" ].value = singleMap;
	material.uniforms[ "tCube" ].value = sunnySkyCube;
	renderer.autoClear = false;

	// var material = new THREE.MeshBasicMaterial( { map: singleMap, side: THREE.BackSide, depthWrite: false } );
	// shaderMaterial does work with a sphereGeometry and CubeGeometry
	var mesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 10, 32, 32 ), material );
	*/

	var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

	var material = new THREE.MeshBasicMaterial( {map: bufferTexture });
	// var videoMesh = new THREE.Mesh( new THREE.BoxGeometry( 1, 0.5, 1 ), material );
	var videoMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.5, 0.25 ), material );
	videoMesh.position.set( -0.5, -0.2, -1 );
	camera.add( videoMesh );

	// screenCamera.position.set( 0, 5, 0 );

	// var plane = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1), new THREE.MeshNormalMaterial() );
	// sceneCube.add( plane );
	var al = new THREE.AmbientLight( 0x999999 );
	sceneCube.add( al );

	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 10, 16, 16 ), new THREE.MeshNormalMaterial() );
	sceneCube.add( sphere );

	var callback = function(){

        var width = window.innerWidth;
        var height = window.innerHeight;
        
        // update the cube camera
        screenCamera.aspect = width / height;
        screenCamera.updateProjectionMatrix();
    
    }

    window.addEventListener( 'resize', callback, false );

	return {
		update: function( camera, renderer ) {

			screenCamera.position.copy( camera.getWorldPosition() );
			// cameraCube.quaternion.copy( camera.getWorldQuaternion() );
			renderer.render( sceneCube, screenCamera, bufferTexture );
			// renderer.render( sceneCube, cameraCube );

		}
	};

});