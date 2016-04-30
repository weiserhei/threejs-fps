/**
 * Muzzleflash Particles
 */

define([ 
	"three",
	"ShaderParticleEngine",
	"debugGUI",
    "loadingManager"
], function ( THREE, SPE, debugGUI, loadingManager ) {

	// Create particle group and emitter
    var loader = new THREE.TextureLoader( loadingManager );

    // Impact Puffs
    var velocityMagnitude = 0.3;
    // var velocitySpread = new THREE.Vector3( 0.6666666666666665, 0.3555555555555554, 0.5222222222222223 );
    var velocitySpread = new THREE.Vector3( 0.2, 0, 0.2 );

    var texture = loader.load("assets/textures/img/fx_smoke.png");
    // Create particle group

    var particleGroup = new SPE.Group({
        texture: {
            value: texture
        },
        blending: THREE.NormalBlending
    });

    particleGroup.setNormal = function( x, y, z ) {
        var v = velocityMagnitude;
        // console.log(this);
        // this is setting velocity for all emitters in the pool
        // this.emitters[0].velocity.set( x * v, y * v, z * v );
        // console.log( this.emitters[0] );

        for ( var i = 0; i < this.emitters.length; i ++ ) {
            // particleGroup.emitters[ i ].size.value = [ 0.3, 0.3, 0.1 ];
            // particleGroup.emitters[ i ].position.value = new THREE.Vector3( 0, 0.5, 0 );
            this.emitters[ i ].velocity.value = new THREE.Vector3( x * v, y * v, z * v );
            // particleGroup.emitters[ i ].position.spread = new THREE.Vector3( 0.2, 0.2, 0.1 );
            // particleGroup.emitters[ i ].acceleration.value = new THREE.Vector3( 10, 10, 2 );
        }

    };

    var emitter = new SPE.Emitter({

        type: SPE.distributions.CUBE,
        // activeMultiplier: 4,
        // direction: -1,
        duration: 0.02,
        maxAge: {
            value: 1
        },
        position: {
            // radius: 0.01, // attributes..emitters[0].position._radius
            value: new THREE.Vector3( 0, 0, 0 ),
            spread: new THREE.Vector3( 0.05, 0.05, 0.05 ),
            // distribution: SPE.distributions.BOX
            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
            // clamp: 0.2,
            // randomise: true
        },

        size: {
            value: [ 0.2, 0.6, 0.8 ],
            // spread: [ 0, 0, 0 ]
        },

        velocity: {
            value: new THREE.Vector3( 0, velocityMagnitude, 0 ),
            spread: velocitySpread,
            // distribution: SPE.distributions.DISC
            // distribution: SPE.distributions.BOX
            // distribution: SPE.distributions.SPHERE
        },

        acceleration: {
            value: new THREE.Vector3( 0, -0.1, 0 ),
            // distribution: SPE.distributions.SPHERE
            // distribution: SPE.distributions.BOX
        },

        // drag: {
        //     value: 0.3
        // },

        color: {
            // value: [ new THREE.Color( 0xc8bb93 ), new THREE.Color( 0xffffff ) ],
            value: [ new THREE.Color( 0xc8bb93 ), new THREE.Color( 0xc8bb93 ) ],
            // spread: [ new THREE.Vector3( 0, 5, 0 ), new THREE.Vector3(0, 10, 0) ]
        },

        opacity: {
            value: [ 0.1, 0.05, 0.0 ],
            spread: [ 0.10556, 0.05, 0 ]
        },

        particleCount: 50

    });

	// particleGroup.addEmitter( emitter );
	particleGroup.addPool( 10, emitter, true);

	return particleGroup;

});