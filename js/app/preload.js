/**
 * Preload
 */

 // If listener is included before initialization of programm
 // sounds cannot be referenced and dont play!

define([ 
    "three", 
    "loadingManager",
    "scene",
    "debugGUI"
], function ( THREE, loadingManager, scene, debugGUI ) {

    'use strict';

    var objects = {};
    var items = {};
    var house = {};
    objects.items = items;
    objects.house = house;

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

        /*
        jsonLoader.load( 'assets/models/house/house.js', function ( geometry, materials ) {  
            // var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );

            // flat shading has been removed from mesh lambert material
            // hack
            // geometry.computeFaceNormals(); // if it does not have them

            // for ( var i = 0; i < geometry.faces.length; i ++ ) {

            //     geometry.faces[ i ].vertexNormals = []; // remove vertex normals

            // }

            // geometry = new THREE.BufferGeometry().fromGeometry( geometry ); // will use face normals, since vertex normals are not present
            

            var array = [];
            var sampleMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
            sampleMat.color.setHex( '0x'+Math.floor(Math.random()*16777215).toString(16) );
            var glassMaterial = sampleMat.clone(); glassMaterial.visible = false;
            // var glassMaterial = new THREE.MeshPhongMaterial({ opacity: true, transparent: 0.1 } );
            // var doorframesMaterial = new THREE.MeshPhongMaterial({ color: 0x89491d } );
            var doorframesMaterial = sampleMat.clone(); doorframesMaterial.color.setHex( 0x89491d );
            var flatShaded = new THREE.MeshPhongMaterial({ color: 0x000000, shading: THREE.FlatShading } );
            flatShaded.color.setHex( '0x'+Math.floor(Math.random()*16777215).toString(16) );

            var folder = debugGUI.getFolder("House");
            folder.add( sampleMat, "wireframe" );

            for ( var i = 0; i < 206; i ++ ) {

                var test = sampleMat;
                // var test = sampleMat.clone();
                // test.color.setHex( '0x'+Math.floor(Math.random()*16777215).toString(16) );
                // setTimeout( function() { console.log( test.color ); }, 10000 );
                array.push( test );
            }


            for ( var i = materials.length - 1; i >= 0 ; i -- ) {
                var material = materials[ i ]; 

                if( material.name.indexOf("gras") !== -1 ||
                    material.name.indexOf("wand_stein") !== -1 ||
                    material.name.indexOf("hoehlenwand") !== -1 ||
                    material.name.indexOf("wand") !== -1 ||
                    // material.name.indexOf("metal_doorhandle") !== -1 ||
                    material.name.indexOf("metal_zaun") !== -1 ||
                    material.name.indexOf("wand_keller") !== -1 ||
                    material.name.indexOf("wood_doors") !== -1
                    ){ 
                    // var wand = array[ i ].clone();
                    // wand.shading = THREE.FlatShading;
                    // wand.wireframe = true;
                    array[ i ] = flatShaded;
                }

                if ( material.name.indexOf("wand_gang_smooth") !== -1 ||
                     material.name.indexOf("aussenwand_einleibung") !== -1
                     ) {

                    array[ i ] = sampleMat;

                }
                //         material.shading = THREE.SmoothShading;  

                //     }
                // else {
                //         material.shading = THREE.FlatShading; 
                // }

                
                if ( material.name.indexOf("fensterglas") >= 0) {
                    // console.log( material );
                    array[ i ] = glassMaterial;

                    // setTimeout( function() { console.log( "mat", material ); }, 10000 );
                }
                else if ( material.name.indexOf("wood_doors") >= 0 ) {

                    array[ i ] = doorframesMaterial;
                }

            }
            // var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }) );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( array ) );
            folder.add( mesh, "visible" );

            // mesh.scale.set( 1, 1, 1 );
            mesh.position.set( 0, 0, -15 );
            // mesh.position.set( 50, 0, -100 );
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            house.house = mesh;
            // scene.add(mesh);
            // setTimeout( function() { console.log( "house", mesh, "material", materials.length ); }, 10000 );

        } );
        
        jsonLoader.load( 'assets/models/interior/home_interior_a.js', function ( geometry, materials ) {  
            geometry.translate( 0, 0, -15 );
            // var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }) );
            // mesh.scale.set( 1, 1, 1 );
            // mesh.position.set( 50, 0, -100 );
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            house.interior_a = mesh;
            var folder = debugGUI.getFolder("House");
            folder.add( mesh, "visible" );
            // scene.add(mesh);

            // setTimeout( function() { console.log( "interior a", mesh ); }, 10000 );
            
        } );        
        jsonLoader.load( 'assets/models/interior/home_interior_b.js', function ( geometry, materials ) {  
            geometry.translate( 0, 0, -15 );
            // var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }) );
            // mesh.scale.set( 1, 1, 1 );
            // mesh.position.set( 50, 0, -100 );
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            house.interior_b = mesh;
            var folder = debugGUI.getFolder("House");
            folder.add( mesh, "visible" );
            // scene.add(mesh);

            // setTimeout( function() { console.log( "interior b", mesh ); }, 10000 );
            
        } );


        jsonLoader.load("assets/models/gelaender.js", function callback(geometry, materials) {

            geometry.translate( 0, 0, -15 );
            var gel = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));
            //for ( i = gel.material.materials.length - 1; i >= 0 ; i -- ) {
            //  obj = gel.material.materials[ i ];          
            //  obj.shading= THREE.SmoothShading;
            //}

            gel.matrixAutoUpdate = false;
            gel.updateMatrix();

            scene.add(gel);

        });
        */

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