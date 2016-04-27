function init() {

    // 'use strict';

    var clock = new THREE.Clock();
    var delta;

    var scene = new THREE.Scene();

	// RENDERER
	var renderer = new THREE.WebGLRenderer( { antialias:true } ); 
	renderer.setSize( screen_width, screen_height );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	var container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );

    // CAMERA
    var screen_width    = window.innerWidth;
    var screen_height   = window.innerHeight;
    var aspect = screen_width / screen_height;
    // var view_angle  = 25;
    var view_angle  = 60;
    var near = 0.1;
    var far = 2200;
    
    var camera  = new THREE.PerspectiveCamera( view_angle, aspect, near, far );
    camera.position.set( 0, 0.3, 0.3 );
    // CAMERA INITIAL POSITION
    // camera.lookAt( new THREE.Vector3( 0, 20, 0) );   
    // scene.add( camera );

    var al = new THREE.AmbientLight( 0x555555 );
    scene.add( al );

	var callback    = function(){

	    var width = window.innerWidth;
	    var height = window.innerHeight;
	    
	    // notify the renderer of the size change
	    renderer.setSize( width, height );
	    // update the camera
	    camera.aspect = width / height;
	    camera.updateProjectionMatrix();

	}

	window.addEventListener( 'resize', callback, false );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );

	// GRID FOR ORIENTATION
	var gridXZ = new THREE.GridHelper( 1, 0.1 );
	gridXZ.setColors( new THREE.Color( 0xff0000 ), new THREE.Color( 0xffffff ) );
	gridXZ.material.transparent = true;
	gridXZ.material.opacity = 0.5;
	scene.add(gridXZ);
	gridXZ.position.y = 0;
	gridXZ.visible = true;

	particle = particles();
	scene.add( particle.mesh );

	// MAIN LOOP
	var animate = function () {

		delta = clock.getDelta();

		particle.tick( delta );

		controls.update();

		renderer.render( scene, camera );
		requestAnimationFrame( animate );

	};

	animate();
}

