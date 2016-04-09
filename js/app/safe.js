/**
 * Setup the control method
 */

define([
       "three",
        "../libs/state-machine.min",
        "TWEEN",
        "scene",
        "debugGUI"
       ], function ( THREE, StateMachine, TWEEN, scene, debugGUI ) {

    // 'use strict';

    // states: open, closed, locked, unlocked
    // events: opening, closing, interact, unlock

    var x = new THREE.Mesh( new THREE.BoxGeometry( 1, 2, 0.1 ), new THREE.MeshPhongMaterial() );
    x.position.set( 0, 1, 0 );
    scene.add( x );

    function closeAnimation ( x, callback ) {
        new TWEEN.Tween( x.rotation ).to( {
            x: 0,
            y: 0,
            z: 0 }, 1000 )
            .easing( TWEEN.Easing.Sinusoidal.InOut )
            // .easing( TWEEN.Easing.Quadratic.InOut)
            // .easing( TWEEN.Easing.Elastic.Out)
            .onComplete(
                callback
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
                callback
            )
            .start();
    }

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

            x.material.color.setHex( 0x00FF00 );
            closeAnimation( x, fsm.transition );

        },
        onopened: function() {

            console.log("onbeforeopen");
            // play sound
            x.material.color.setHex( 0x00FFFF );
            // play animation
            openAnimation( x, fsm.transition );

            // return StateMachine.ASYNC;

        },
        onbeforeinteract: function(event, from, to) { 

            console.log( "onbeforeinteract", this.current ); 
            
            if ( this.is( "locked" ) ) {
                // alert("pause");
                // some UI action, minigame, unlock this shit

            }
            
        },
        onlocked: function() {
            x.material.color.setHex( 0xFF0000 );
        },
        onunlocked: function() {
            this.open();
        },
        onbeforereset: function() {
            if ( ! this.is ( "closed" ) ) {
                this.close();
            }
        },
      }

    });

    // DEBUG GUI
    var dg = debugGUI;

    var name = "Safe";
    if ( dg.__folders[ name ] ) {
        var folder = dg.__folders[ name ];
    } else {
        var folder = dg.addFolder( name );
    }
    
    folder.open();
    folder.add( fsm, "current" ).name("Current State").listen();
    folder.add( fsm, "interact" ).name("interact");
    folder.add( fsm, "reset" ).name("Reset");

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

    return fsm;
});