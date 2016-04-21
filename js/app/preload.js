/**
 * Preload
 */

 // If listener is included before initialization of programm
 // sounds cannot be referenced and dont play!

define([ 
    "three", 
    "loadingManager",
    "scene"
], function ( THREE, loadingManager, scene ) {

    'use strict';

    var objects = {};
    var items = {};
    objects.items = items;

    var jsonLoader = new THREE.JSONLoader( loadingManager );

    jsonLoader.onError = function( error ) {
        console.error( error );
    }

    // objects.sicherungskasten = loadSicherungskasten;

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
    
    var textureLoader = new THREE.TextureLoader( loadingManager );

    function start () {


        function onError( xhr ) {
            console.log( "error", xhr );
        }

        function onProgress() {

        }


        // barrel_02
        var directoryPath = "assets/models/";
        var name = "flashlight";        

        var mtlLoader = new THREE.MTLLoader( loadingManager );
        var url = directoryPath + name + "/";
        mtlLoader.setBaseUrl( url );
        mtlLoader.setPath( url );

        mtlLoader.load( name + ".mtl", function( materials ) {
            var directoryPath = "assets/models/";
            var name = "flashlight";
            var url = directoryPath + name + "/";

            materials.preload();

            var objLoader = new THREE.OBJLoader( loadingManager );
            objLoader.setMaterials( materials );
            objLoader.setPath( url );
            objLoader.load( name + ".obj", function ( object ) {
                
                // console.log( object );

                items.flashlight = object;
                // scene.add( object );

                /*
                var object = object.children[ 0 ];
                var material = object.material;
                // object.scale.set( 0.5,0.5,0.5 ); 
                // console.log( "barrel", object );

                // object.material.map.anisotropy = 8;
                object.castShadow = true;

                var url = directoryPath + name + "/" + name + "_N.jpg";
                var normalMap = textureLoader.load( url );
                material.normalMap = normalMap;
                // material.normalScale.set ( 1, 1 );

                scene.add( object );
                
                if ( physics !== undefined ) {
                    var mesh = physics.getProxyMesh( object, "Cylinder" );
                    mesh.position.set( 0, mesh.geometry.parameters.height / 2 + 1.5, 0 );
                    // mesh.rotation.z = Math.PI / 1.5;
                    physics.meshToBody( mesh, 2 );
                    scene.add( mesh );
                }

                // this.sceneObjects.add( mesh );
                // this.barrel_02 = mesh;
                spawnObject = mesh.clone();
                */

            }, onProgress, onError );

        });

        var url = "assets/models/buch/buch.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            // var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
            // mesh.position.set( 0, boundingBoxSize.y / 2, 0 );

            var buch = { meshes: {} };
            buch.mesh = mesh;
            items.buch = buch;

        } );

        var url = "assets/models/keller/keller_gear.js";
        jsonLoader.load( url, function callback(geometry, materials) {

            // var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            var mesh = new THREE.Mesh( geometry, materials[ 0 ] );
            geometry.scale( 0.6, 0.6, 0.6 );

            var zahnrad = {};
            zahnrad.mesh = mesh;
            items.zahnrad = zahnrad;

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


        /*
        while ( manifest.length > 0 ) 
        {

            var item = manifest.shift();
            textures[ item.id ] = textureLoader.load( item.src );

        }
        */

        return objects;

    };

    return start;

    // MODEL

});