function particles() {

	// Create particle group and emitter
	function initParticles() {
	    var loader = new THREE.TextureLoader();
	    // var texture = loader.load('assets/textures/img/smokeparticle.png');
	    var texture = loader.load('assets/textures/img/spark1.png');
	    // var texture = loader.load('assets/textures/img/snowflake4.png');
	    // var texture = loader.load('assets/textures/img/snowflake5.png');
	    // var texture = loader.load('assets/textures/img/star.png');

		var particleGroup = new SPE.Group({
			texture: {
				value: texture
			}
		});

		// var emitterSettings = {
		// 	// type: 'sphere',
		// 	// radius: 0.1,
		// 	// speed: 1,
			
		// 	position: new THREE.Vector3( 0, 0, 0 ),
		// 	positionSpread: new THREE.Vector3( 0.05,0.05,0.05 ),
			
		// 	sizeStart: 0.1,
		// 	sizeStartSpread:0.1,
		// 	sizeEnd: 0.02,
			
		// 	// acceleration: new THREE.Vector3( 0, 1, -10 ),
		// 	// accelerationSpread: new THREE.Vector3( 4, 2, 0.1 ),

		// 	velocity: new THREE.Vector3(0.4, 0, -10),
		// 	velocitySpread: new THREE.Vector3(2, 1, 10.5),

		// 	opacityStart: 1,
		// 	opacityEnd: 0.1,
		// 	colorStart: new THREE.Color('yellow'),
		// 	colorStartSpread: new THREE.Vector3(0, 5, 0),
		// 	colorEnd: new THREE.Color('white'),
		// 	colorEndSpread: new THREE.Vector3(0, 10, 0),
		// 	particleCount: 200,
		// 	alive: 0,
		// 	duration: .025
		// };

		// old style muzzle flash
		var emitter = new SPE.Emitter({
	        type: SPE.distributions.SPHERE,
	        activeMultiplier: 4,
	        // direction: -1,
	        duration: 0.08,
	        maxAge: {
	            // value: 0.4
	            value: 0.025
	        },
	        position: {
	            // radius: 0.01, // attributes..emitters[0].position._radius
	            value: new THREE.Vector3( 0, 0, 0 ),
	            spread: new THREE.Vector3( 0.05, 0.05, 0.05 ),
	            distribution: SPE.distributions.BOX
	            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
	            // clamp: 0.2,
	            // randomise: true
	        },

			size: {
				value: [ 0.1, 0.1, 0.02 ],
				spread: [ 0.1, 0, 0 ]
			},

	        velocity: {
	            value: new THREE.Vector3( 0.4, 0, -10 ),
	            spread: new THREE.Vector3( 2, 1, 10.5 ),
	            // distribution: SPE.distributions.DISC
	            distribution: SPE.distributions.BOX
	            // distribution: SPE.distributions.SPHERE
	        },

	        acceleration: {
	            // value: new THREE.Vector3( 0.1, 0.05, -0.3 ),
	            // value: new THREE.Vector3( 0.1, 0.1, 0.1 ),
	            // distribution: SPE.distributions.SPHERE
	        },

	        drag: {
	            // value: 0.3
	        },

	        color: {
	            value: [ new THREE.Color( "yellow" ), new THREE.Color( "white" ) ],
	            spread: [ new THREE.Vector3( 0, 5, 0 ), new THREE.Vector3(0, 10, 0) ]
	        },

	        opacity: {
	            value: [ 1, 0.1 ]
	        },

	        particleCount: 200
	    });


/*
// SUPERCHARGE
		var emitter = new SPE.Emitter({
	        type: SPE.distributions.SPHERE,
	        // activeMultiplier: 1,
	        direction: -1,
	        // duration: 0.3,
	        maxAge: {
	            value: 0.4
	            // value: 0.07
	        },
	        position: {
	            radius: 0.01, // attributes..emitters[0].position._radius
	            value: new THREE.Vector3( 0, 0, 0 ),
	            spread: new THREE.Vector3( 0.05, 0.05, 0.05 )
	            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
	            // clamp: 0.2,
	            // randomise: true
	        },

			size: {
				value: [ 0.1, 0.1, 0.02 ],
				spread: [ 0.1, 0, 0 ]
			},

	        velocity: {
	            value: new THREE.Vector3( 0.4, 0, -10 ),
	            spread: new THREE.Vector3(2, 1, 10.5)
	            // distribution: SPE.distributions.DISC
	            // distribution: SPE.distributions.SPHERE
	        },

	        // acceleration: {
	        //     value: new THREE.Vector3( -0.5, -0.5, -0.5 ),
	        //     distribution: SPE.distributions.SPHERE
	        // },

	        drag: {
	            // value: 0.4
	        },

	        color: {
	            // value: [ new THREE.Color('green'), new THREE.Color('black') ]
	            value: [ new THREE.Color( 0xd2ff00 ), new THREE.Color( 0xffffff) ],
	            spread: [ new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0) ]
	        },

	        opacity: {
	            // value: [ 0, 0.2, 0.4, 0.0 ]
	            value: [ 1, 1, 0.1 ]
	        },

	        particleCount: 200
	    });
*/

	/*
		// new muzzle flash
	    var emitter = new SPE.Emitter({
	        type: SPE.distributions.SPHERE,
	        activeMultiplier: 4,
	        // direction: -1,
	        duration: 0.08,
	        maxAge: {
	            // value: 0.4
	            value: 0.2
	        },
	        position: {
	            // radius: 0.01, // attributes..emitters[0].position._radius
	            value: new THREE.Vector3( 0, 0, 0 ),
	            spread: new THREE.Vector3( 0.03, 0.03, 0.00 ),
	            distribution: SPE.distributions.BOX
	            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
	            // clamp: 0.2,
	            // randomise: true
	        },

			size: {
				value: [ 0.15, 0.07, 0.01 ],
				spread: [ 0.05, 0.04, 0 ]
			},

	        velocity: {
	            // value: new THREE.Vector3( 0.4, 0, -10 ),
	            // spread: new THREE.Vector3(2, 1, 10.5)
	            // value: new THREE.Vector3( 0.0, 0, 0.5 ),
	            value: new THREE.Vector3( 0.0, 0, -1 ),
	            spread: new THREE.Vector3( 0, 0.1, 0.2 ),
	            // distribution: SPE.distributions.DISC
	            distribution: SPE.distributions.BOX
	            // distribution: SPE.distributions.SPHERE
	        },

	        acceleration: {
	            // value: new THREE.Vector3( 0.1, 0.05, -0.3 ),
	            value: new THREE.Vector3( 0.1, 0.1, 0.1 ),
	            distribution: SPE.distributions.SPHERE
	        },

	        drag: {
	            value: 0.3
	        },

	        color: {
	            // value: [ new THREE.Color('green'), new THREE.Color('black') ]
	            // value: [ new THREE.Color( 0xCCAA55 ), new THREE.Color( 0xf2fF00 ) ],
	            // value: [ new THREE.Color( 0xAA8844 ), new THREE.Color( 0xf2fF00 ) ],
	            value: [ new THREE.Color( 0x996622 ), new THREE.Color( 0xf2f200 ), new THREE.Color( 0xf2fF00 ) ],
	            spread: [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0) ]
	        },

	        opacity: {
	            // value: [ 0, 0.2, 0.4, 0.0 ]
	            value: [ 1, 1, 0.1 ]
	        },

	        particleCount: 200
	    });
	*/

		// particleGroup.addEmitter( emitter );
		particleGroup.addPool( 10, emitter, true);

		return particleGroup;

	}

	return initParticles();

}