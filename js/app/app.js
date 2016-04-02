/**
 * Core application handling
 * Initialize Viewer
 */
define([
    "three",
    "TWEEN",
    "scene",
    "camera",
    "renderer",
    "controls",
    "stats",
    "debugGUI",
    "tweenHelper",
    "skycube",
    "lights",
    "physics"
	], function ( 
             THREE, 
             TWEEN, 
             scene, 
             camera, 
             renderer, 
             controls, 
             stats, 
             debugGUI, 
             tweenHelper, 
             skycube,
             lights,
             physics
             ) {
	
	'use strict';

function createRoom ( length, width, height, door ) {

	function clone( samplemesh, cutmesh ) {
		
		// var mesh = samplemesh.clone();
		var mesh = samplemesh;
		
		var width = mesh.geometry.parameters.width;
		var height = mesh.geometry.parameters.height;
		var depth = mesh.geometry.parameters.depth;
		
		var shape = new Goblin.BoxShape( width/2, height/2, depth/2 );
		var mass = 0;
		
		var dynamic_body = new Goblin.RigidBody( shape, mass );

		var position = mesh.getWorldPosition();
		dynamic_body.position.copy( position );

		var rotation = mesh.quaternion;
		dynamic_body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );

		physics.world.addRigidBody( dynamic_body );
		physics.addBody( dynamic_body, mesh );
		
		// var ptr = body.a != undefined ? body.a : body.ptr;
		// _objects_ammo[ptr] = body;
		if( cutmesh ) { 
			// portalBodys.mesh = cutmesh;
			// scene.add( cutmesh ); 
			return cutmesh;
		}
		else { 
			// scene.add ( mesh ); 
			return mesh;
		}
		// boxes.push( trigger1 );
		// return body;
	}

	var that = this;
	
	var room = new THREE.Object3D();

	var floorGeometry = new THREE.PlaneBufferGeometry( width, length );
	floorGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	var floor = new THREE.Mesh( floorGeometry, new THREE.MeshNormalMaterial() );
	floor.receiveShadow = true;
	floor.matrixAutoUpdate = false; // tweak performance on static objects
	room.add( floor );
		
	var wallMaterial = new THREE.MeshNormalMaterial();
	var wallThickness = 0.2;

	var doorWallMesh = new THREE.Mesh( new THREE.BoxGeometry( wallThickness, height, length ) );
	var windowWallMesh = new THREE.Mesh( new THREE.BoxGeometry( width - wallThickness * 2, height, wallThickness ) );
	// windowWallMesh.position.set( 0, height / 2, - length / 2 + wallThickness / 2 ); // vor spieler
	windowWallMesh.position.set( 0, height / 2, length / 2 - wallThickness / 2 ); // hinter spieler
	windowWallMesh.rotation.y = 180 * Math.PI / 180;
	

	var mesh2 = new THREE.Mesh( new THREE.BoxGeometry( wallThickness, height, length ) );
	var mesh3 = new THREE.Mesh( new THREE.BoxGeometry( width - wallThickness * 2, height, wallThickness ) );
	
	// wall opposite door
	mesh2.position.set( - width / 2 + wallThickness / 2, height / 2, 0 );
	// wall right door
	// mesh3.position.set( 0, height / 2, length / 2 - wallThickness / 2 );
	mesh3.position.set( 0, height / 2, - length / 2 + wallThickness / 2 );
	
	// wall left door
	// mesh4.position.set( 0, height / 2, - length / 2 + wallThickness / 2 );	
	
	doorWallMesh.position.set( width / 2 - wallThickness / 2, height / 2, 0 );

	function handleWindows( object, wall ) {
	
		// object.rotation.y = -Math.PI / 1.5;

		object.rotation.y = wall.rotation.y + (-Math.PI / 2);

		// var mat = object.matrix;
		// var rotation = mat.makeRotationZ(wall.rotation.y + (-Math.PI / 2));
		// mat.scale( new THREE.Vector3(0.03,0.02,0.03) );
		// object.applyMatrix(rotation);
		// var mat = object.matrix.makeRotationZ(wall.rotation.y + (-Math.PI / 2));
		// object.applyMatrix( mat );

		// rotateAroundWorldAxis( object, new THREE.Vector3(0, 1, 0), wall.rotation.y + (-Math.PI / 2) );

		// object.position.set( -1.5, -0.05 + (height / 2), 0 - length / 2 + wallThickness / 2 );
		object.position.copy( wall.position );
		object.position.y -= 0.05;
		object.position.x -= 1.5;

		// object.position.set( -1, 1.6, -5.92);

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		// scene.add( helper );
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		var fenster = object.clone();
		fenster.position.set( 0, 0, 0 );
		// fenster2.position.set( 1.5, -0.05 + (height / 2), 0 - length / 2 + wallThickness / 2  );

		var fenster2 = new THREE.Object3D();
		fenster2.add( fenster );
		fenster2.rotation.z = -15 * Math.PI / 180;
		fenster2.position.copy( wall.position );
		fenster2.position.y -= 0.05;
		fenster2.position.x += 1.5;

		// fenster2.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( wall.position.x + 1.5, wall.position.y - 0.05, wall.position.z) );
		
		// scene.add( object );
		// that.models.add( object );
		// that.models.add( fenster2 );
		
		// CSG GEOMETRY
		var cube_bsp = new ThreeBSP( wall );

		// var cutgeo = new THREE.BoxGeometry( width/10, wallThickness*2, length/6 );
		// var cutgeo = new THREE.BoxGeometry( 1.3, 1.55, wallThickness*2 );
		var cutgeo = new THREE.BoxGeometry( boundingBoxSize.x-0.1, boundingBoxSize.y-0.1, boundingBoxSize.z );
		var doublecutgeo = new THREE.Geometry();

		// rotateAroundWorldAxis( object, new THREE.Vector3(0, 1, 0), 180 * (Math.PI / 2) );
		// cutgeo.applyMatrix( new THREE.Matrix4().compose( object.position, object.quaternion, object.scale ) );
		// cutgeo.applyMatrix( new THREE.Matrix4().setRotationFromQuaternion( object.quaternion) );
		// var vec3 = fenster2.getWorldPosition();
		// testMatrix.setPosition( vec3 );
		// cutgeo.applyMatrix( testMatrix );		
		// var euler = new THREE.Euler( 0, 0*Math.PI/180, 0, 'XYZ' );
		// matrix.makeRotationFromEuler( euler );
		// cutgeo.center(); // ohmigawd reset if a matrix has been applied before
		
		// move geometry to where the window is
		// setting rotation first because it resets position!!!
		var matrix = new THREE.Matrix4(); //.makeRotationFromQuaternion( object.quaternion );
		matrix.setPosition( object.position );	
		doublecutgeo.merge( cutgeo, matrix );

		// var matrix = new THREE.Matrix4();
		matrix.makeRotationFromQuaternion( fenster2.quaternion );
		matrix.setPosition( fenster2.position );

		doublecutgeo.merge( cutgeo, matrix );

		var sub =  new THREE.Mesh( doublecutgeo );

		// var x = new THREE.Mesh( doublecutgeo, new THREE.MeshNormalMaterial() );
		// scene.add( x );

		var substract_bsp  = new ThreeBSP( sub );
		var subtract_bsp  = cube_bsp.subtract( substract_bsp );
		
		var result = subtract_bsp.toMesh( 
				// new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('texture.png') }) 
				); 

		result.material.shading = THREE.FlatShading;
		result.material = wallMaterial;
		result.geometry.computeVertexNormals();
		
		result.position.copy( wall.position );
		room.add( object ); 
		room.add( fenster2 );
		// result.add( object );
		// result.add( fenster2 );
		// result.add( test );
		// wall.position.set( 0, height / 2, - length / 2 + wallThickness / 2 );

		wall = clone( wall, transform, result );

		room.add( result );
		// room.add( cutmesh );

		portalMeshes.push ( wall );
		
	}

	/*
	var testloader = new THREE.OBJMTLLoader( manager );
	// testloader.load( obj, mtl, onSuccess, onError );
	// WINDOW
	testloader.load( 'shared/models/window/window.obj', 'shared/models/window/window.mtl', function( object ) {

		// x, y, z (breite)
		object.scale.set( 0.03,0.02,0.03 ); 
		// object.scale.set( 2.35,2.35,2.35 );

		object.children[0].material.side = THREE.DoubleSide;
		object.children[0].material.normalMap = new THREE.ImageUtils.loadTexture("shared/models/window/window_normal.png");
		object.children[0].material.color.setHex( 0xFFFFFF );
		object.children[0].material.color.setHSL( 0, 0, 1 );
		
		that.refMat = object.children[0].material;
		
		handleWindows( object, windowWallMesh );

	});
	*/
	/*
	var testloader2 = new THREE.OBJMTLLoader( manager );

	// ARMCHAIR
	testloader2.load( 'shared/models/armchair/armchair.obj', 'shared/models/armchair/armchair.mtl', function ( object ) {
	// loadObject( 'shared/models/armchair/armchair.obj', 'shared/models/armchair/armchair.mtl', function ( object ) {
		// console.log("armchair", object);

		// object.scale.set( 0.7,0.7,0.7 ); 
		object.children[1].scale.set( 0.7,0.7,0.7 ); 
		// object.position.set( 0, 0, 4 );
		var sofa = object.children[1];
		
		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( sofa, 0xff0000 );
		helper.update();
		// scene.add(helper);
		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		// object.rotation.y = 180 * Math.PI / 180;
		
		sofa.material.normalMap = THREE.ImageUtils.loadTexture("shared/models/armchair/armchair_n.png");

		sofa.material.color.setHex( 0xFFFFFF );
		sofa.material.color.setHSL( 0, 0, 1 );
		sofa.material.side = THREE.BackSide;
		// object.children[1].material.normalScale.set ( -1, -1 );

		sofa.castShadow = true;
		
		// makeStaticBox( boundingBoxSize.clone(), object.position, object.rotation );

		// var mesh = new THREE.Mesh( new THREE.BoxGeometry( boundingBoxSize.x , boundingBoxSize.y, boundingBoxSize.z ), new THREE.MeshBasicMaterial( { visible:false, wireframe: true } ) );
		// mesh.position.copy( object.getWorldPosition() );
		// object.children[1].position.y -= boundingBoxSize.y / 2;
		// object.children[1].position.y -= boundingBoxSize.y * 2;
		// mesh.add( object.children[1] );
		
		sofa.geometry.computeBoundingBox();
		var geometryBoundingSize = sofa.geometry.boundingBox.max.sub( sofa.geometry.boundingBox.min );
		
		sofa.geometry.center();
		
		// object.children[1].add( mesh );
		sofa.position.set( 0, boundingBoxSize.y/2, -4 );
		
		// sofa.position.y -= boundingBoxSize.y/2;


		// sofa.position.y -= boundingBoxSize.y / 2;
		// mesh.position.set( 0, 0, 3 );
		// mesh.rotation.y = 0 * Math.PI / 180;
		// gridClone( mesh, 2, true );
		
		// objects.push ( clone );	//for raycast			
		
		// scene.add( object.children[1] );
		// var width = mesh.geometry.parameters.width;
		// var height = mesh.geometry.parameters.height;
		// var depth = mesh.geometry.parameters.depth;
		
		var width = boundingBoxSize.x;
		var height = boundingBoxSize.y;
		var depth = boundingBoxSize.z;

		var shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2 ) );

		var transform = new Ammo.btTransform();
		
		var dB = makeDynamicBox( sofa, shape, transform );
		boxes.push( dB ); // Keep track of this box

		// scene.add( sofa );
		room.add( sofa );
	});

	// Supplies
	loadObject( 'shared/models/Supplies/Supplies.obj', 'shared/models/Supplies/Supplies.mtl', function ( object ) {
		// console.log("supplies", object);
		
		var length = object.children.length;
		for ( var i = 0; i < length; ++ i ) {

			// object.children[ i ].material.color.setHex( 0xAAAAAA );
			object.children[ i ].material.color.setHex( 0xFFFFFF );
			// object.children[ i ].material.color.setRGB( 1, 1, 1 );
			object.children[ i ].material.color.offsetHSL ( 0, 0, 1 );
			object.children[ i ].material.shininess = 10;
			// object.children[ i ].material.specular.setHex( 0x555555 );
			object.children[ i ].castShadow = true;

		}
		
		object.scale.set( 0.045,0.045,0.045 ); 
		// var clone = object.clone();
		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		
		// x + richtung türe
		object.position.set( 3.8, 0, 4.1 );
		object.rotation.y = 170 * Math.PI / 180;
		
		// clone.position.set( 4.3, 0, 3.3 );
		// clone.rotation.y = -90 * Math.PI / 180;
		
		makeStaticBox( boundingBoxSize.clone(), object.position, object.rotation );
		// makeStaticBox( boundingBoxSize.clone(), clone.position, clone.rotation );		
	
		room.add( object );
		// room.add( clone );

		// makeStaticBox( new THREE.Vector3(1.3,1.8,1.1), new THREE.Vector3( -3.7, 0, -4.6 ), undefined , staticGeometry );
		// makeStaticBox( new THREE.Vector3(1.1,1.8,1.3), new THREE.Vector3( -2.9, 0, -3.3 ), undefined, staticGeometry );
		
		// object.children[0].children[1].material.emissive.setRGB ( 0.3, 0.3, 0.3 );
		// object.children[0].children[1].castShadow = true;
		// object.children[2].receiveShadow = true;

		// scene.add( object );
	});

/*
	// jukebox
	loadObject( 'shared/models/jukebox/Jukebox.obj', 'shared/models/jukebox/Jukebox.mtl', function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				console.log("mesh found");
				// child.material.map = T_jukebox;
				child.material.side = THREE.DoubleSide;
				child.material.color.setHSL( 0, 0, 2 );
				child.castShadow = true;

			}

		} );

		// object.position.set( 0, 0, 4 );
		console.log("objloader jukebox", object);

		// object.children[1].add( object.children[0] );
		// var object = object.children[1];
		// object.scale.set( 0.35,0.35,0.35 ); 
		object.children[0].scale.set( 0.35,0.35,0.35 ); 
		object.children[0].scale.set( 0.35,0.35,0.35 ); 
		// object.receiveShadow = true;

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object.children[1], 0xff0000 );
		helper.update();
		// scene.add(helper);
		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		// sofa.geometry.computeBoundingBox();
		// var geometryBoundingSize = sofa.geometry.boundingBox.max.sub( sofa.geometry.boundingBox.min );
		
		object.children[1].geometry.center();
		object.position.set( 0, boundingBoxSize.y/2, -2 );
		
		var width = boundingBoxSize.x;
		var height = boundingBoxSize.y;
		var depth = boundingBoxSize.z;

		var shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2 ) );

		var transform = new Ammo.btTransform();
		
		var dB = makeDynamicBox( object.children[1], shape, transform );
		boxes.push( dB ); // Keep track of this box

		room.add( object );
	});
*/

	function onError() {
		console.log("error");
	}

	function onProgress() {

	}

	var textureLoader = new THREE.TextureLoader();

	var directoryPath = "assets/models/";
	var name = "stairs_stone";

	var mtlLoader = new THREE.MTLLoader();
	var url = directoryPath + name + "/";
	mtlLoader.setBaseUrl( url );
	mtlLoader.setPath( url );

	mtlLoader.load( name + ".mtl", function( materials ) {

	    materials.preload();

	    var objLoader = new THREE.OBJLoader();
	    objLoader.setMaterials( materials );
	    objLoader.setPath( url );
	    objLoader.load( name + ".obj", function ( object ) {
			
			// console.log( object );

			var object = object.children[ 1 ];
			var material = object.material;
			material.map.anisotropy = 16;
			// material.wireframe = true;
			material.transparent = true;
			material.opacity = 0.5;
			object.castShadow = true;
			object.scale.set( 1.3, 2.2, 3 );
			object.position.set( -3.6, 0, -7.7 );

			// var url = directoryPath + name + "/" + name + "_N.jpg";
			// var normalMap = textureLoader.load( url );
			// material.normalMap = normalMap;
			// material.normalScale.set ( 1, 1 );

			room.add( object );

			// STAIRS	
			var size = new THREE.Vector3( 1.25, 0.3, 7 );
			var stairGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);

			var rotateX = - Math.PI / 1.05;
			// var matrix = new THREE.Matrix4().makeRotationX( rotateX );
			// bufferStairGeometry.applyMatrix( matrix );
			
			var stairs = new THREE.Mesh( stairGeometry );
			stairs.position.set( -4.2, 1.2, -0.7 );
			// stairs.rotation.set( Math.PI/5.5, 0, 0);

			room.add( stairs );
			
			// ammojs physics
			size.divideScalar( 2 );
			var stairshape = new Goblin.BoxShape( size.x, size.y, size.z );

			var dynamic_body = new Goblin.RigidBody( stairshape, 0.0 );

			var position = stairs.getWorldPosition();
			dynamic_body.position.copy( position );

			stairs.updateMatrix();

			var rotation = stairs.quaternion;
			dynamic_body.rotation = new Goblin.Quaternion( rotateX, rotation.y, rotation.z, rotation.w );

			physics.world.addRigidBody( dynamic_body );
			physics.addBody( dynamic_body, stairs );


			// STAIRS PLATEAU
			var size = new THREE.Vector3( 1.3, 0.3, 1.3 );
			var plateauGeometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
			var plateau = new THREE.Mesh( plateauGeometry );
		
			plateau.position.set( -4.2, 3.25, -4.1 );

			room.add( plateau );
					
			// ammojs physics
			size.divideScalar( 2 );
			var stairshape = new Goblin.BoxShape( size.x, size.y, size.z );
			var dynamic_body = new Goblin.RigidBody( stairshape, 0.0 );

			var position = plateau.getWorldPosition();
			dynamic_body.position.copy( position );

			// var rotation = plateau.quaternion;
			// dynamic_body.rotation = new Goblin.Quaternion( rotateX, rotation.y, rotation.z, rotation.w );

			physics.world.addRigidBody( dynamic_body );
			physics.addBody( dynamic_body, plateau );

	    });

	});

	function createCeiling( width, wallThickness, depth ) {
	
		var ceiling = new THREE.Mesh( new THREE.BoxGeometry( width, wallThickness, depth ) );

		// CSG GEOMETRY
		var cube_bsp = new ThreeBSP( ceiling );

		var cutgeo = new THREE.BoxGeometry( 1, wallThickness*2, 1 );
		var doublecutgeo = new THREE.Geometry();
		
		// move geometry to where the window is
		// setting rotation first because it resets position!!!
		var matrix = new THREE.Matrix4(); //.makeRotationFromQuaternion( object.quaternion );
		matrix.setPosition( new THREE.Vector3(0, 0, 1.4) );	
		doublecutgeo.merge( cutgeo, matrix );

		// var matrix = new THREE.Matrix4();
		matrix.setPosition( new THREE.Vector3(0, 0, -1.4) );

		doublecutgeo.merge( cutgeo, matrix );

		// stairs cutout
		cutgeo = new THREE.BoxGeometry( 1.2, wallThickness*2, 4 );
		matrix.setPosition( new THREE.Vector3( -4.2, 0, -2) );
		
		doublecutgeo.merge( cutgeo, matrix );

		var sub =  new THREE.Mesh( doublecutgeo );

		var substract_bsp  = new ThreeBSP( sub );
		var subtract_bsp  = cube_bsp.subtract( substract_bsp );

		var result = subtract_bsp.toMesh( 
				// new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('texture.png') }) 
				); 
		result.geometry.computeVertexNormals();

		// result.geometry.mergeVertices();
		
		// result.material.shading = THREE.FlatShading;

		// THREEx.Geometryutils.center(resultGeo);

		ceiling.position.set( 0, height + wallThickness / 2, 0 );
		result.position.copy( ceiling.position );

		var collisionPosition = ceiling.getWorldPosition();
		collisionPosition.x += 1;

		var ceilingCollision = physics.makeStaticBox( new THREE.Vector3(width-1, wallThickness, depth), collisionPosition, ceiling.rotation );

		return result;

	}

	var ceiling = createCeiling( width, wallThickness, length );
	
	ceiling.material = new THREE.MeshNormalMaterial();
	// ceiling.material = this.materialsArray.grainyWhiteMaterial[1];
	doorWallMesh.material = wallMaterial;
	mesh2.material = wallMaterial;
	mesh3.material = wallMaterial;

	mesh2 = clone( mesh2 );
	mesh3 = clone( mesh3 );
	
	function physicalDoor( object ) {
		
		var wallMesh = doorWallMesh;

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();
		// !!!!!!!!!!!!!!!!!!!!UPDATE BEFORE ROTATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// boundingbox width / height values change after rotation
		// scene.add( helper );
		
		var boundingBoxSize = helper.box.max.sub( helper.box.min );
		
		// object.position.set( mesh01.position.x, boundingBoxSize.y / 2, mesh01.position.z );
		// object.position.set( 5.9, boundingBoxSize.y / 2, 2 );
		
		object.position.copy( wallMesh.position );
		// object.position.z += ( wallMesh.geometry.parameters.depth/2 - 6 );

		object.position.y += boundingBoxSize.y / 2 - wallMesh.geometry.parameters.height/2;
		object.rotation.set( 0, 90 * Math.PI / 180, 0 );
		
		// CSG GEOMETRY
		var cube_bsp = new ThreeBSP( wallMesh );

		var cutgeo = new THREE.BoxGeometry( boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z );

		var temp = new THREE.Mesh( cutgeo, new THREE.MeshNormalMaterial() );
		// temp.position.set( mesh01.position.x, boundingBoxSize.y / 2, mesh01.position.z ); //y = height / 2
		temp.position.copy( object.position ); //y = height / 2
		temp.rotation.copy( object.rotation );
		temp.scale.set( 1.00, 1.01, 1.01 );
		temp.updateMatrix();

		var doublecutgeo = new THREE.Geometry();
		doublecutgeo.merge( temp.geometry, temp.matrix );

		var sub =  new THREE.Mesh( doublecutgeo );

		var substract_bsp  = new ThreeBSP( sub );
		var subtract_bsp  = cube_bsp.subtract( substract_bsp );

		var result = subtract_bsp.toMesh( 
				// new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('texture.png') }) 
				// that.materialsArray.grainyWhiteMaterial[1]
				wallMaterial
				// new THREE.MeshNormalMaterial()
				); 
		result.material.shading = THREE.FlatShading;
		result.geometry.computeVertexNormals();
		// scene.add( result );
		room.add( result );

		portalMeshes.push ( result );
		// var width = collisionBox.geometry.parameters.width;
		// var height = collisionBox.geometry.parameters.height;
		// var depth = collisionBox.geometry.parameters.depth;					
		
		var width = boundingBoxSize.x;
		var height = boundingBoxSize.y;
		var depth = boundingBoxSize.z;

		var doorwidth = boundingBoxSize.x + 0.1;
		
		// var dimensionL = new THREE.Vector3( wallMesh.geometry.parameters.width, wallMesh.geometry.parameters.height, (wallMesh.geometry.parameters.depth/2) - doorwidth/2 );
		/* 
		var test = mesh00.geometry.parameters.depth - parentObject.position.z;
		var positionL = new THREE.Vector3().copy( mesh00.position );
		positionL.z -= mesh00.geometry.parameters.depth - test / 2;
		
		var dimensionL = new THREE.Vector3( mesh00.geometry.parameters.width, mesh00.geometry.parameters.height, (mesh00.geometry.parameters.depth - parentObject.position.z - doorwidth/2 ));
		
		var positionR = new THREE.Vector3().copy( mesh00.position );
		positionR.z += mesh00.geometry.parameters.depth - parentObject.position.z / 2;
		var dimensionR = new THREE.Vector3( mesh00.geometry.parameters.width, mesh00.geometry.parameters.height, ( parentObject.position.z - doorwidth/2 ));
		*/

		var wallWidth = wallMesh.geometry.parameters.width;
		var wallHeight = wallMesh.geometry.parameters.height;
		var wallDepth = wallMesh.geometry.parameters.depth;
		
		var dimensionL = new THREE.Vector3( wallWidth, wallHeight, ( wallDepth/2 ) - doorwidth/2 );
		var dimensionR = new THREE.Vector3( wallWidth, wallHeight, ( wallDepth/2 ) - doorwidth/2 );
		
		var positionR = new THREE.Vector3().copy( wallMesh.position );
		positionR.z += ( wallDepth/4 + doorwidth/4 );
		positionR.y -= wallHeight/2;
		
		var positionL = new THREE.Vector3().copy( wallMesh.position );
		positionL.z -= ( wallDepth/4 + doorwidth/4 );
		positionL.y -= wallHeight/2;

		var rotation = wallMesh.rotation;

		physics.makeStaticBox( dimensionR, positionR, rotation );
		physics.makeStaticBox( dimensionL, positionL, rotation );
		
		/*
		var test = new THREE.Mesh( 
			new THREE.BoxGeometry( dimensionR.x, dimensionR.y, dimensionR.z ), 
			new THREE.MeshNormalMaterial({ color: 0xFF0000, depthTest: false, wireframe:true })
			);
		test.position.copy( positionR );
		scene.add ( test );	
		
		var test2 = new THREE.Mesh( 
			new THREE.BoxGeometry( dimensionL.x, dimensionL.y, dimensionL.z ), 
			new THREE.MeshBasicMaterial({ color: 0x00FFAA, depthTest: false, wireframe: true })
			);
		test2.position.copy( positionL );
		scene.add ( test2 );
		*/
			
		var mass = width*height*depth * 50; // Matches box dimensions for simplicity
		var startTransform = new Ammo.btTransform();
		startTransform.setIdentity();
		startTransform.setOrigin( new Ammo.btVector3( object.position.x, height / 2, object.position.z ) ); // Set initial position
		startTransform.setRotation( new Ammo.btQuaternion( object.rotation.y, object.rotation.x, object.rotation.z ) );

		var localInertia = new Ammo.btVector3(0, 0, 0);

		var boxShape = new Ammo.btBoxShape( new Ammo.btVector3( width/2-0.2, height/2, depth/2 ) );
		boxShape.calculateLocalInertia( mass, localInertia );
		 
		var motionState = new Ammo.btDefaultMotionState( startTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, boxShape, localInertia );
		var boxAmmo = new Ammo.btRigidBody( rbInfo );
		scene.world.addRigidBody( boxAmmo );

		boxAmmo.mesh = object; // Assign the Three.js mesh in `box`, this is used to update the model position later
		boxAmmo.mesh.name = "door";
		
		boxes.push( boxAmmo ); // Keep track of this box
		
		room.add( object );

		objects.push( object );

		// portalMeshes.push ( object );
		
		hinge1 = new Ammo.btHingeConstraint( boxAmmo,
			// new Ammo.btVector3(-0.7,0,0), // x achse
			new Ammo.btVector3( -boundingBoxSize.x / 2 , 0, 0 ), // x achse
			new Ammo.btVector3( 0, 1, 0 ), // y achse
			false);
			
		hinge1.setLimit( 0, 0, 0, 0, 0 ); //links
		scene.world.addConstraint( hinge1 );
	}

	if ( door ) {

		// DOOR
		OBJMTLLoader.load( 'shared/models/door/door.obj', 'shared/models/door/door.mtl', function ( object ) {

			object.children[2].scale.set( 0.0075, 0.0056, 0.006 ); 
			// object.position.set( 0.24, -1.05, 0 );
			// object.children[2].position.set( 0.24, -1.05, 0 );
			object.children[2].material.color.setHex( 0xFFFFFF );
			object.children[2].material.color.offsetHSL( 0, 0, 4 );
			object.children[2].geometry.center();

			// var parentObject = new THREE.Object3D();
			// parentObject.add( object );
			// scene.add( parentObject );
			// scene.add( object.children[2] );
			
			// physicalDoor( parentObject, boundingBoxSize.clone() );
			physicalDoor( object.children[2] );
			
		});

	} else {
		// var mesh00 = clone( mesh2 );
		// room.add( mesh00 );
	}
	
	room.add( ceiling );
	room.add( mesh2 );
	room.add( mesh3 );

	return room;

};




	// Start program
    var initialize = function () {

		// controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

		// // set Reset Values
		// controls.target0 = controls.target.clone();
		// controls.position0 = camera.position.clone();
		// controls.zoom0 = camera.zoom;
	
		// GRID FOR ORIENTATION
		var gridXZ = new THREE.GridHelper( 1, 0.1 );
		gridXZ.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
		scene.add(gridXZ);
		gridXZ.position.y = 0;
		gridXZ.visible = true;

		// var roomGeometry = new THREE.BoxGeometry( 30, 10, 30 );
		// var roomMaterial = new THREE.MeshNormalMaterial( { side: THREE.BackSide, transparent: true, opacity: 0.5 } );
		// var room = new THREE.Mesh( roomGeometry, roomMaterial );
		// room.position.set( 0, roomGeometry.parameters.height / 3, 0 );
		// scene.add( room );

		var room1 = createRoom( 10, 10, 3.2, false );
		scene.add( room1 );

		// var static_box = new Goblin.RigidBody( box_shape, Infinity ); // Mass of Infinity means the box cannot move
		// static_box.position.set( 0, 0, 0 ); // Set the static box's position 5 units down
		// world.addRigidBody( static_box );

		var box_geometry = new THREE.BoxBufferGeometry( 1, 1, 1 ), // note that the `BoxGeometry` arguments are the box's full width, height, and depth, while the parameters for `Goblin.BoxShape` are expressed as half sizes
		// var box_geometry = new THREE.SphereBufferGeometry( 1, 32, 32 ), // note that the `BoxGeometry` arguments are the box's full width, height, and depth, while the parameters for `Goblin.BoxShape` are expressed as half sizes
		    box_material = new THREE.MeshLambertMaterial({ color: 0xaa8833 });

		// box_geometry.translate( 0, 1, 0 );

		var dynamic_mesh = new THREE.Mesh( box_geometry, box_material ),
		    static_mesh = new THREE.Mesh( box_geometry, box_material );

		dynamic_mesh.position.set( 0, 0.5, 0 );
		static_mesh.rotation.set( 0, 0, 45 * Math.PI / 180 );
		scene.add( dynamic_mesh );
		physics.meshToBody( dynamic_mesh, 5 );

		static_mesh.position.set( 0, static_mesh.geometry.parameters.height / 2, 0 );
		// static_mesh.position.set( 0, static_mesh.geometry.boundingSphere.radius, 0 );
		// scene.add( static_mesh );
		// physics.meshToBody( static_mesh, 0 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( left );
		physics.meshToBody( left, 5 );

		var left = dynamic_mesh.clone();
		left.position.set( 2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( left );
		physics.meshToBody( left, 5 );

		var right = dynamic_mesh.clone();
		right.position.set( -2, dynamic_mesh.geometry.parameters.height / 2, 0 );
		scene.add( right );
		physics.meshToBody( right, 5 );

		var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.5, 16, 16 ), new THREE.MeshNormalMaterial() );
		sphere.position.set( -2, dynamic_mesh.geometry.parameters.height * 2, 0 );
		scene.add( sphere );
		physics.meshToBody( sphere, 5 );


		function onError() {
			console.log("error");
		}

		function onProgress() {

		}

		var textureLoader = new THREE.TextureLoader();

		// barrel_02
		var directoryPath = "assets/models/";
		var name = "Barrel_02";
		var spawnObject;

		var mtlLoader = new THREE.MTLLoader();
		var url = directoryPath + name + "/";
		mtlLoader.setBaseUrl( url );
		mtlLoader.setPath( url );

		mtlLoader.load( name + ".mtl", function( materials ) {

		    materials.preload();

		    var objLoader = new THREE.OBJLoader();
		    objLoader.setMaterials( materials );
		    objLoader.setPath( url );
		    objLoader.load( name + ".obj", function ( object ) {
				
				// console.log( object );

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

		    }, onProgress, onError );

		});

		var plane = physics.createPlane ( 1, 10, 10, 0, new THREE.MeshNormalMaterial() )
		scene.add( plane );

		// DEBUG GUI
        dg = debugGUI;
        dg.open();
		dg.add( plane, "visible" ).name("Show Floor");

		/*
		var name = "Environment";
		if ( dg.__folders[ name ] ) {
			var folder = dg.__folders[ name ];
		} else {
			var folder = dg.addFolder( name );
		}
		*/

		function thirdPerson( value ) {
			if( value ) {
				camera.position.set( 0, 1.5, 6 );
				controls.mesh.visible = value;
			} else {
				camera.position.set( 0, 0, 0 );
				controls.mesh.visible = value;
			}
		}

		var options = {
			reset: function() { 
				tweenHelper.resetCamera( 600 );
			},
			respawn: function() {
				
				var newBarrel = spawnObject.clone();

				newBarrel.position.set( 0, newBarrel.geometry.parameters.height / 2 + 3, 0 );
				physics.meshToBody( newBarrel, 2 );
				scene.add( newBarrel );


			},
			thirdPerson: false
		};
		// dg.add( options, "reset" ).name("Reset Camera");
		dg.add( options, "respawn" ).name("Spawn new barrel");
		dg.add( options, "thirdPerson" ).name("Third Person Camera").onChange( thirdPerson );
		dg.add( controls, "resetPlayer" ).name("Reset Player");

		// DEBUG GUI

	};

	var clock = new THREE.Clock();

	// MAIN LOOP
    var animate = function () {

    	var delta = clock.getDelta();

    	physics.update( delta );
    	controls.update();

		TWEEN.update();
		// controls.update();
		stats.update();

		skycube.update( camera, renderer );
		renderer.render( scene, camera );

		requestAnimationFrame( animate );

    };


    return {
        initialize: initialize,
        animate: animate
    }
});
    var dg;