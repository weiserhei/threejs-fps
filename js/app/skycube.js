/**
 * Skycube
 */
define(["three", "camera", "renderer"], function ( THREE, camera, renderer ){

    // 'use strict';
    /*
	var skyCube = (function SkyCube() {

		var sceneCube = new THREE.Scene();
		var cameraCube = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
		sceneCube.add( cameraCube );

		var shader = THREE.ShaderLib[ "cube" ];

		var material = new THREE.ShaderMaterial( {

			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide,

		} );

		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), material );
		sceneCube.add( mesh );

		return {
			mesh: mesh,
			update: function( scene, camera ) {
				cameraCube.quaternion.copy( camera.quaternion );
				renderer.render( sceneCube, cameraCube );
			}
		};
	})();
	*/

	var cubeTextureLoader = new THREE.CubeTextureLoader();

	// cubeTextureLoader.setPath( "assets/textures/cube/SwedishRoyalCastle/" );
	// var sunnySkyCube = cubeTextureLoader.load( [
	// 	"px.jpg", "nx.jpg",
	// 	"py.jpg", "ny.jpg",
	// 	"pz.jpg", "nz.jpg"
	// ] );

	cubeTextureLoader.setPath( "assets/textures/cube/sunnysky/" );
	var sunnySkyCube = cubeTextureLoader.load( [
		"px.jpg", "nx.jpg",
		"py.jpg", "ny.jpg",
		"pz.jpg", "nz.jpg"
	] );

	var textureLoader = new THREE.TextureLoader();

	var envpath = "assets/textures/";

	// var textureName = 'cubereflection.png';
	// var textureName = '07.jpg';
	// var textureName = '2000_1000.jpg';
	// var textureName = 'panoramamic.jpg';
	var textureName = 'sky01_hdri_3d_model_3ds_c51df0de-d928-4fb4-ae30-df1001794eaa.jpg';
	// var textureName = 'StBp.jpg'; // cathedral
	// var textureName = 'Red-DH-StuAtm-1.jpg';
	// var textureName = 'ScanRoom_06_Thumbnail.jpg';
	// var textureName = 'Helvellyn_Striding_Edge_360_Panorama,_Lake_District_-_June_09_s.jpg';
	// var textureName = 'delta_2k.jpg';
	// var textureName = '120317-old-boys-school-360-081.jpg';
	// var textureName = "metal.jpg";

	var singleMap = textureLoader.load( envpath + textureName );
	singleMap.mapping = THREE.EquirectangularReflectionMapping; // make single image use as cubemap
	// singleMap.mapping = THREE.SphericalReflectionMapping;
	// singleMap.repeat.set( 0.5, 1 );

	var sceneCube = new THREE.Scene();
	var fov = camera.fov;
	cameraCube = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1000 );
	sceneCube.add( cameraCube );

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
	// var mesh = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), material );
	sceneCube.add( mesh );

	var callback = function(){

        var width = window.innerWidth;
        var height = window.innerHeight;
        
        // update the cube camera
        cameraCube.aspect = width / height;
        cameraCube.updateProjectionMatrix();
    
    }

    window.addEventListener( 'resize', callback, false );

	return {
		mesh: mesh,
		update: function( camera, renderer ) {

			cameraCube.quaternion.copy( camera.getWorldQuaternion() );
			renderer.render( sceneCube, cameraCube );
		}
	};

});