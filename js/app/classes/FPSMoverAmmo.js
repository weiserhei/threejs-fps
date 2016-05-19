

function AmmoCharacterController( character, radius, height, physics ) {

  var scope = this;

  this.world = physics;
  this.object = character;
  this.body = null;

  // movement and rotation toggles
  this.forward = false;
  this.right = false;
  this.left = false;
  this.back = false;
  this.clockwise = false;
  this.counterClockwise = false;
  this.jump = false;

  this.turnAngle = 0;
  this.movementSpeed = 10;
  this.rotationSpeed = 90; // degress per second
  this.jumpImpulse = 1000;

  this.isGrounded = true;

  var currentGroundHeight = 0;
  var ammoUpVector = new Ammo.btVector3( 0, 1, 0 );

  // ---------------------------------------------------------------------------
  this.update = function( dt ) {

    updateRenderMatrix.call( this, dt );
    updateGrounding.call( this );

    if ( this.isGrounded ) {

        if ( !this.jump ) {

          // Clamp the character to the terrain to prevent floating off hills
          var hat = this.object.matrixWorld.elements[ 13 ] - height / 2 - currentGroundHeight;
          this.body.translate( new Ammo.btVector3( 0, -hat, 0 ) );

          // get forward direction
          var meshForward = new THREE.Vector3(
          -this.object.matrixWorld.elements[ 8 ],
          -this.object.matrixWorld.elements[ 9 ],
          -this.object.matrixWorld.elements[ 10 ]
        );

        // convert to Ammo vector, project to plane
        var dir = new Ammo.btVector3( meshForward.x, 0, meshForward.z );
        dir.normalize();

        // right direction is dir X yUnit
        var right = dir.cross( ammoUpVector );

        var velV = new Ammo.btVector3( 0, 0, 0 );

        if ( this.ahead )
          velV.op_add( dir );
        if ( this.right )
          velV.op_add( right );
        if ( this.left )
          velV.op_sub( right );
        if ( this.back )
          velV.op_sub( dir );

        // Only apply movement if we have a significant distance to cover
        if ( velV.length2() > 0.001 ) {

          velV.normalize();

          velV.op_mul( this.movementSpeed );
          this.body.setLinearVelocity( velV );

        } else {

          var newVel = new Ammo.btVector3();
          newVel.setZero();
          this.body.setLinearVelocity( newVel );
        }

      } else {

        // Help the character get above the terrain and then apply up force
        this.body.translate( new Ammo.btVector3( 0, height * 0.1, 0 ) );
        this.body.applyCentralImpulse( new Ammo.btVector3( 0, this.jumpImpulse, 0 ) );

      }

    }

    this.jump = false;

  };

  // ---------------------------------------------------------------------------
  var updateRenderMatrix = (function() {

    var position = new THREE.Vector3();
    var rotation = new THREE.Quaternion();
    var euler = new THREE.Euler();

    return function( dt ) {

      // copy the rigid body transform to the render object transform
      var trans = this.body.getWorldTransform();
      var mat = this.object.matrixWorld;
      Ammo.Utils.b2three( trans, mat );

      if ( this.counterClockwise )
        this.turnAngle += dt * this.rotationSpeed * Math.PI / 180;
      if ( this.clockwise )
        this.turnAngle -= dt * this.rotationSpeed * Math.PI / 180;

      // Integrate the desired rotational changes
      position.set( mat.elements[ 12 ], mat.elements[ 13 ], mat.elements[ 14 ] );
      euler.set( 0, this.turnAngle, 0 );
      rotation.setFromEuler( euler );

      mat.makeRotationFromQuaternion( rotation );
      mat.setPosition( position );

    }

  })();

  // ---------------------------------------------------------------------------
  var updateGrounding = ( function() {

    var fromPoint = new Ammo.btVector3();
    var toPoint = new Ammo.btVector3();
    var rayPadding = height * 0.05;

    return function() {

      fromPoint.setValue(
        this.object.matrixWorld.elements[ 12 ],
        this.object.matrixWorld.elements[ 13 ],
        this.object.matrixWorld.elements[ 14 ]
      );
      toPoint.setValue( fromPoint.x(), fromPoint.y() - height / 2 - rayPadding, fromPoint.z() );

      var rayCallback = new Ammo.ClosestRayResultCallback( fromPoint, toPoint );

      this.world.rayTest( fromPoint, toPoint, rayCallback );
      this.isGrounded = rayCallback.hasHit();

      if ( this.isGrounded ) {

        currentGroundHeight = rayCallback.get_m_hitPointWorld().getY();      }

      }

  } )();

  // ---------------------------------------------------------------------------
  var init = function() {

    this.object.matrixAutoUpdate = false;

    // The total height is height + 2 * radius so we subtract out the extra
    var shape = new Ammo.btCapsuleShape( radius, height - 2 * radius );

    // slightly off the ground
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( Ammo.Utils.createAmmoVector3FromThree( character.position ) );

    localInertia = new Ammo.btVector3( 0, 0, 0 );

    var motionState = new Ammo.btDefaultMotionState( transform );
    var mass = 100;

    shape.calculateLocalInertia( mass, localInertia );

    var cInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape,localInertia );

    this.body = new Ammo.btRigidBody( cInfo );
    this.body.setWorldTransform( transform );
    this.body.setDamping( .5, 1 );

    // turns off all rotation
    this.body.setAngularFactor( new Ammo.btVector3( 0, 1, 0 ) );

    // keeps physics from going to sleep (from bullet documentation)
    var DISABLE_DEACTIVATION = 4;
    this.body.setActivationState( DISABLE_DEACTIVATION );
    dynamicsWorld.addRigidBody( this.body );

  }

  init.call( this );

}