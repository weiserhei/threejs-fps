/**
 * FPS Mover Class
 * Creates a Character Controller
 * that is controlled by PointerLockAmmoControls
 *
 */

define([
		"three",
     	"scene",
    	"physics",
		"classes/PointerLockControls"
       ], function ( THREE, scene, physics, PointerLockControls ){

	'use strict';

	function FPSMover ( camera, domElement ) 
	{
	  
		var controls = new PointerLockControls( camera, domElement );
		var radius = 0.4;
		var height = 1.8;
		var eyeheight = 1.6;
		var visualizePlayer = false;
		var physicFactory = physics;

		this.getControls = function() {
			return controls;
		};

		this.reset = function() {
			controls.resetRotation();
			this.body.position.set( 0, height / 2 + 0.5, 2 );
		}

		this.movementSpeed = 4; //4
		this.jumpImpulse = 100;
		this.sprintSpeedMultiplier = 4;

		//basically its a THREE.Object3D with the camera as children
		var controlsObj = controls.getObject();
		var keyboard = controls;
		var physicWorld = physicFactory.getWorld();

		this.isGrounded = false;
		
		var currentGroundHeight = 0;
		var meshForward = new THREE.Vector3();
		var goblinUpVector = new Goblin.Vector3( 0, 1, 0 );
		var velV = new Goblin.Vector3( 0, 0, 0 );
		var goblinMeshForward = new Goblin.Vector3( 0, 0, 0 );
		var goblinMeshRight = new Goblin.Vector3( 0, 0, 0 );
		var goblinZeroVector = new Goblin.Vector3( 0, 0, 0 );

		
		function createCapsuleGeometry ( radius, height ) 
		{

			var cylinderHeight = height - radius * 2;
			var cylinder = new THREE.CylinderGeometry( radius, radius, cylinderHeight, 20, 10, true );
			var cap = new THREE.SphereGeometry( radius, 10, 10, 0, Math.PI * 2, 0, Math.PI );

			cylinder.merge( cap, new THREE.Matrix4().makeTranslation( 0, -cylinderHeight / 2, 0 ) );
			cylinder.merge( cap, new THREE.Matrix4().compose(
				new THREE.Vector3(0, cylinderHeight / 2, 0 ),
				new THREE.Quaternion().setFromEuler( new THREE.Euler( Math.PI, 0, 0 ) ),
				new THREE.Vector3( 1, 1, 1 )
			) );

			return cylinder;

		}

		function createCharacterTestCapsule ( radius, height ) 
		{

			var character = new THREE.Mesh(
				createCapsuleGeometry( radius, height ),
				new THREE.MeshLambertMaterial( { 
					color: 0x00FF00, 
					transparent: true, 
					opacity: 0.2,
					// side: THREE.DoubleSide
					} )
			);

			
			// helps indicate which direction is forward
			var directionMesh = new THREE.Mesh(
				new THREE.BoxGeometry( 0.2, 0.2, 1, 1, 1, 1 ),
				new THREE.MeshLambertMaterial( { color: 0x0000FF, transparent: true, opacity: 0.25 } )
			);
			character.castShadow = directionMesh.castShadow = true;

			// character.add( directionMesh );
			directionMesh.position.set( 0, 0, -radius * 2 );
			
			// character.geometry.translate( 0, - character.geometry.parameters.height, 0 );
			// directionMesh.geometry.translate( 0, - character.geometry.parameters.height, 0 );

			return character;

		}

		// add visualization of mover
		/*
		this.mesh = new THREE.Mesh(
			new THREE.CylinderGeometry( radius,radius,height ),
			new THREE.MeshLambertMaterial( { color: 0x00FF00, ambient: 0x00FF00, wireframe:true, visible: visualizeB } )
		);
		*/

		this.mesh = createCharacterTestCapsule( radius, height );
		this.mesh.material.visible = visualizePlayer;

		scene.add( this.mesh );

	    // SET PLAYER POSITION & ROTATION
		// slightly off the ground
		this.mesh.position.set( 0, height / 2 + 0.5, 2 );
		// controls.setYRotation( 45 * Math.PI / 180 );

		this.mesh.add( controlsObj );
		controlsObj.position.set( 0, eyeheight-height / 2, 0 );

		var mass = 50;

		var body = new Goblin.RigidBody(
				new Goblin.CylinderShape( radius, height / 2 ),
				mass
			);

		var position = this.mesh.getWorldPosition();
		body.position.copy( position );

		var rotation = this.mesh.quaternion;
		body.rotation = new Goblin.Quaternion( rotation.x, rotation.y, rotation.z, rotation.w );

		body.friction = 1;
		// http://bulletphysics.org/Bullet/phpBB3/viewtopic.php?t=8100
		body.linear_damping = 0.5;
		// body.angular_damping = 1; // no effect when angular factor is zero?
		// turns off all rotation
		body.angular_factor = new Goblin.Vector3( 0, 0, 0 ); // disable rotations on the body
		// this.body.angular_factor = new Goblin.Vector3( 0, 1, 0 ); // REALITYMELTDOWN

		physicFactory.addBody( body, this.mesh );
		physicWorld.addRigidBody( body );
		
		this.body = body;

		// console.log( body );
		
		// keeps physics from going to sleep (from bullet documentation)
		// var DISABLE_DEACTIVATION = 4; 
		// this.body.setActivationState(DISABLE_DEACTIVATION);
		
		// ---------------------------------------------------------------------------
		// check if the player mesh is touching the ground
		var updateGrounding = ( function() {

			// this part will be exectued once
			var fromPoint = new Goblin.Vector3();
			var toPoint = new Goblin.Vector3();
			var rayPadding = height * 0.05 + 0; //extra padding because of clamping
			
			var BasicBroadphase = physicFactory.getEngine();

			return function() {
				
				// if ( this.body.getLinearVelocity().getY() < 0 ) { // > 0 when on stairs or in the air
				// position
				fromPoint.set(			
					this.mesh.matrixWorld.elements[ 12 ],
					this.mesh.matrixWorld.elements[ 13 ],
					this.mesh.matrixWorld.elements[ 14 ]        
				);

				toPoint.set( 
					fromPoint.x, 
					fromPoint.y - height / 2 - rayPadding, 
					fromPoint.z 
				);

				// console.log( fromPoint, toPoint );
				// this.isGrounded = true;
				// var intersections = [];
				// this.body.rayIntersect ( fromPoint, toPoint, intersections );

				var intersections = BasicBroadphase.rayIntersect( fromPoint, toPoint );

				if ( intersections[ 1 ] !== undefined ) {
					this.isGrounded = true;
				} else {
					this.isGrounded = false;
				}

				// console.log( this.isGrounded );

				/*
				var rayCallback = new Ammo.ClosestRayResultCallback( fromPoint, toPoint );

				physicWorld.rayTest( fromPoint, toPoint, rayCallback );
				// scene.world.rayTest( fromPoint, toPoint, rayCallback );
				this.isGrounded = rayCallback.hasHit();

				if ( this.isGrounded ) {

					var body = rayCallback.get_m_collisionObject();

				// if( body ){
					// console.log( body.getCollisionFlags() );

					// take into account CF_NO_COLLISION
					if( body.getCollisionFlags() !== 5 ){
					// if( !( body.isStaticObject() || body.isKinematicObject() ) ){
						currentGroundHeight = rayCallback.get_m_hitPointWorld().getY();
					}
				// }
				}
				*/
				// } else {
				// 	this.isGrounded = false;
		  		// }
			}

		} )();

		// ---------------------------------------------------------------------------


		this.update = function() 
		{

			// TODO: 
			// make character a little bit controlable in the air

			updateGrounding.call( this );

			// rotate the body in view direction 
			// (mainly doing this for correct audio listener orientation)
	    	var yRotation = controls.getYRotation();
	    	var euler = new THREE.Euler( 0, yRotation, 0, 'XYZ');
			var quat = new THREE.Quaternion().setFromEuler( euler );

	    	this.body.rotation = new Goblin.Quaternion( quat.x, quat.y, quat.z, quat.w );

			if ( this.isGrounded ) {

				if ( !keyboard.spacebar ) {

					// Clamp the character to the terrain to prevent floating off hills
					// var hat = this.mesh.matrixWorld.elements[ 13 ] - height / 2 - currentGroundHeight;
					// extra padding for stairs
					// -0.08 no sliding down but glitching

					// var ypos = new THREE.Vector3();
					// ypos.setFromMatrixPosition( this.mesh.matrixWorld );
					// var ypos2 = this.mesh.getWorldPosition().y;

					// var hat = this.mesh.matrixWorld.elements[ 13 ] - height / 2 - currentGroundHeight;

					// this is why we cant have nice things
					// ie walk up stairs easy
					// this.body.translate( new Ammo.btVector3( 0, -hat, 0 ) );

					// get camera direction
					meshForward = camera.getWorldDirection();

					// convert to Goblin vector, project to plane
					goblinMeshForward.set( meshForward.x, 0, meshForward.z );
					goblinMeshForward.normalize();

					// right direction is dir X yUnit
					goblinMeshRight.crossVectors( goblinMeshForward, goblinUpVector );

					// set up physics for next time
					velV.set( 0, 0, 0 );
					// velV.set( 0, -1, 0 );
					// console.log("velv", velV, "gMR", goblinMeshRight, "gMF", goblinMeshForward );
					
					if ( keyboard.forward )
						velV.add( goblinMeshForward );
					if ( keyboard.right )
						velV.add( goblinMeshRight );
					if ( keyboard.left )
						velV.subtract( goblinMeshRight );
					if ( keyboard.back )
						velV.subtract( goblinMeshForward );
						
					// Only apply movement if we have a significant distance to cover
					// length2 == lengthSquared ?
					if ( velV.lengthSquared() > 0.001 ) {

						velV.normalize();
						velV.scale( this.movementSpeed );

						if( keyboard.shift ) {

							velV.scale( this.sprintSpeedMultiplier ); //custom
							
						}

						this.body.linear_velocity = velV;

					} else {
						// console.log("nix");
						this.body.linear_velocity = goblinZeroVector;

					}
					// console.log( velV );

					
				} else {

					// Help the character get above the terrain and then apply up force
					// this.body.translate( new Ammo.btVector3( 0, height * 0.15, 0 ) );
					this.body.position.y += 0.1;

					// this.body.applyCentralImpulse( new Ammo.btVector3( 0, this.jumpImpulse, 0 ) );

					// this.body.applyForce ( new Goblin.Vector3( 0, this.jumpImpulse, 0 ) );
					this.body.applyImpulse ( new Goblin.Vector3( 0, this.jumpImpulse / 12, 0 ) );

				}

			} 

			keyboard.spacebar = false;

		};
	}

	return FPSMover;

});