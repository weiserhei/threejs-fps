/**
 * Preload
 */

 // If listener is included before initialization of programm
 // sounds cannot be referenced and dont play!

define([ "three", "loadingScreen" ], function ( THREE,loadingScreen ) {

    'use strict';

    var sounds = [];
    var objects = {};
    var items = {};
    objects.items = items;

    // // SOUNDS
    // var sound1 = new THREE.PositionalAudio( listener );
    // sound1.load( 'assets/sounds/safe_door.ogg' );
    // sound1.setRefDistance( 8 );
    // sound1.setVolume( 0.1 );

    // var sound2 = new THREE.PositionalAudio( listener );
    // sound2.load( 'assets/sounds/door.ogg' );
    // sound2.setRefDistance( 8 );
    // sound2.setVolume( 0.1 );

    // var sound3 = new THREE.PositionalAudio( listener );
    // sound3.load( 'assets/sounds/quietsch2.ogg' );
    // sound3.setRefDistance( 8 );
    // sound3.setVolume( 0.1 );

    // safe
    var safe = { meshes: {}, sounds: {} };
    var safewheel, safegriff, safedoor, safebase;

    // safe.sounds.sound1 = sound1;
    // safe.sounds.sound2 = sound2;
    // safe.sounds.sound3 = sound3;

    objects.safe = safe;


    var loadingManager = new THREE.LoadingManager ();

    loadingManager.onProgress = function ( item, loaded, total ) {

        // console.log( item, loaded, total );
        // loadingScreen.setProgress( loaded, total );

    };
	
	loadingManager.onError = function ( url ) {
	
		console.warn( "Loading Error", url );
		
	}


    /*
    var textureLoader = new THREE.TextureLoader( loadingManager );

    var manifest = [
        // 4K
        // {id:"diffusemap",    src:"earth/textures/planets/4k/Color-Map-4k.jpg"}, 
        // { id:"metalnessMap", src:"textures/planets/4k/Spec-Mask-inverted_4k.png" },
        // { id:"specularmap", src:"textures/planets/4k/Spec-Mask_4k.png" },
        { id:"invertedSpecularmap", src:"textures/planets/4k/Spec-Mask-inverted_4k.png" },
        { id:"normalmap",   src:"textures/planets/4k/earth_normalmap_flat_4k.jpg" }, 
        { id:"displacemap", src:"textures/planets/4k/Bump_4k.jpg" }, 
        
    ];

    var imageLoader = new THREE.ImageLoader ( loadingManager );

    var heightImageUrl = "textures/planets/4k/heightmap_1440.jpg";
    */



    // MODEL
    var jsonLoader = new THREE.JSONLoader( loadingManager );

    jsonLoader.onError = function( error ) {
        console.error( error );
    }

    var start = function () {

        //safe
        // var url = "assets/models/safe/safe_joined.js";
        // safeloader.load( url, function callback(geometry, materials) {
        //     // safedoor = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        // safedoor.material.materials[ 2 ].shading = THREE.FlatShading;
        // }, onLoad, onProgress, onError );

        var url = "assets/models/buch/buch.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            // var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
            // mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

            var buch = { meshes: {} };
            buch.mesh = mesh;
            items.buch = buch;

        } );

        // var url = "assets/models/darkkey/darkkey.js";
        // jsonLoader.load( url, function callback(geometry, materials) {

        //     var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        //     // var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
        //     // mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

        //     var darkkey = {};
        //     darkkey.mesh = mesh;
        //     items.darkkey = darkkey;

        // } );

        var url = "assets/models/wrenchkey/wrenchkey.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            geometry.computeBoundingBox();
            var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
            // geometry.translate( xoffset, boundingBoxSize.y / 2, zoffset );

            // for ( var i = 0; i < materials.length; i ++ ) {
                // var material = materials[ i ];
                // console.log( material );
                // material.shading = THREE.FlatShading;
            // }

            // var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
            // mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

            var wrenchkey = {};
            wrenchkey.mesh = mesh;
            items.wrenchkey = wrenchkey;

        } );

        var url = "assets/models/key/key.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            // var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
            // mesh.position.set( 0, boundingBoxSize.y / 2, 0 );
            var key = {};
            key.mesh = mesh;
            items.key = key;

        } );

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

        var url = "assets/models/safe/safe_great_door.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            geometry.center();
            geometry.computeBoundingBox();
            var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
            geometry.translate( 0, 0, - boundingBoxSize.z / 2 );
            // console.log ( boundingBoxSize );

            // for ( var i = 0; i < materials.length; i ++ ) {
            //     var material = materials[ i ];
            //     material.shading = THREE.FlatShading;
            // }

            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

            // safedoor = mesh;
            safe.meshes.safedoor = mesh;

        });     

        // big wheel
        var url = "assets/models/safe/safe_wheel.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            // geometry.center();
            // geometry.translate( -0.531 + xoffset, 0.681 + 0.25, 0.106 + zoffset );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            mesh.position.set( - 0.106, 0.38, -0.545 );

            // safewheel = mesh;
            safe.meshes.safewheel = mesh;

        } ); 

        // griff
        var url = "assets/models/safe/safe_griff.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            // geometry.translate( -0.8216, 1.2544 + 0.25, 0.04 );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            mesh.position.set( - 0.04, 0.975, -0.835 );

            // safegriff = mesh;
            safe.meshes.safegriff = mesh;

        }); 

        /*
        while ( manifest.length > 0 ) 
        {

            var item = manifest.shift();
            textures[ item.id ] = textureLoader.load( item.src );

        }
        */

        return {
        	loadingManager: loadingManager,
        	sounds: sounds,
            objects: objects,
        };

    };

    return start;

});