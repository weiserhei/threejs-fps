/**
 * Setup the control method
 */

define([
       "three",
        "../libs/state-machine.min",
        "TWEEN",
        "scene"
       ], function ( THREE, StateMachine, TWEEN, scene ) {

    // 'use strict';

    // mesh

    // door mesh for interaction
    // base mesh

    // states: open, closed, locked, unlocked
    // events: opening, closing, interact, unlock

    var x = new THREE.Mesh( new THREE.BoxGeometry( 1, 2, 0.1 ) );
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
        // { name: 'close', from: '*',  to: 'closed' },
        { name: 'unlock', from: 'locked', to: 'unlocked' },
        { name: 'open', from: ['closed','unlocked'], to: 'opened' },
        { name: 'close', from: 'opened', to: 'closed'   },
        { name: 'interact', from: 'closed', to: 'opened' },
        { name: 'interact', from: 'locked', to: 'unlocked' },
        { name: 'interact', from: 'opened', to: 'closed' },
      ],
      callbacks: {
        onclose: function(event, from, to, msg) {  },
        onopen: function(event, from, to, msg) { console.log("open", this.current ); },
        onbeforeinteract: function(event, from, to) { 
            // console.log("onbeforeinteract");
            console.log( this.current ); 
            
            if ( this.is( "locked" ) ) {
                // alert("pause");
                // some UI action, keypad, whatever

            }
            
        },
        onunlocked: function(event, from, to, msg) {
            console.log("unlocked", this.current, msg );
            this.open();
            openAnimation( x, fsm.transition );

            return StateMachine.ASYNC;
            // this.onleaveclosed();
        },
        onleaveopened: function() {
            // assume when we leave 'opened'-state, we enter 'closed'
            // which is bad
            // console.log("onleaveopened");
            // play sound

            // play animation
            closeAnimation( x, fsm.transition );

            return StateMachine.ASYNC;

        },
        onleaveclosed: function() {
            // assume when we leave 'closed'-state, we enter 'opened'

            // console.log("onleaveclosed");
            // play sound

            // play animation
            openAnimation( x, fsm.transition );

            return StateMachine.ASYNC;

        }
      }

    });


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