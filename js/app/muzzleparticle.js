/**
 * Muzzleflash Particles
 */

define([ 
	"three",
	"ShaderParticleEngine",
	"debugGUI",
    "loadingManager",
    "scene"
], function ( THREE, SPE, debugGUI, loadingManager, scene ) {

    'use-strict';
    
	// Create particle group and emitter
    var loader = new THREE.TextureLoader( loadingManager );
    // var texture = loader.load('assets/textures/img/smokeparticle.png');
    var texture = loader.load('assets/textures/img/spark1.png');
    // var texture = loader.load('assets/textures/img/snowflake4.png');
    // var texture = loader.load('assets/textures/img/snowflake5.png');
    // var texture = loader.load('assets/textures/img/star.png');

	var particleGroup = new SPE.Group({
		texture: {
			value: texture
		},
        maxParticleCount: 2000
	});

	var emitter = new SPE.Emitter({
        type: SPE.distributions.SPHERE,
        activeMultiplier: 2,
        // direction: -1,
        duration: 0.07,
        maxAge: {
            // value: 0.4
            value: 0.05
        },
        position: {
            radius: 0.00, // attributes..emitters[0].position._radius
            value: new THREE.Vector3( 0, 0, 0 ),
            spread: new THREE.Vector3( 0.05, 0.05, 0.02 ),
            // distribution: SPE.distributions.BOX
            distribution: SPE.distributions.SPHERE
            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
            // clamp: 0.2,
            // randomise: true
        },

		size: {
			value: [ 0.1, 0.1, 0.02 ],
			// value: [ 0.4, 0.4, 0.08 ],
			spread: [ 0.1, 0, 0 ]
		},

        velocity: {
            // value: new THREE.Vector3( 0.4, 0, -10 ),
            value: new THREE.Vector3( 0.0, 0, -10 ),
            spread: new THREE.Vector3( 1, 0, 10.5 ),
            // distribution: SPE.distributions.DISC
            distribution: SPE.distributions.BOX
            // distribution: SPE.distributions.SPHERE
        },

        acceleration: {
            // value: new THREE.Vector3( 0.1, 0.05, -0.3 ),
            distribution: SPE.distributions.SPHERE,
            value: new THREE.Vector3( 5, 5, 2 ),
        },

        drag: {
            value: 0.3
        },

        color: {
            // value: [ new THREE.Color( "yellow" ), new THREE.Color( "white" ) ],
            // value: [ new THREE.Color( "white" ), new THREE.Color( "yellow" ) ],
            // spread: [ new THREE.Vector3( 0, 5, 0 ), new THREE.Vector3(0, 5, 0) ]

            value: [ new THREE.Color( 0xCCAA99 ), new THREE.Color( 0xf2fF00 ) ],
            spread: [ new THREE.Vector3( 1, 5, 0 ), new THREE.Vector3(1, 5, 0) ]
        },

        opacity: {
            value: [ 1, 0.1 ]
        },

        particleCount: 200
    });

	// particleGroup.addEmitter( emitter );
	particleGroup.addPool( 10, emitter, true);
    scene.add( particleGroup.mesh );

	return particleGroup;

});