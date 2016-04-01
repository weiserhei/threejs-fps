/**
 * Clock timer
 *
 * Todo: multiple instances when needed. They can cause issues with eachother
 *
 */
define([
       "three",
       "../libs/goblin"
       ], function (THREE){

	var broadphase = new Goblin.BasicBroadphase();
	// var broadphase = new Goblin.SAPBroadphase();
	Goblin.GjkEpa.margins = 0;

	function PhysicFactory() {
		this.world = new Goblin.World( broadphase, new Goblin.NarrowPhase(), new Goblin.IterativeSolver() );
		this.body_to_mesh_map = {};
	}

	PhysicFactory.prototype.getWorld = function() {
		return this.world;
	};

	PhysicFactory.prototype.getEngine = function() {
		return broadphase;
	};

	PhysicFactory.prototype.addBody = function( rigidBody, mesh) {
		this.body_to_mesh_map[ rigidBody.id ] = mesh;
	};


	PhysicFactory.prototype.makeStaticBox = function( dimension, position, rotation, mergeGeometry, materialIndex, shape, transform ) {
		
		var goblinDimension = dimension.clone().divideScalar( 2 );
	
		var rotation = rotation || new THREE.Vector3( 0, 0, 0 );

		var materialIndex = materialIndex || 0;
		// box physics
		var shape = shape || new Goblin.BoxShape( goblinDimension.x, goblinDimension.y, goblinDimension.z );

		var position = new THREE.Vector3( position.x, position.y + goblinDimension.y, position.z );

		var dynamic_body = new Goblin.RigidBody( shape, 0.0 );

		dynamic_body.position.copy( position );

		// var rotation = mesh.quaternion;
		// dynamic_body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );
		dynamic_body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, 1 );

		this.world.addRigidBody( dynamic_body );
		// this.addBody( dynamicBody, )
		
		// if ( mergeGeometry ) {
			// box.updateMatrix();
			// mergeGeometry.merge(box.geometry, box.matrix);
		// } else {
			// return box;
		// }	
		// if ( mergeGeometry === undefined ) {
		// mrdoob codestyle™ disapproves typeof undefined
		if ( typeof mergeGeometry === "undefined" ) {
			return box;
			
		} else {
			
			dimension.multiplyScalar( 2 );
			// console.log(dimension);
			var box = new THREE.Mesh(
				new THREE.BoxGeometry( dimension.x, dimension.y, dimension.z )
			);
			box.position.set( position.x, position.y + dimension.y / 2, position.z );
			box.rotation.copy( rotation );
			box.updateMatrix();
			for ( var i = 0; i < box.geometry.faces.length; i++ ) {
				box.geometry.faces[ i ].materialIndex = 0;
			}

			mergeGeometry.merge( box.geometry, box.matrix, materialIndex );

		}
		// body.mesh = box; // Assign the Three.js mesh in `box`, this is used to update the model position later
		// boxes.push( body ); // Keep track of this box

	};

	PhysicFactory.prototype.getProxyMesh = function ( object, geometryType ) {

		// CALCULATE BOUNDING BOX BEFORE ROTATION!
		var helper = new THREE.BoundingBoxHelper( object, 0xff0000 );
		helper.update();

		// var bbox = new THREE.Box3().setFromObject( object );
		// var boundingBoxSize2 = bbox.max.sub( bbox.min );

		var boundingBoxSize = helper.box.max.sub( helper.box.min );

		var geometry;
		if ( geometryType === "Cylinder" ) {
			geometry = new THREE.CylinderGeometry( 
				Math.max(boundingBoxSize.x, boundingBoxSize.z) / 2, 
				Math.max(boundingBoxSize.x, boundingBoxSize.z) / 2,
				boundingBoxSize.y
			);
		} else {
			geometry = new THREE.BoxGeometry( boundingBoxSize.x , boundingBoxSize.y, boundingBoxSize.z );
		}

		var material = new THREE.MeshBasicMaterial( { visible:true, wireframe: true } );
		var mesh = new THREE.Mesh( geometry, material );

		object.geometry.translate( 0, - boundingBoxSize.y / 2, 0 );
		mesh.add( object );


		// var translationMatrix = new THREE.Matrix4().makeTranslation( 0, boundingBoxSize.y / 2, 0 )
		// mesh.geometry.applyMatrix( translationMatrix );
		// object.position.y -= boundingBoxSize.y / 2;
		// helper.update();
		
		// mesh.add( helper );

		return mesh;
	}

	PhysicFactory.prototype.meshToBody = function( mesh, mass ) {

		var type = mesh.geometry.type;
		// console.log( type );

		if ( type === "BoxGeometry" || type === "BoxBufferGeometry" ) {
			
			if ( mesh.geometry.parameters !== undefined ) {
			
				var width = mesh.geometry.parameters.width;
				var height = mesh.geometry.parameters.height;
				var depth = mesh.geometry.parameters.depth;

			}

			var shape = new Goblin.BoxShape( width / 2, height / 2, depth / 2 ); // dimensions are half width, half height, and half depth, or a box 1x1x1

		} else if ( type === "SphereGeometry" || type === "SphereBufferGeometry" ) {

			var shape = new Goblin.SphereShape( mesh.geometry.boundingSphere.radius );
			// var mass = mesh.geometry.boundingSphere.radius * 10;
			
		} else if ( type === "CylinderGeometry" ) {

			if ( mesh.geometry.parameters !== undefined ) {
				var radiusTop = mesh.geometry.parameters.radiusTop;
				var radiusBottom = mesh.geometry.parameters.radiusBottom;
				var height = mesh.geometry.parameters.height;
			}
			
			var shape = new Goblin.CylinderShape( radiusBottom, height / 2 );
			// var mass = 50 * ( (radiusTop + radiusBottom)/2 ) *  height;
			
		} 
		// else if ( type === "PlaneGeometry" || type === "PlaneBufferGeometry" ) {
			
		// 	// var width = mesh.geometry.parameters.width;
		// 	// var height = mesh.geometry.parameters.height;

		// 	var normal = new Ammo.btVector3( 0, 1, 0 );
		// 	var shape = new Ammo.btStaticPlaneShape( normal, 0 );

		// }
		    
		var dynamic_body = new Goblin.RigidBody( shape, mass );
		var position = mesh.getWorldPosition();
		dynamic_body.position.copy( position );

		var rotation = mesh.quaternion;
		dynamic_body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );

		this.world.addRigidBody( dynamic_body );

		// dynamic_body.friction = 0.8; // reibung
		// dynamic_body.restitution = 0.0; //spring or bounciness
		// dynamic_body.angularDamping = 0.5;

		// if ( mass !== 0.0 ) {
		this.addBody( dynamic_body, mesh );
		// }

		return dynamic_body;

	};


	PhysicFactory.prototype.createPlane = function ( orientation, half_width, half_length, mass, material ) {

		var plane = new THREE.Mesh(
			new THREE.BoxGeometry(
				orientation === 1 || orientation === 2 ? half_width * 2 : 0.01,
				orientation === 0 ? half_width * 2 : ( orientation === 2 ? half_length * 2 : 0.01 ),
				orientation === 0 || orientation === 1 ? half_length * 2 : 0.01
			),
			material
		);
		plane.castShadow = true;
		plane.receiveShadow = true;
		plane.goblin = new Goblin.RigidBody(
			//new Goblin.PlaneShape( orientation, half_width, half_length ),
			new Goblin.BoxShape(
				orientation === 1 || orientation === 2 ? half_width : 0.005,
				orientation === 0 ? half_width : ( orientation === 2 ? half_length : 0.005 ),
				orientation === 0 || orientation === 1 ? half_length : 0.005
			),
			mass
		);

		// objects.push( plane );
		this.body_to_mesh_map[plane.goblin.id] = plane;

		this.world.addRigidBody( plane.goblin );

		return plane;

	}

	PhysicFactory.prototype.update = function() {

    	// run physics simulation
	    this.world.step( 1 / 60 );

	    // update mesh positions / rotations
	    for ( var i = 0; i < this.world.rigid_bodies.length; i++ ) {
	    	
	        var body = this.world.rigid_bodies[i];
	    	if ( this.body_to_mesh_map[ body.id ] === undefined ) 
	    	{ 
	    		continue; 
	    	}
	        var mesh = this.body_to_mesh_map[ body.id ];

	        // update position
	        mesh.position.x = body.position.x;
	        mesh.position.y = body.position.y;
	        mesh.position.z = body.position.z;

	        // update rotation
	        mesh.quaternion._x = body.rotation.x;
	        mesh.quaternion._y = body.rotation.y;
	        mesh.quaternion._z = body.rotation.z;
	        mesh.quaternion._w = body.rotation.w;
	    }

	};

    return PhysicFactory;

});