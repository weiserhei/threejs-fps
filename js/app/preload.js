/**
 * Preload
 */

 // If listener is included before initialization of programm
 // sounds cannot be referenced and dont play!

define([ 
    "three", 
    "loadingManager",
    "scene",
    "debugGUI",
    "physics"
], function ( THREE, loadingManager, scene, debugGUI, physics ) {

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
        
        function loadHouse2 ( jsonLoader ) {

            function collisionMeshes() {

                var staticGeometry = new THREE.Geometry();
                physics.makeStaticBox(new THREE.Vector3(6.5,1,0.2), new THREE.Vector3(-5,0,-4.8), undefined, staticGeometry ); //rechts links neben eingangstüre
                physics.makeStaticBox(new THREE.Vector3(6.5,1,0.2), new THREE.Vector3(5,0,-4.8), undefined, staticGeometry ); //
                physics.makeStaticBox(new THREE.Vector3(0.2,1,6), new THREE.Vector3(-8.2,0,-8), undefined, staticGeometry ); // rechts links lange seiten
                physics.makeStaticBox(new THREE.Vector3(0.2,1,6), new THREE.Vector3(8.2,0,-8), undefined, staticGeometry ); //
                physics.makeStaticBox(new THREE.Vector3(6,1, 0.2), new THREE.Vector3(-5,0,-13.8), undefined, staticGeometry ); // rechts links vor treppe
                physics.makeStaticBox(new THREE.Vector3(6,1, 0.2), new THREE.Vector3(5,0,-13.8), undefined, staticGeometry );
                // var stairsMaterial = new THREE.MeshPhongMaterial();
                var stairsMaterial = new THREE.MeshPhongMaterial( {wireframe:true, depthTest:false, depthWrite:false } )

                folder.add( stairsMaterial, "visible" ).name( "Kollisionsgeometry sichtbar" );

                // var mesh = new THREE.Mesh( staticGeometry, new THREE.MeshFaceMaterial( [stairsMaterial] ) );
                var mesh = new THREE.Mesh( staticGeometry, stairsMaterial );
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                scene.add( mesh );

                // STAIRS   
                var size = new THREE.Vector3( 4, 0.5, 3.5 );
                var bufferStairGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);

                var rotateX = Math.PI / 6.5;
                // bufferStairGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( rotateX ) );

                var stairs = new THREE.Mesh( bufferStairGeometry, stairsMaterial );
                stairs.position.set( -3.3, 0.4, -15.5 );
                // stairs.rotation.set( 0, 90 * Math.PI/180, 0 );
                // stairs.rotation.set( 0, 0, - Math.PI / 6.5 );
                stairs.rotation.set( 0, 0, -Math.PI / 9.2 );
                // stairs.quaternion.set( -Math.PI / 1.05, 0, 0, 1 );
                stairs.matrixAutoUpdate = false;
                stairs.updateMatrix();
                // stairs.rotation.set( Math.PI/5.5, 0, 0);
                // quat rotation: Y, X, Z

                scene.add( stairs );

                physics.makeStaticBox ( size, stairs.position, stairs.rotation );


                // STAIRS 2ND LEVEL
                var size = new THREE.Vector3( 3, 0.3, 3 );
                var bufferStairGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);

                // var rotateX = Math.PI / 5.6;
                // bufferStairGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( rotateX ) );

                var stairs = new THREE.Mesh( bufferStairGeometry, stairsMaterial );
                stairs.position.set( -6.4, 2.1,-18.5 );
                stairs.rotation.set( 0, 0 * Math.PI/180, 0 );
                // stairs.rotation.set( Math.PI/5.5, 0, 0);
                // quat rotation: Y, X, Z

                scene.add( stairs );
                stairs.matrixAutoUpdate = false;
                stairs.updateMatrix();

                physics.makeStaticBox ( size, stairs.position, stairs.rotation );


                // STAIRS 3rd LEVEL
                var size = new THREE.Vector3( 3, 0.3, 3.3 );
                var bufferStairGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);

                // var rotateX = Math.PI / 6.5;
                bufferStairGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( rotateX ) );

                var stairs = new THREE.Mesh( bufferStairGeometry, stairsMaterial );
                stairs.position.set( -3.4, 3.6,-21.5 );
                stairs.rotation.set( 0, -90 * Math.PI/180, 0 );
                // stairs.rotation.set( Math.PI/5.5, 0, 0);
                // quat rotation: Y, X, Z
                stairs.matrixAutoUpdate = false;
                stairs.updateMatrix();
                scene.add( stairs );

                physics.makeStaticBox ( size, stairs.position, stairs.rotation );


                // STAIRS PLATEAU
                var size = new THREE.Vector3( 3.2, 0.3, 3.2 );
                var bufferPlateauGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                var plateau = new THREE.Mesh( bufferPlateauGeometry, stairsMaterial );

                plateau.position.set( -6.4, 1.3,-16 );
                plateau.matrixAutoUpdate = false;
                plateau.updateMatrix();
                scene.add( plateau );

                physics.makeStaticBox ( size, plateau.position, plateau.rotation );

                // STAIRS 2ND PLATEAU
                var size = new THREE.Vector3( 3.2, 0.3, 3.4 );
                var bufferPlateauGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
                var plateau = new THREE.Mesh( bufferPlateauGeometry, stairsMaterial );

                plateau.position.set( -6.4, 2.8,-21.5 );
                plateau.matrixAutoUpdate = false;
                plateau.updateMatrix();
                scene.add( plateau );

                physics.makeStaticBox ( size, plateau.position, plateau.rotation );

                
                // STAIRS 3RD PLATEAU
                var size = new THREE.Vector3( 4, 0.3, 16 );
                var bufferPlateauGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
                var plateau = new THREE.Mesh( bufferPlateauGeometry, stairsMaterial );

                plateau.position.set( -0, 4.3, -27.5 );
                plateau.matrixAutoUpdate = false;
                plateau.updateMatrix();
                scene.add( plateau );

                physics.makeStaticBox ( size, plateau.position, plateau.rotation );
                
            }

            function modifyMaterial( materials ) {

                var array = [];
                var sampleMat = new THREE.MeshLambertMaterial({ color: 0x000000 });
                sampleMat.color.setHex( '0x'+Math.floor(Math.random()*16777215).toString(16) );
                var glassMaterial = sampleMat.clone(); 
                glassMaterial.visible = false;
                // var glassMaterial = new THREE.MeshPhongMaterial({ opacity: true, transparent: 0.1 } );
                // var doorframesMaterial = new THREE.MeshPhongMaterial({ color: 0x89491d } );
                var doorframesMaterial = sampleMat.clone(); 
                doorframesMaterial.color.setHex( 0x89491d );
                var flatShaded = new THREE.MeshPhongMaterial({ color: 0x000000, shading: THREE.FlatShading } );
                flatShaded.color.setHex( '0x'+Math.floor(Math.random()*16777215).toString(16) );

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

                var mfm = new THREE.MeshFaceMaterial( array )
                return mfm;

            }
                collisionMeshes();

            /*
            jsonLoader.load( 'assets/models/house/house.js', function ( geometry, materials ) {  

                // flat shading has been removed from mesh lambert material
                // hack by: https://github.com/mrdoob/three.js/issues/7305#issuecomment-146296632
                // geometry.computeFaceNormals(); // if it does not have them

                // for ( var i = 0; i < geometry.faces.length; i ++ ) {

                //     geometry.faces[ i ].vertexNormals = []; // remove vertex normals

                // }

                // geometry = new THREE.BufferGeometry().fromGeometry( geometry ); // will use face normals, since vertex normals are not present
                
                geometry.translate( 0, 0, -15 );
                var meshFaceMaterial = modifyMaterial( materials );
                // var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xFFFFFF }) );
                var mesh = new THREE.Mesh( geometry, meshFaceMaterial );
                folder.add( mesh, "visible" );

                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                house.house = mesh;

                collisionMeshes();
                scene.add(mesh);
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
                scene.add(mesh);

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
                scene.add(mesh);

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

            } );

            */

        }

        var o = {
            loadHouse: function() {
                loadHouse2( jsonLoader );
            }
        };

        var folder = debugGUI.getFolder("House");
        folder.open();
        folder.add( o, "loadHouse" );
        

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