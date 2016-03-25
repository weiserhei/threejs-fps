/**
 * Ammo Utils
 * essential Ammo.js Toolset
 * of functions
 *
 */

// original file from http://realitymeltdown.com/WebGL3/collision-controller-terrain.html
Ammo.Utils = {

	// custom extended
	btRaycast: function( btRayFrom, btRayTo ) {
		
		/* DRAW RAY FOR DEBUGGING 
		// Vector3(to - from).normalized; http://www.blancmange.info/notes/maths/vectors/ops/
		var direction = THREErayTo.clone().sub( THREErayFrom ).normalize();
		// draw arrow for visualisation
		var origin = THREErayFrom;	
		scene.remove ( arrow );
		// arrow = new THREE.ArrowHelper( direction, origin, rayFrom.distance(rayTo), Math.random() * 0xffffff );
		arrow = new THREE.ArrowHelper( direction, origin, rayFrom.distance(rayTo), 0xFF0000, 1, 0.7 );
		arrow.children[0].material.transparent = true; //line
		arrow.children[1].material.transparent = true; //head
		scene.add(arrow);
		
		// This will be repeated every for 5 times with 0.1 second intervals:
		setIntervalX(function (x) {
			// console.log(Math.cos(x/3));
			arrow.children[0].material.opacity = Math.cos(x/2.6);
			arrow.children[1].material.opacity = Math.cos(x/2.6);
		}, 100, 5);
		// */
		
		var rayCallback = new Ammo.ClosestRayResultCallback( btRayFrom, btRayTo );
		scene.world.rayTest( btRayFrom,btRayTo, rayCallback );	
		
		return rayCallback;

	},

	btRaylgun: function( distance ) {
	
		// Schnittpunkt position xyz
		// var distance = - origin.z / direction.z;
		// var pos = origin.clone().add( direction.clone().multiplyScalar( distance ) );

		// zielpunkt berechnen wie weit der ammo.js ray schießt ( distance )
		var btRayToPoint = camera.getWorldPosition().clone().add( camera.getWorldDirection().clone().multiplyScalar( distance ) );
		
		var btRayFrom = new Ammo.btVector3( 
								camera.getWorldPosition().x, 
								camera.getWorldPosition().y, 
								camera.getWorldPosition().z 
								);

		var btRayTo = Ammo.Utils.createAmmoVector3FromThree( btRayToPoint );

		var rayCallback = Ammo.Utils.btRaycast( btRayFrom, btRayTo );
		
		if( rayCallback.hasHit() ){

			var body = rayCallback.get_m_collisionObject();

			if( body ){
				// other exclusions?
				if( !( body.isStaticObject() || body.isKinematicObject() ) ){

					var pickedBody = body = Ammo.btRigidBody.prototype.upcast( body );
					body.activate(); //necessary cause bodys fall asleep

					// var ACTIVE_TAG = 1;
          			// body.setActivationState( ACTIVE_TAG );

				
					if( pickedBody.mesh !== undefined ) {
						// pickedBody.mesh.material.emissive.setHex( Math.random() * 0xffffff );
						hitobjectpos = pickedBody.mesh.position;
						
						/* HIGHLIGHT HIT OBJECT FOR DEBUGGING 
						scene.remove( helper );
						helper = new THREE.WireframeHelper( pickedBody.mesh );
						helper.material.depthTest = false;
						helper.material.opacity = 0.5;
						helper.material.transparent = true;
						scene.add( helper );
						// */
					}
					
					var pickPos = rayCallback.get_m_hitPointWorld();
					var pickingDistance = new Ammo.btVector3( pickPos.x(), pickPos.y(), pickPos.z() );
					pickingDistance = pickingDistance.op_sub( btRayFrom ).length();
					
					var impactForce = ( 1000 * ( 1/pickingDistance ) ).clamp( 40, 150 );
					
					if ( env.player.currentWeapon.modelname === "sniper" ) { // == 1 ) {
						impactForce = ( 300 * ( 1/pickingDistance ) ).clamp( 15, 100 );
					}
					// console.log(impactForce);

					var btDirection = new Ammo.btVector3( btRayTo.x(), btRayTo.y(), btRayTo.z() );
					btDirection.op_sub( btRayFrom ).normalize();

					var btForce = new Ammo.btVector3( btDirection.x(), btDirection.y(), btDirection.z() );
					btForce.op_mul( impactForce/2 );
					
					// pickedBody.applyCentralImpulse( new Ammo.btVector3( btDirection.x(), btDirection.y(), btDirection.z() ) );

					var localPivot = body.getCenterOfMassTransform().inverse().op_mul( pickPos );

					// fireEffect( pickPos, normal, body );

					if( env.player.currentWeapon.modelname === "shotgun" || 
						env.player.currentWeapon.modelname === "sniper" ) {

						// pickedBody.setAngularFactor(1,1,1);
						pickedBody.applyImpulse( btForce, localPivot );
						// pickedBody.applyCentralImpulse( new Ammo.btVector3( direction.x, direction.y, direction.z ) );

					} else if ( env.player.currentWeapon.modelname === "bow" ) {
					

						// body.setGravity( 0, 0, 0 ); //lel
						// Pflock gun
						var p2p = new Ammo.btPoint2PointConstraint(body,localPivot);
						this.scene.world.addConstraint(p2p);
						pickedBody.applyImpulse( btForce, localPivot );

						// console.log(body.getGravity());
						// this.m_pickConstraint = p2p;
						// p2p.get_m_setting().set_m_tau(0.001);
					}
						// p2p.get_m_setting().set_m_impulseClamp(this.mousePickClamping);
						//very weak constraint for picking
					
					// console.log("center of mass", pickedBody.getCenterOfMassPosition() );
					// console.log("pos", pickedBody.mesh.position );
					// console.log("local pivo", localPivot.x(), localPivot.y(), localPivot.z());
								
				}
			}
		}
	},
	
	btPickPos: function( distance ) {
	
		//TODO:
		// PLACE PORTAL AS SPRITE ON WALL (see decals)
		// render scene camera to sprite texture ( see http://stemkoski.github.io/Three.js/Camera-Texture.html )

		// zielpunkt berechnen wie weit der ammo.js ray schießt ( distance )
		var rayToCoordinate = camera.getWorldDirection().clone().multiplyScalar( distance );
		var coordinate = camera.getWorldPosition().clone().add( rayToCoordinate );
		var btRayTo = Ammo.Utils.createAmmoVector3FromThree( coordinate );
		
		var btRayFrom = new Ammo.btVector3( 
								camera.getWorldPosition().x, 
								camera.getWorldPosition().y, 
								camera.getWorldPosition().z 
								);

		var rayCallback = Ammo.Utils.btRaycast( btRayFrom, btRayTo );
		
		if( rayCallback.hasHit() ){

			var body = rayCallback.get_m_collisionObject();

			if( body ){
				// other exclusions?
				
				if( body.isStaticObject() ){
				// if( !( body.isStaticObject() || body.isKinematicObject() ) ){

					var pickedBody = body = Ammo.btRigidBody.prototype.upcast( body );
					// body.activate(); //necessary cause bodys fall asleep
					
					if( pickedBody.mesh !== undefined ) {

						pickedBody.mesh.material.emissive.setHex( Math.random() * 0xffffff );
						hitobjectpos = pickedBody.mesh.position;
						
						/* HIGHLIGHT HIT OBJECT FOR DEBUGGING 
						scene.remove( helper );
						helper = new THREE.WireframeHelper( pickedBody.mesh );
						helper.material.depthTest = false;
						helper.material.opacity = 0.5;
						helper.material.transparent = true;
						scene.add( helper );
						// */
					}
					
					var pickPos = rayCallback.get_m_hitPointWorld();
					return rayCallback;
					// return pickPos;
					
					// scene.remove( marker );
					// marker = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial( { opacity: 0.5, transparent: true } ) );
					// marker.position.set( pickPos.x(), pickPos.y(), pickPos.z() );
					// scene.add( marker );
								
				}
			}
		}
	},

	btVectorToConsole: function( btVector3 ) {
		console.log("bulletVector", btVector3, btVector3.x(), btVector3.y(), btVector3.z() );
	},
	
  // -----------------------------------------------------------------------------
  b2three: function( trans, mat ) {

    var basis = trans.getBasis();
    var origin = trans.getOrigin();
    var m = mat.elements;
    var v = basis.getRow(0);
    m[0] = v.x(); m[4+0] = v.y(); m[8+0] = v.z(); m[12+0] = origin.x();
    v = basis.getRow(1);
    m[1] = v.x(); m[4+1] = v.y(); m[8+1] = v.z(); m[12+1] = origin.y();
    v = basis.getRow(2);
    m[2] = v.x(); m[4+2] = v.y(); m[8+2] = v.z(); m[12+2] = origin.z();
    m[3] = 0.0; m[4+3] = 0.0; m[8+3] = 0.0; m[12+3] = 1.0;
    

/*
      var basis = trans.getBasis();  
	  var origin = trans.getOrigin();
	  var m = mat.elements;

  var vx = 1;
  var vy = 0;
  var vz = 0;
  
  m[0] = vx; m[4+0] = vy; m[8+0] = vz; m[12+0] = origin.x();

  vx = 0;
  vy = 1;
  vz = 0;
  
  m[1] = vx; m[4+1] = vy; m[8+1] = vz; m[12+1] = origin.y();
  
  vx = 0;
  vy = 0;
  vz = 1;
  
  m[2] = vx; m[4+2] = vy; m[8+2] = vz; m[12+2] = origin.z();
  m[3] = 0.0; m[4+3] = 0.0; m[8+3] = 0.0; m[12+3] = 1.0;
*/

  },

  // -----------------------------------------------------------------------------
	createGround: function() {

		var groundTransform = new Ammo.btTransform();
		groundTransform.setIdentity();

		groundTransform.setOrigin( new Ammo.btVector3( 0, -1, 0 ) ); // Set initial position
		var groundShape = new Ammo.btStaticPlaneShape( new Ammo.btVector3( 0, 1, 0 ), 1 );// Infinity Plane
		// var groundShape = new Ammo.btBoxShape(new Ammo.btVector3( 100/2, 1, 100/2 ));

		var groundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
		var localInertia = new Ammo.btVector3(0, 0, 0);
		var motionState = new Ammo.btDefaultMotionState( groundTransform );
		var rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, motionState, groundShape, localInertia );
		rbInfo.set_m_restitution( 0.5 );
		rbInfo.set_m_friction( 0.8 );

		var ground = new Ammo.btRigidBody( rbInfo );

		return ground;
		
	},

  // -----------------------------------------------------------------------------
  createAmmoVector3FromThree: function( threeVector ) {

    return new Ammo.btVector3( threeVector.x, threeVector.y, threeVector.z );

  },

  // -----------------------------------------------------------------------------
  createWorld: function( gravity) {

    gravity = ( gravity != undefined ) ? gravity: -10;

    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    var overlappingPairCache =  new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    var dynamicWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
    // dynamicWorld.setGravity( new Ammo.btVector3( 0, gravity, 0 ) );
    return dynamicWorld;

  },

  // -----------------------------------------------------------------------------
  createStaticBox: function( xdim, ydim, zdim, x, y, z ) {

    var shape = new Ammo.btBoxShape( new Ammo.btVector3( xdim / 2, ydim / 2, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

  // -----------------------------------------------------------------------------
  createStaticCylinder: function( xdim, ydim, zdim, x, y, z ) {

    var shape = new Ammo.btCylinderShape( new Ammo.btVector3( xdim / 2, ydim, zdim / 2 ) );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

  // -----------------------------------------------------------------------------
  createStaticConvexHull: function( points, x, y, z, yaw, pitch, roll ) {

    yaw = ( yaw != undefined ) ? yaw: 0;
    pitch = ( pitch != undefined ) ? pitch: 0;
    roll = ( roll != undefined ) ? roll: 0;

    var shape = new Ammo.btConvexHullShape();

    for ( var i = 0; i < points.length; i+= 3 ) {

      var point = new Ammo.btVector3( points[ i ], points[ i + 1 ], points[ i + 2 ] );
      shape.addPoint( point );
    }

    var rotation = new Ammo.btQuaternion( yaw, pitch, roll );

    var transform = new Ammo.btTransform();
    transform.setRotation( rotation );
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

  // -----------------------------------------------------------------------------
  createDynamicSphere: function( radius, x, y, z ) {

    var shape = new Ammo.btSphereShape( radius );
    var transform = new Ammo.btTransform();
    var mass = 1;
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( x, y, z ) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    shape.calculateLocalInertia( mass, localInertia );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody( cInfo );
    body.setDamping( 0.25, 0.25 );
    return body;

  },

	createPhysijsHeightfield: function( geometry, xdiv, ydiv ) {
		// ( geometry, material, mass, xdiv, ydiv) {
		var xsize  = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
		var ysize  = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
		var xpts = (typeof xdiv === 'undefined') ? Math.sqrt(geometry.vertices.length) : xdiv + 1;
		var ypts = (typeof ydiv === 'undefined') ? Math.sqrt(geometry.vertices.length) : ydiv + 1;
		// note - this assumes our plane geometry is square, unless we pass in specific xdiv and ydiv
		var absMaxHeight = Math.max(geometry.boundingBox.max.z,Math.abs(geometry.boundingBox.min.z));

		var points = [];

		var a, b;
		for ( var i = 0; i < geometry.vertices.length; i++ ) {

			a = i % xpts;
			b = Math.round( ( i / xpts ) - ( (i % xpts) / xpts ) );
			points[i] = geometry.vertices[ a + ( ( ypts - b - 1 ) * ypts ) ].z;

			//points[i] = geometry.vertices[i];
		}

		// var points = points;

		var ptr = Ammo.allocate(4 * xpts * ypts, "float", Ammo.ALLOC_NORMAL);

			for (var f = 0; f < points.length; f++) {
				Ammo.setValue(ptr + f,  points[f]  , 'float');
			}

			shape = new Ammo.btHeightfieldTerrainShape(
					xpts,
					ypts,
					ptr,
					1,
					-absMaxHeight,
					absMaxHeight,
					2,
					0,
					false
				);

			var _vec3_1 = new Ammo.btVector3(0,0,0);
			_vec3_1.setX(xsize/(xpts - 1));
			_vec3_1.setY(ysize/(ypts - 1));
			_vec3_1.setZ(1);

			// shape.setLocalScaling(xsize/(xpts - 1), 1, ysize/(ypts - 1) );
			shape.setLocalScaling(_vec3_1);
			// _noncached_shapes[description.id] = shape;


			    var transform = new Ammo.btTransform();
			    transform.setIdentity();
			    transform.setOrigin( new Ammo.btVector3( 0, 0, 0) );
			    var localInertia = new Ammo.btVector3( 0, 0, 0 );
			    var motionState = new Ammo.btDefaultMotionState( transform );
			    var cInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
			    var body = new Ammo.btRigidBody(cInfo);

			return body;
	},


  // -----------------------------------------------------------------------------
  createHeightfield: function( geometry, widthSegments, heightSegments ) {

    geometry.computeBoundingBox();

    var ptr = Ammo.allocate(4 * widthSegments * heightSegments, "float", Ammo.ALLOC_NORMAL);
    var bounds = geometry.boundingBox;

    var points = [];

    var gridX = widthSegments + 1;
    var gridZ = heightSegments + 1;
    var vertCount = gridX * gridZ - 1;
    var absMaxHeight = Math.max( geometry.boundingBox.max.y, Math.abs( geometry.boundingBox.min.y ) );

    for ( var iz = 0; iz < gridZ; iz ++ ) {

        for ( var ix = 0; ix < gridX; ix ++ ) {

            var vertIndex = ( vertCount - iz * gridX ) - ix;
            Ammo.setValue( ptr + vertIndex, geometry.vertices[ vertIndex ].y, 'float' );

        }
    };

    // var a, b;
    //   for ( var i = 0; i < geometry.vertices.length; i++ ) {

    //     a = i % gridX;
    //     b = Math.round( ( i / gridX ) - ( (i % gridX) / gridX ) );
    //     points[i] = geometry.vertices[ a + ( ( gridZ - b - 1 ) * gridZ ) ].y;

    //   }

    for (var f = 0; f < points.length; f++) {
      Ammo.setValue(ptr + f,  points[f]  , 'float');
    }

    var shape = new Ammo.btHeightfieldTerrainShape(
      gridX, //heightStickWidth
      gridZ, //heightStickLength
      ptr, //heightfieldData
      1, // has no effect? //heightScale
      -absMaxHeight, //minHeight
      absMaxHeight, //maxHeight
      1, //upAxis
      0, //heightDataType
      true //flipQuadEdges 
    );

    var xsize = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    var zsize = geometry.boundingBox.max.z - geometry.boundingBox.min.z;

    var scaling = new Ammo.btVector3( 0, 0, 0 );

    shape.setLocalScaling( new Ammo.btVector3( xsize / widthSegments, 1, zsize / heightSegments ) );

    var transform = new Ammo.btTransform();
    transform.setIdentity();

    transform.setOrigin( new Ammo.btVector3( 0, 0, 0) );
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var cInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
    var body = new Ammo.btRigidBody(cInfo);

    return body;

  },

  // -----------------------------------------------------------------------------
  body2world: function(body,v3B) {

    var trans = body.getWorldTransform();
    var result = trans.op_mul(v3B);
    return result;

  }

}