/**
 * 
 */

define([
       "three",
       "scene"
       ], function (THREE,scene){

	'use strict';
 
	var PointerLockControls = function ( camera, domElement, player ) {

		var scope = this;

		var player = player;

		camera.rotation.set( 0, 0, 0 );

		var pitchObject = new THREE.Object3D();
		pitchObject.add( camera );

		// Y-Rotation is set to the player mesh which the pitchObject is added to
		// var yawObject = new THREE.Object3D();
		// yawObject.add( pitchObject );

		var PI_2 = Math.PI / 2;

		this.enabled = false;
		var yRotation = pitchObject.rotation.y;

		// var yRotation = new THREE.Quaternion();
		// yRotation.set( 0, pitchObject.rotation.y, 0, 0 );

		this.forward = false;
		this.back = false;
		this.left = false;
		this.right = false;
		this.spacebar = false;
		this.shift = false;
		
		var onMouseMove = function ( event ) {

			if ( scope.enabled === false ) return;

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			// yawObject.rotation.y -= movementX * 0.002;
			yRotation -= movementX * 0.002;

			pitchObject.rotation.x -= movementY * 0.002;
			// limit movement
			pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
			// console.log("mousemove", yRotation);

		};

		var onMouseDown = function ( event ) {
			event.preventDefault();
			if ( scope.enabled === false ) return;
			
				switch ( event.button ) {

					case 0:
						// env.player.LMB();
						// player.LMB();
						break;
					case 1:
					case 2:
						// env.player.RMB();
						// player.RMB();
						break;
				}
				
		}
		
		function MouseWheelHandler(e) {

			// cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
			
			// env.player.selectWeapon( delta );
			// player.selectWeapon( delta );

			return false;
		}

		var onKeyDown = function ( event ) {
		// console.log(event.keyCode);
			switch ( event.keyCode ) {

				case 70: //f
					// slowmo = !slowmo;
					break;

				case 9: //tabulator
					// event.preventDefault();
					// var x = document.getElementById("centerDiv");
					// centerDiv.style.cssText="visibility:visible;"
					break;

				case 38: // up
				case 87: // w
					scope.forward = true;
					// moveForward = true;
					break;

				case 37: // left
				case 65: // a
					scope.left = true;
					// moveLeft = true; 
					break;

				case 40: // down
				case 83: // s
					scope.back = true;
					break;

				case 39: // right
				case 68: // d
					scope.right = true;
					// moveRight = true;
					break;

				case 32: // space
					scope.spacebar = true;
					break;
					
				case 16: // shift
					scope.shift = true;
					break;				
					
				case 70: // f
					// fullscreen();
					break;			
					
				case 69: // e
					// env.player.action();
					// player.action();
					// action.call( this );
					break;
					
				case 81: // q
					// moonPhysics(); //various.js
					break;
					
				case 82: // r
					// env.player.currentWeapon.reload();
					// player.currentWeapon.reload();
					break;
					
				case 49: //1
					// selectWeapon( 0 );
					break;

				case 50: //2
					// selectWeapon( 1 );
					break;

				case 51: //3
					// selectWeapon( 2 );
					break;		

				case 52: //4
					// selectWeapon( 3 );
					break;
			}

		};

		var onKeyUp = function ( event ) {
		
			switch( event.keyCode ) {

				case 9: // tab
					// centerDiv.style.cssText="visibility:hidden;"
					break;

				case 38: // up
				case 87: // w
					scope.forward = false;
					// moveForward = false;
					break;

				case 37: // left
				case 65: // a
					scope.left = false;
					// moveLeft = false;
					break;

				case 40: // down
				case 83: // s
					scope.back = false;
					// moveBackward = false;
					break;

				case 39: // right
				case 68: // d
					scope.right = false;
					// moveRight = false;
					break;
					
				case 16: // shift
					scope.shift = false;
					// scope.shift = false;
					break;
					
				case 32: // space
					break;
					
				case 69: //e
					// env.player.toggle = false;
					// player.toggle = false;
					break;

			}

		};


		if ( document.addEventListener ) {
		// IE9, Chrome, Safari, Opera
			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mousedown', onMouseDown, false );
			document.addEventListener( 'keydown', onKeyDown, false );
			document.addEventListener( 'keyup', onKeyUp, false );

			document.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
			document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}
		// IE 6/7/8
		else document.attachEvent("onmousewheel", MouseWheelHandler);

		this.resetRotation = function() {
			this.setYRotation( 0 );
			pitchObject.rotation.x = 0;
		}

		this.getObject = function () {

			return pitchObject;
			// return yawObject;

		};

		this.getYRotation = function () {
			// console.log("mousemove", yRotation );
			return yRotation;
		}

		this.setYRotation = function ( value ) {
			yRotation = value;
		}



		fullscreen( this, domElement );

		function fullscreen( controls, container ) {

			var div = document.createElement('div');
			div.id ="blocker";
			div.style = "background: transparent";
			document.body.insertBefore( div, container );

			var div2 = document.createElement('div');
			div2.innerHTML = '<span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)';
			div2.id ="instructions";
			div2.style = "opacity:0.5"
			div.appendChild( div2 );

			// var blocker = document.getElementById( 'blocker' );
			// var instructions = document.getElementById( 'instructions' );
			var blocker = div;
			var instructions = div2;
			
			// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			if ( havePointerLock ) {
				
				var element = document.body;
				// var element = window;

				var pointerlockchange = function ( event ) {

					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

						// controlsEnabled = true;
						controls.enabled = true;

						blocker.style.display = 'none';

					} else {

						controls.enabled = false;

						blocker.style.display = '-webkit-box';
						blocker.style.display = '-moz-box';
						blocker.style.display = 'box';

						instructions.style.display = '';

					}

				};

				var pointerlockerror = function ( event ) {

					instructions.style.display = '';

				};

				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.addEventListener( 'click', function ( event ) {

					instructions.style.display = 'none';

					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

					if ( /Firefox/i.test( navigator.userAgent ) ) {

						var fullscreenchange = function ( event ) {

							if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

								document.removeEventListener( 'fullscreenchange', fullscreenchange );
								document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

								element.requestPointerLock();
							}

						};

						document.addEventListener( 'fullscreenchange', fullscreenchange, false );
						document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

						element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

						element.requestFullscreen();

					} else {

						element.requestPointerLock();

					}

				}, false );

			} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

			}

		}


	};

	return PointerLockControls;

});