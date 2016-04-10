/**
 * Setup the control method
 */

define([
       "three",
        "../libs/state-machine.min",
        "TWEEN",
        "scene",
        "debugGUI",
        "physics"
       ], function ( THREE, StateMachine, TWEEN, scene, debugGUI, physics ) {


    // DEBUG GUI
    var dg = debugGUI;

    var name = "Safe";
    if ( dg.__folders[ name ] ) {
        var folder = dg.__folders[ name ];
    } else {
        var folder = dg.addFolder( name );
    }

    // 'use strict';

    // states: open, closed, locked, unlocked
    // events: opening, closing, interact, unlock

    // var x = new THREE.Mesh( new THREE.BoxGeometry( 1, 2, 0.1 ), new THREE.MeshPhongMaterial( {visible: false } ) );
    // x.position.set( 0, 1, 0 );
    // scene.add( x );

    // safe
    physics.makeStaticBox(new THREE.Vector3(1,0.3,1), new THREE.Vector3(0,0,0), undefined );

    var safewheel, safegriff, safedoor;
    var safedoorGroup = new THREE.Group();
    var safemodel = new THREE.Group();
    scene.add( safemodel );
    safemodel.position.set ( 0, 0, 0 );

    var xoffset = 0.54;
    var yoffset = 0.24;
    var zoffset = 0.57;

    safedoorGroup.position.set( xoffset, yoffset, zoffset );

    safemodel.add( safedoorGroup );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
        // console.log( item, loaded, total );
    };
    manager.onError = function( XHR ) {
        console.log("Error", XHR );
    };
    manager.onLoad = function() {

        // safegroup.add( safe );
        // safegroup.add( safedoor );
        // safedoor.rotation.y = Math.PI / 2;

        // safegroup.traverse( function( object ) {
        //     // console.log( object );
        //     if ( object instanceof THREE.Mesh ) {
        //         // console.log("geometry", object.geometry );
        //     }
        // } );
        // safegroup.rotation.y = Math.PI/2;

        setupTweens();
       
    };


    var safeloader = new THREE.JSONLoader( manager ); 
    
    var onLoad = function() {

    };
    var onProgress = function( XHR ) {
        // console.log("onProgress", XHR );
    };
    var onError = function( XHR ) {
        console.log("Error", XHR );
    };

    function handleMesh( mesh ) {
        // scene.add( mesh );
        safemodel.add( mesh );
    }
 
    //safe
    // var url = "assets/models/safe/safe_joined.js";
    // safeloader.load( url, function callback(geometry, materials) {
    //     // safedoor = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        // safedoor.material.materials[ 2 ].shading = THREE.FlatShading;
    // }, onLoad, onProgress, onError );


    var url = "assets/models/safe/safe.js";
    safeloader.load( url, function callback(geometry, materials) {
        geometry.rotateY ( Math.PI / 2 );
        geometry.computeBoundingBox();
        var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );

        for ( var i = 0; i < materials.length; i ++ ) {
            var material = materials[ i ];
            // console.log( material );
            // material.shading = THREE.FlatShading;
        }
        // geometry.translate( xoffset, boundingBoxSize.y / 2, zoffset );

        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        mesh.position.set( 0, boundingBoxSize.y / 2, 0 );
        handleMesh( mesh ); 

    }, onLoad, onProgress, onError );

    // var safedoor;
    var url = "assets/models/safe/safe_great_door.js";
    safeloader.load( url, function callback(geometry, materials) {
        geometry.rotateY ( Math.PI / 2 );
        geometry.center();
        geometry.computeBoundingBox();
        var boundingBoxSize = geometry.boundingBox.max.sub( geometry.boundingBox.min );
        // console.log ( boundingBoxSize );

        geometry.translate( -boundingBoxSize.x / 2, 0, 0 );
        // for ( var i = 0; i < materials.length; i ++ ) {
        //     var material = materials[ i ];
        //     material.shading = THREE.FlatShading;
        // }
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        // mesh.position.set( xoffset + 0.55, 0.25, zoffset + 0.57 );
        mesh.position.set( 0, boundingBoxSize.y - 0.11, 0 );

        safedoor = mesh;
        handleMesh( mesh );

        safedoor = mesh;
        safedoorGroup.add( mesh );

    }, onLoad, onProgress, onError );     

    // big wheel
    var url = "assets/models/safe/safe_wheel.js";
    safeloader.load( url, function callback(geometry, materials) {
        geometry.rotateY ( Math.PI / 2 );
        // geometry.center();
        // geometry.translate( -0.531 + xoffset, 0.681 + 0.25, 0.106 + zoffset );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        mesh.position.set( - 0.54, 0.681, 0.106 );
        handleMesh( mesh );

        safewheel = mesh;
        safedoorGroup.add( mesh );

    }, onLoad, onProgress, onError ); 

    // griff
    var url = "assets/models/safe/safe_griff.js";
    safeloader.load( url, function callback(geometry, materials) {
        geometry.rotateY ( Math.PI / 2 );
        // geometry.translate( -0.8216, 1.2544 + 0.25, 0.04 );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        mesh.position.set( -0.832, 1.2624, 0.04 );
        handleMesh( mesh );

        safegriff = mesh;
        safedoorGroup.add( mesh );

    }, onLoad, onProgress, onError ); 


    /*
    function closeAnimation ( x, callback ) {
        new TWEEN.Tween( x.rotation ).to( {
            x: 0,
            y: 0,
            z: 0 }, 1000 )
            .easing( TWEEN.Easing.Sinusoidal.InOut )
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out)
            .onComplete(
                // callback
            )
            .start();
    }

    function openAnimation ( x, callback ) {
        new TWEEN.Tween( x.rotation ).to( {
            x: 0,
            y: Math.PI / 2,
            z: 0 }, 1000 )
            .easing( TWEEN.Easing.Sinusoidal.InOut )
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out)
            .onComplete(
                // callback
            )
            .start();
    }
    */

    fsm = StateMachine.create({

      initial: 'locked',
      events: [
        { name: 'reset', from: '*',  to: 'locked' },
        { name: 'open', from: ['closed','unlocked'], to: 'opened' },
        { name: 'close', from: 'opened', to: 'closed'   },
        { name: 'interact', from: 'closed', to: 'opened' },
        { name: 'interact', from: 'opened', to: 'closed' },
        { name: 'interact', from: 'locked', to: 'unlocked' },
        // { name: 'unlock', from: 'locked', to: 'unlocked' },
      ],
      callbacks: {
        onclosed: function(event, from, to, msg) { 

            // x.material.color.setHex( 0x00FF00 );
            // closeAnimation( x );

        },
        onopened: function() {

            console.log("onbeforeopen");
            // play sound
            // x.material.color.setHex( 0x00FFFF );
            // play animation
            // openAnimation( x );

        },
        onbeforeinteract: function(event, from, to) { 

            // console.log( "onbeforeinteract", this.current ); 
            
            // if ( this.is( "locked" ) ) {
            //     // alert("pause");
            //     // some UI action, minigame, unlock this shit

            // }
            
        },
        onlocked: function() {
            // x.material.color.setHex( 0xFF0000 );
        },
        onunlocked: function() {
            this.open();
        },
        onbeforereset: function() {
            if ( this.can ( "close" ) ) {
                this.close();
            }
        },
      }

    });

    
    folder.open();
    folder.add( fsm, "current" ).name("Current State").listen();
    folder.add( fsm, "interact" ).name("interact");
    folder.add( fsm, "reset" ).name("Reset");

    function setupTweens() {

        var time = 2000;
        var wheel = new TWEEN.Tween( safewheel.rotation ).to( {
            x: 0,
            y: 0,
            z: - Math.PI * 2 }, time )
            .easing( TWEEN.Easing.Sinusoidal.InOut );
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out)
            // .onComplete();
            // .start();

        var time = 2000;
        var door = new TWEEN.Tween( safedoorGroup.rotation ).to( {
            x: 0,
            y: Math.PI / 2,
            z: 0 }, time )
            // .easing( TWEEN.Easing.Sinusoidal.InOut );
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out ) // too much bounce
            .easing( TWEEN.Easing.Back.Out )
            // .onComplete();
            // .start();

        var time = 2000;
        var griff = new TWEEN.Tween( safegriff.rotation ).to( {
            x: 0,
            y: 0,
            z: Math.PI * 2 }, time )
            // .easing( TWEEN.Easing.Sinusoidal.InOut );
            .easing( TWEEN.Easing.Quadratic.InOut )
            // .easing( TWEEN.Easing.Elastic.Out )
            // .onComplete();
            // .start();

        // close
        var time = 2000;
        var close_wheel = new TWEEN.Tween( safewheel.rotation ).to( {
            x: 0,
            y: 0,
            z: Math.PI * 2 }, time )
            .easing( TWEEN.Easing.Sinusoidal.InOut );
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out)
            // .onComplete();
            // .start();

        var time = 1000;
        var close_door = new TWEEN.Tween( safedoorGroup.rotation ).to( {
            x: 0,
            y: 0,
            z: 0 }, time )
            // .easing( TWEEN.Easing.Sinusoidal.InOut );
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out )
            .easing( TWEEN.Easing.Quadratic.In )
            // .onComplete();
            // .start();

        // close_door.chain( close_wheel );      
        // wheel.chain( door );

        griff.chain( wheel );

        fsm.onopened = function() {
            close_door.stop();
            door.start();
        };
        fsm.onclosed = function( event, from, to ) {
            door.stop();
            close_door.start();
        };
        fsm.onleavelocked = function() {

            // dont start door opening tween
            // until unlocking animation has played
            wheel.onComplete( fsm.transition );
            griff.start();

            return StateMachine.ASYNC;
        };
        fsm.onbeforereset = function( event, from, to ) {

            if ( to !== "locked" && this.can ( "close" ) ) {
                this.close();
            }
            safedoorGroup.rotation.set ( 0, 0, 0 );
            safewheel.rotation.set( 0, 0, 0 );
            safegriff.rotation.set( 0, 0, 0 );
        },


        folder.add( griff, "start" ).name("unlock");
        folder.add( door, "start" ).name("open");
        folder.add( close_door, "start" ).name("close");
    }
    /*
    fsmKeypad = StateMachine.create({

      initial: 'locked',
      events: [
        { name: 'pressing', from: 'idle', to: 'pressed' },
        { name: 'idle', from: 'pressed', to: 'idle' },
        { name: 'grant', from: 'locked', to: 'unlocked'   },
        { name: 'deny', from: 'locked', to: 'locked' },
      ],
      callbacks: {
        onpressing: function(event, from, to, msg) {  },
        onidle: function(event, from, to, msg) {  },
        ongrant: function(event, from, to, msg) { console.log("granted", this.current ); },
        ondeny: function(event, from, to, msg) { console.log("deny", this.current ); },
      }
    });
    */

    return fsm;
});