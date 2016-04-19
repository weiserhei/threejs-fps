/**
 * Snow Particles
 */

define([ "three","ShaderParticleEngine", "debugGUI" ], function ( THREE, SPE, debugGUI ) {

    'use strict';

    // Create particle group and emitter
    function initParticles() {
        var loader = new THREE.TextureLoader();
        // var texture = loader.load('assets/textures/img/smokeparticle.png');
        // var texture = loader.load('assets/textures/img/snowflake4.png');
        // var texture = loader.load('assets/textures/img/snowflake5.png');
        var texture = loader.load('assets/textures/img/star.png');

    	var particleGroup = new SPE.Group({
    		texture: {
                value: texture
            }
    	});

        var emitter = new SPE.Emitter({
            type: 2,
            // activeMultiplier: 1,
            // direction: -1,
            // duration: 0.3,
            maxAge: {
                value: 0.4
            },
            position: {
                // value: new THREE.Vector3( 0, 0, 0 ),
                radius: 0.4, // attributes..emitters[0].position._radius
                spread: new THREE.Vector3( 0.1, 0.1, 0.1 )
                // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
                // clamp: 0.2,
                // randomise: true
            },

            velocity: {
                value: new THREE.Vector3( -1, -1, -1 ),
                // distribution: SPE.distributions.DISC
                distribution: SPE.distributions.SPHERE
            },

            acceleration: {
                value: new THREE.Vector3( -0.5, -0.5, -0.5 ),
                distribution: SPE.distributions.SPHERE
            },

            drag: {
                value: 0.4
            },

            color: {
                // value: [ new THREE.Color('green'), new THREE.Color('black') ]
                value: [ new THREE.Color( 0xd2ff00 ), new THREE.Color( 0xffc200) ]
            },

            opacity: {
                value: [ 0, 0.2, 0.4, 0.0 ]
            },

            size: {
                value: 0.05,
                spread: [ 0.1, 0.2, 0.1 ]
            },

            particleCount: 250
        });

// random durcheinander
/*
        var emitter = new SPE.Emitter({
            type: 2,
            // activeMultiplier: 1,
            // direction: -1,
            // duration: 0.3,
            maxAge: {
                value: 0.3
            },
            position: {
                // value: new THREE.Vector3( 0, 0, 0 ),
                radius: 0.0, // attributes..emitters[0].position._radius
                // spread: 1 === 1 ? new THREE.Vector3( 0.3, 0.3, 0.3 ) : undefined
                // spread: new THREE.Vector3( 0.01, 0.01, 0.01 )
                spread: new THREE.Vector3( 0.4, 0.4, 0.4 ),
                // clamp: 0.2,
                randomise: true
            },

            velocity: {
                value: new THREE.Vector3( -0.5, -0.5, -0.5 ),
                // distribution: SPE.distributions.DISC
                // distribution: SPE.distributions.SPHERE
            },

            acceleration: {
                value: new THREE.Vector3( 0.3, 0.3, 0.3 ),
                distribution: SPE.distributions.SPHERE
            },

            drag: {
                value: 0.5
            },

            color: {
                // value: [ new THREE.Color('green'), new THREE.Color('black') ]
                value: [ new THREE.Color( 0xd2ff00 ), new THREE.Color( 0xd2ff00) ]
            },

            opacity: {
                value: [ 0, 0.3, 0.5, 0.1 ]
            },

            size: {
                value: 0.05,
                spread: [ 0.1, 0.2, 0.1 ]
            },

            particleCount: 250
        });
*/
        // particleGroup.addEmitter( emitter );
        particleGroup.addPool( 10, emitter, true)


        function initDAT( group ) {
            var gui = debugGUI.getFolder( "Particle" ),
            // var gui = new dat.GUI(),
                keys = Object.keys( emitter ),
                vec3Components = ['x', 'y', 'z'],
                updateMaterial = function() {
                    group.material.needsUpdate = true;
                },
                i;

            var groupFolder = gui.addFolder( 'Group Settings' );

            groupFolder.add( group, 'textureLoop' ).min(1).max(10).step(1).onChange( function( value ) {
                group.uniforms.textureAnimation.value.w = value;
                updateMaterial();
            } );

            groupFolder.add( group, 'blending' ).min(0).max(5).step(1).onChange( function( value ) {
                group.material.blending = value;
                updateMaterial();
            } );
            groupFolder.add( group, 'colorize' ).onChange( function( value ) {
                group.defines.COLORIZE = value;
                updateMaterial();
            } );
            groupFolder.add( group, 'hasPerspective' ).onChange( function( value ) {
                group.defines.HAS_PERSPECTIVE = value;
                updateMaterial();
            } );
            groupFolder.add( group, 'transparent' ).onChange( function( value ) {
                group.material.transparent = value;
                updateMaterial();
            } );
            groupFolder.add( group, 'alphaTest' ).min(0).max(1).step(0.1).onChange( function( value ) {
                group.material.alphaTest = value;
                updateMaterial();
            }  );
            groupFolder.add( group, 'depthWrite' ).onChange( function( value ) {
                group.material.depthWrite = value;
                updateMaterial();
            }  );
            groupFolder.add( group, 'depthTest' ).onChange( function( value ) {
                group.material.depthTest = value;
                updateMaterial();
            }  );

            var positionFolder = gui.addFolder( 'Position' );
            var positionValue = positionFolder.addFolder( 'Value' );
            var positionSpread = positionFolder.addFolder( 'Spread' );
            var positionSpreadClamp = positionFolder.addFolder( 'Spread Clamp');

            for( i = 0; i < vec3Components.length; ++i ) {
                positionValue.add( emitter.position.value, vec3Components[ i ], -10, 10 ).listen().onChange( function() {
                    emitter.position.value = emitter.position.value;
                } );
                positionSpread.add( emitter.position.spread, vec3Components[ i ], -10, 10 ).listen().onChange( function() {
                    emitter.position.spread = emitter.position.spread;
                } );
                positionSpreadClamp.add( emitter.position.spreadClamp, vec3Components[ i ], -5, 5 ).listen().onChange( function() {
                    emitter.position.spreadClamp = emitter.position.spreadClamp;
                } );
            }

            positionFolder.add( emitter.position, 'radius', 0, 5 ).listen();
            positionFolder.add( emitter.position, 'randomise' ).listen();

            var velocityFolder = gui.addFolder( 'Velocity' );
            var velocityValue = velocityFolder.addFolder( 'Value' );
            var velocitySpread = velocityFolder.addFolder( 'Spread' );

            for( i = 0; i < vec3Components.length; ++i ) {
                velocityValue.add( emitter.velocity.value, vec3Components[ i ], -50, 50 ).listen().onChange( function() {
                    emitter.velocity.value = emitter.velocity.value;
                } );
                velocitySpread.add( emitter.velocity.spread, vec3Components[ i ], -50, 50 ).listen().onChange( function() {
                    emitter.velocity.spread = emitter.velocity.spread;
                } );
            }
            velocityFolder.add( emitter.velocity, 'randomise' ).listen();

            var accelerationFolder = gui.addFolder( 'Acceleration' );
            var accelerationValue = accelerationFolder.addFolder( 'Value' );
            var accelerationSpread = accelerationFolder.addFolder( 'Spread' );

            for( i = 0; i < vec3Components.length; ++i ) {
                accelerationValue.add( emitter.acceleration.value, vec3Components[ i ], -50, 50 ).listen().onChange( function() {
                    emitter.acceleration.value = emitter.acceleration.value;
                } );
                accelerationSpread.add( emitter.acceleration.spread, vec3Components[ i ], -50, 50 ).listen().onChange( function() {
                    emitter.acceleration.spread = emitter.acceleration.spread;
                } );
            }

            accelerationFolder.add( emitter.acceleration, 'randomise' ).listen();


            var colors = {
                'Step 1': '#ffffff',
                'Step 2': '#ffffff',
                'Step 3': '#ffffff',
                'Step 4': '#ffffff'
            };

            var colorFolder = gui.addFolder( 'Color steps' );
            colorFolder.addColor(colors, 'Step 1' ).onChange( function( value ) {
                emitter.color.value[ 0 ].setStyle( value );
                emitter.color.value = emitter.color.value;
            } );
            colorFolder.addColor(colors, 'Step 2' ).onChange( function( value ) {
                emitter.color.value[ 1 ].setStyle( value );
                emitter.color.value = emitter.color.value;
            } );
            colorFolder.addColor(colors, 'Step 3' ).onChange( function( value ) {
                emitter.color.value[ 2 ].setStyle( value );
                emitter.color.value = emitter.color.value;
            } );
            colorFolder.addColor(colors, 'Step 4' ).onChange( function( value ) {
                emitter.color.value[ 3 ].setStyle( value );
                emitter.color.value = emitter.color.value;
            } );

            var opacities = {
                'Step 1': emitter.opacity.value[0],
                'Step 2': emitter.opacity.value[1],
                'Step 3': emitter.opacity.value[2],
                'Step 4': emitter.opacity.value[2]
            };
            var opacityFolder = gui.addFolder( 'Opacity steps' );
            opacityFolder.add( opacities, 'Step 1' ).min(0).max(1).step(0.01).listen().onChange( function( value ) {
                emitter.opacity.value[ 0 ] = value;
                emitter.opacity.value = emitter.opacity.value;
            } );
            opacityFolder.add( opacities, 'Step 2' ).min(0).max(1).step(0.01).listen().onChange( function( value ) {
                emitter.opacity.value[ 1 ] = value;
                emitter.opacity.value = emitter.opacity.value;
            } );
            opacityFolder.add( opacities, 'Step 3' ).min(0).max(1).step(0.01).listen().onChange( function( value ) {
                emitter.opacity.value[ 2 ] = value;
                emitter.opacity.value = emitter.opacity.value;
            } );
            opacityFolder.add( opacities, 'Step 4' ).min(0).max(1).step(0.01).listen().onChange( function( value ) {
                emitter.opacity.value[ 3 ] = value;
                emitter.opacity.value = emitter.opacity.value;
            } );
        }

        // initDAT( particleGroup );

        return particleGroup;

    }

    return initParticles;
        
});