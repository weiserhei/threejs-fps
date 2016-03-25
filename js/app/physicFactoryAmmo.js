/**
 * Clock timer
 *
 * Todo: multiple instances when needed. They can cause issues with eachother
 *
 */
define([
       "three",
       "../libs/ammo.small"
       ], function (THREE){

	'use strict';

	var physicWorld;

	function PhysicFactory() {

		// RIGID BODY STATES
		// #define ACTIVE_TAG 1
		// #define ISLAND_SLEEPING 2
		// #define WANTS_DEACTIVATION 3
		// #define DISABLE_DEACTIVATION 4
		// #define DISABLE_SIMULATION 5

		// Ammo.js physic boxes to update
		this._bodyContainer = [];

		this._steps = 1;

		// ammo js stuff
	 	var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
		var overlappingPairCache = new Ammo.btDbvtBroadphase();

		var solver = new Ammo.btSequentialImpulseConstraintSolver();
		var dynamicWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
		// dynamicWorld.setGravity( new Ammo.btVector3(0, -98, 0) );
		
		this._physicalWorld = dynamicWorld;

		this.tempVector3 = new Ammo.btVector3( 0, 0, 0 );
		this.tempQuaternion = new Ammo.btQuaternion( 0, 0, 0, 0 );
		this.tempTransform = new Ammo.btTransform();

		var factory = this;

		physicWorld = dynamicWorld;

	/*
		window.onbeforeunload = function (e) {
			// cleanup on exit

			// var message = "Your confirmation message goes here.",
			e = e || window.event;
			// For IE and Firefox
			if (e) {
				// e.returnValue = message;

				Ammo.destroy(collisionConfiguration);
				Ammo.destroy(dispatcher);
				Ammo.destroy(overlappingPairCache);
				Ammo.destroy(solver);

				Ammo.destroy( factory.tempVector3 );
				Ammo.destroy( factory.tempQuaternion );
				Ammo.destroy( factory.tempTransform );

			}

			// For Safari
			// return message;
		}; 
	*/
	}
	/* not needed i guess
	PhysicFactory.prototype.getPhysicsWorld = function( mesh ) {

		return this._physicalWorld;
	};
	*/

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

	PhysicFactory.prototype.addBody = function( body ) {

		this._bodyContainer.push( body );

	};

	PhysicFactory.prototype.dispose = function() {

		console.log("disposing ammo", this._bodyContainer);

		for ( var i = 0; i < this._bodyContainer.length; i ++ ) {

			// Ammo.destroy( this._bodyContainer[i] );
			// console.log("disposing", this._bodyContainer[ i ] );
			this._physicalWorld.removeRigidBody( this._bodyContainer[ i ] );

			// var ptr = this._bodyContainer[ i ].a != undefined ? this._bodyContainer[ i ].a : this._bodyContainer[ i ].ptr;
			// delete _objects_ammo[ptr];
			// delete this._bodyContainer[ i ];

			// Ammo.destroy( this._bodyContainer[ i ] );
			// Ammo.destroy(_motion_states[details.id]);

		}

		this._bodyContainer = [];
		
	};

	PhysicFactory.prototype.update = function( dt ) {

		var i, transform = new Ammo.btTransform(), origin, rotation;

	    var boxes = this._bodyContainer;
	     
		// move meshes according to ammo.js calculations
	    for ( i = 0; i < boxes.length; i ++ ) {

	        boxes[i].getMotionState().getWorldTransform( transform ); // Retrieve box position & rotation from Ammo
	         
	        // Update position
	        origin = transform.getOrigin();
	        boxes[i].mesh.position.x = origin.x();
	        boxes[i].mesh.position.y = origin.y();
	        boxes[i].mesh.position.z = origin.z();
	         
	        // Update rotation
	        rotation = transform.getRotation();
	        boxes[i].mesh.quaternion.x = rotation.x();
	        boxes[i].mesh.quaternion.y = rotation.y();
	        boxes[i].mesh.quaternion.z = rotation.z();
	        boxes[i].mesh.quaternion.w = rotation.w();

	    };

	    if (dt > this.maxSecPerFrame) {
	    	// timespan exceeded :(
			dt = this.maxSecPerFrame;
	    }

	    if( this.slowmo ) { 
	    	dt = 0.001; this._steps = 240; 
	    } else { 
	    	this._steps = 1; 
	    }
	    // scene.world.stepSimulation( 1 / 60, 5 ); // Tells Ammo.js to apply physics for 1/60th of a second with a maximum of 5 steps
	    this._physicalWorld.stepSimulation( dt, this._steps );

	};

	PhysicFactory.prototype.tVec = function(x,y,z){
	  this.tempVector3.setValue(x,y,z);
	  return this.tempVector3;
	};

	PhysicFactory.prototype.createPlane = function ( orientation, half_width, half_length, mass, material ) {

		var groundTransform = new Ammo.btTransform();
		groundTransform.setIdentity();
		// groundTransform.setOrigin(new Ammo.btVector3( mesh.position.x, -1, mesh.position.z ) ); // Set initial position
		groundTransform.setOrigin( new Ammo.btVector3( 0, -1, 0 ) ); // Set initial position

		var groundShape = new Ammo.btStaticPlaneShape( new Ammo.btVector3( 0, 1, 0 ), 1 );// Infinity Plane
		// var groundShape = new Ammo.btBoxShape(new Ammo.btVector3( mesh.geometry.parameters.width/2, 1, mesh.geometry.parameters.height/2 ));
		// var groundShape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, 1, height/2 ) );

		var groundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
		var localInertia = new Ammo.btVector3( 0, 0, 0 );
		var motionState = new Ammo.btDefaultMotionState( groundTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, motionState, groundShape, localInertia );
		var groundAmmo = new Ammo.btRigidBody( rbInfo );

		this._physicalWorld.addRigidBody ( groundAmmo );

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

		return plane;

	};

	PhysicFactory.prototype.meshToBody = function( mesh, mass ) {

		// TODO PLANE GEOMETRY
		// TODO custom mesh?

		var type = mesh.geometry.type;
		
		/*
		switch ( type ) {
			
			case "BoxGeometry":
			
				break;
				
			default:
				// Not recognized
				return;
				break;
			
		}
		*/
		
		if ( type === "BoxGeometry" || type === "BoxBufferGeometry" ) {
			
			if ( mesh.geometry.parameters !== undefined ) {
			
				var width = mesh.geometry.parameters.width;
				var height = mesh.geometry.parameters.height;
				var depth = mesh.geometry.parameters.depth;

			} else {

				var bbox = mesh.geometry.boundingBox;
				var box = mesh.geometry.boundingBox;
				var boundingBoxSize = bbox.max.sub( bbox.min );
				var box = new THREE.Box3().setFromObject( mesh );

				var min = box.min.sub(mesh.position);
				var max = box.max.sub(mesh.position);

				var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.05, 8, 8 ) );
				sphere.position.copy( min );

				var clone = sphere.clone();
				clone.position.copy( max );

				// mesh.add( sphere );
				// mesh.add( clone );

				var helper = new THREE.BoundingBoxHelper( mesh, 0xFFFFFF );
				helper.update();
				mesh.add( helper );

				var width = boundingBoxSize.x;
				var height = boundingBoxSize.y;
				var depth = boundingBoxSize.z;

			}

			var shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2 ) );
			
		} else if ( type === "SphereGeometry" || type === "SphereBufferGeometry" ) {

			var shape = new Ammo.btSphereShape( mesh.geometry.boundingSphere.radius );
			// var mass = mesh.geometry.boundingSphere.radius * 10;
			
		} else if ( type === "CylinderGeometry" ) {

			if ( mesh.geometry.parameters !== undefined ) {
				var radiusTop = mesh.geometry.parameters.radiusTop;
				var radiusBottom = mesh.geometry.parameters.radiusBottom;
				var height = mesh.geometry.parameters.height;
			}
			
			var shape = new Ammo.btCylinderShape( new Ammo.btVector3( radiusTop, height / 2, radiusBottom ) );
			
			// var mass = 50 * ( (radiusTop + radiusBottom)/2 ) *  height;
			
		} else if ( type === "PlaneGeometry" || type === "PlaneBufferGeometry" ) {
			
			// var width = mesh.geometry.parameters.width;
			// var height = mesh.geometry.parameters.height;

			var normal = new Ammo.btVector3( 0, 1, 0 );
			var shape = new Ammo.btStaticPlaneShape( normal, 0 );

		} else if ( type === "Geometry" ) {

			mesh.geometry.computeBoundingBox();


		}
		
		if ( typeof mass === 'undefined' ) { 
			var mass = width * depth * height * 10; 
		}

		// TODO
		// if mass == 0 dont add to bodyContainer!

		var bulletTransform = new Ammo.btTransform();
		
		bulletTransform.setIdentity();
		bulletTransform.setOrigin( new Ammo.btVector3( mesh.getWorldPosition().x, mesh.getWorldPosition().y+0.0, mesh.getWorldPosition().z ) ); // Set initial position
		
		bulletTransform.setRotation( new Ammo.btQuaternion( mesh.getWorldRotation().y, mesh.getWorldRotation().x, mesh.getWorldRotation().z ) );

		var body = this.createRigidBody( mass, shape, bulletTransform );
		
		if ( mass !== 0 ) {
			this._bodyContainer.push( body );
		}
		body.mesh = mesh; // Assign the Three.js mesh in `box`, this is used to update the model position later

		// body.mesh.updateMatrix(); 
		// var box = new THREE.Box3();
		// box.setFromObject( body.mesh );
		// console.log( "box", box );

		// var helper = new THREE.BoundingBoxHelper( mesh, 0xff0000 );	
		// var helper = new THREE.WireframeHelper( mesh,0xff0000 );
		// helper.update();
		// mesh.add( helper );

		return body;

	};

	PhysicFactory.prototype.createRigidBody = function( mass, shape, bulletTransform ) {

		// rigidbody is dynamic if and only if mass is non zero, otherwise static
		var isDynamic = ( mass != 0.0 );
		
		var localInertia = new Ammo.btVector3( 0, 0, 0 );
		
		if( isDynamic ) {
			shape.calculateLocalInertia( mass, localInertia );
		}
		 
		var motionState = new Ammo.btDefaultMotionState( bulletTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
		rbInfo.set_m_friction( 0.8 ); // reibung
		rbInfo.set_m_restitution( 0.0 ); //spring or bounciness
		rbInfo.set_m_angularDamping( 0.5 );
		var body = new Ammo.btRigidBody( rbInfo );

		// var DISABLE_DEACTIVATION = 4; 
		// body.setActivationState(DISABLE_DEACTIVATION);
		
		this._physicalWorld.addRigidBody( body );

		return body;

	};

	function makeStaticBox( dimension, position, rotation, mergeGeometry, materialIndex, shape, transform ) {

		var ammoDimension = dimension.clone().divideScalar( 2 );
		
		var rotation = rotation || new THREE.Vector3( 0, 0, 0 );

		var materialIndex = materialIndex || 0;
		// box physics
		var shape = shape || new Ammo.btBoxShape( new Ammo.btVector3( ammoDimension.x, ammoDimension.y, ammoDimension.z ) );
		var transform = transform || new Ammo.btTransform();
		
		transform.setIdentity();
		transform.setOrigin( new Ammo.btVector3( position.x, position.y + ammoDimension.y, position.z ) );
		transform.setRotation( new Ammo.btQuaternion( rotation.y, rotation.x, rotation.z ) );
		var localInertia = new Ammo.btVector3( 0, 0, 0 );
		var motionState = new Ammo.btDefaultMotionState( transform );
		var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia ); //mass zero
		var body = new Ammo.btRigidBody(cInfo);

		scene.world.addRigidBody( body );
		
		// if ( mergeGeometry ) {
			// box.updateMatrix();
			// mergeGeometry.merge(box.geometry, box.matrix);
		// } else {
			// return box;
		// }	
		// if ( mergeGeometry === undefined ) {
		// mrdoob codestyleâ„¢ disapproves typeof undefined
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
	}

    return PhysicFactory;

});