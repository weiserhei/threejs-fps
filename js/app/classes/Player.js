/**
* Player
* can raycast to interact with objects
* has Inventar
*
* Todo
* oh god that flashlight - ECS Systen
*
*/
var spotLightHelper;
define([
	"three",
	"classes/Item",
	"classes/Itemslot",
	"debugGUI",
	"controls",
	"scene",
	"classes/Inventar",
	"camera",
	"physics",
	"sounds"
], function ( THREE, Item, Itemslot, debugGUI, controls, scene, Inventar, camera, physics, sounds ) {

	'use strict';

	function isAnyObject(value) {
		return value != null && (typeof value === 'object' || typeof value === 'function');
	}
	function isFunction(v){if(v instanceof Function){return true;}};

	var intersections = [];
	var interactionDistance = 1.8;
	var raycaster = new THREE.Raycaster();
	// var vector = new THREE.Vector2(); // used for raycaster.setFromCamera
	var origin = new THREE.Vector3();
	var direction = new THREE.Vector3();

	function Player( hud ) {

		this.tools = {};
		this.tools.flashlight = {};

		var playerMesh = controls.getControls().getObject();
		this.playerMesh = playerMesh;

		var flashlight = new THREE.SpotLight( 0xf1ffb1, 0 ); //0xFFFFFF //0x44ffaa mystic green 500, 4 0xCCFF88
		flashlight.angle = 40 * Math.PI / 180;
		flashlight.distance = 15;
		flashlight.penumbra = 0.5;
		flashlight.decay = 1.5;
		// flashlight.position.set( 0.1, -0.2, -0.2 );	
		flashlight.position.set( 0.1, -0.1, 0.1 );
		flashlight.castShadow = true;

		spotLightHelper = new THREE.SpotLightHelper( flashlight );
		scene.add( spotLightHelper );
		spotLightHelper.updateMatrixWorld();
		spotLightHelper.visible = false;

		// sun.shadowBias = 50;
		// sun.shadowCameraFov = 60;
		flashlight.shadow.camera.near = 0.01;
		flashlight.shadow.camera.far = 30;
		// sun.shadowMapWidth = sun.shadowMapHeight = 1024;
		// flashlight.shadowDarkness = 0.5;

		this.flashlight = flashlight;

		playerMesh.add( flashlight );
		flashlight.target.position.set( 0, 0, -10 );
		playerMesh.add( flashlight.target );

		var spt = flashlight;
		var gui = debugGUI.getFolder("Flashlight");
		buildGui();
		playerMesh.updateMatrixWorld();
		spotLightHelper.update();

		function buildGui() {

			gui.addThreeColor( flashlight, "color" );
			gui.add( flashlight, "intensity" ).min( 0 ).max( 5 );
			gui.add( flashlight, "distance" ).min( 0 ).max( 20 );
			gui.add( flashlight, "angle" ).min( 0 ).max( Math.PI / 2 ).onChange( update );
			gui.add( flashlight, "penumbra" ).min( 0 ).max( 1 );
			gui.add( flashlight, "decay" ).min( 0 ).max( 100 );
			gui.add( spotLightHelper, "visible" ).name("Helper visible");

			function update() {
				spotLightHelper.update();
			}

		}

		var options = {
			energy: 50
		};
		var folder = debugGUI.getFolder("Shoot me Up");
		folder.open();
		folder.add( options, "energy" ).min( 1 ).max( 100 );


		function shoot( target ) {

			console.log( target );
			var normal = target.normal;
			var body = target.object;
			var point = target.point;

			var pP = camera.getWorldPosition();
			// var invertPos = new THREE.Vector3();
			var vec = new THREE.Vector3( point.x, point.y, point.z );
			var invertPos = vec.clone().sub( pP ).normalize();

			// body.applyForceAtWorldPoint ( normal, point )
			// body.applyForceAtLocalPoint( normal, point );
			invertPos.multiplyScalar( options.energy );
			body.applyImpulse( invertPos );

			sounds.positional.bow.bow.play();

		}

		// hud.x = hud.box( "end: " );
		// hud.x2 = hud.box( "start: " );
		// hud.x2.style.bottom = "50px";
		// hud.x2.show( true );
		// hud.x.show( true );


		function gun() {


			if ( sounds.railgun.isPlaying ) {
				// sounds.railgun.stop();
			}
			sounds.railgun.isPlaying = false;
			// sounds.railgun.stop();
			sounds.railgun.play();

			// var pP = controls.getControls().getObject().getWorldPosition();
			var pP = camera.getWorldPosition();
			var start = new Goblin.Vector3( pP.x, pP.y, pP.z );

			// var direction = new THREE.Vector3( 0, 0, 1 );
			// direction = direction.applyMatrix4( camera.matrixWorld );

			// hud.x2.setText( direction.x + "/"+ direction.y + "/"+ direction.z );

			var startPos = pP;
			var direction = camera.getWorldDirection();
			var distance = 20;

			var newPos = new THREE.Vector3();
			newPos.addVectors ( startPos, direction.multiplyScalar( distance ) );

			// scene.remove( arrowHelper );
			// var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
			// var arrowHelper = new THREE.ArrowHelper( direction, pP, 5, 0xFF0000 );
			// scene.add( arrowHelper );

			// var btRayToPoint = camera.getWorldPosition().clone().add( camera.getWorldDirection().clone().multiplyScalar( distance ) );
			var btRayToPoint = newPos;

			// var btRayToPoint = new THREE.Vector3( 0, 0, -distance ).applyMatrix4( controls.getControls().getObject().matrixWorld )
			// hud.x.setText( btRayToPoint.x + " " + btRayToPoint.y + " "+ btRayToPoint.z );
			// hud.x2.setText( start.x + " " + start.y + " "+ start.z );

			var end = new Goblin.Vector3( btRayToPoint.x, btRayToPoint.y, btRayToPoint.z );

			// var end = new Goblin.Vector3( 0, 0, 0 );
			// console.log( start, end );
			var intersections = physics.getWorld().rayIntersect( start, end );
			// todo
			// dont intersect with player cylinder -.-
			if ( intersections.length > 1 ) {

				var target = intersections[ 0 ];
				shoot( target );
			}
			
		}

		this.target = undefined;
		this.hud = hud;

		this.inventar = new Inventar();


		var toggle = false; // toggle key down

		document.addEventListener('keydown', onDocumentKeyDown.bind( this ), false);
		document.addEventListener('keyup', onDocumentKeyUp, false);

		function onDocumentKeyDown(event){

			event = event || window.event;
			var keycode = event.keyCode;
			// console.log( keycode );
			// var character = String.fromCharCode( event.keyCode );

			switch( keycode ) {
				case 69: //E
					// execute only once on keydown, until reset
					if( toggle ) { return; }
					toggle = !toggle;

					this.interact();

					break;

				case 70: //F
					
					this.use();

					break;
			}

		}

		function onDocumentKeyUp(event){

			event = event || window.event;
			var keycode = event.keyCode;

			switch( keycode ) {
				case 69 : //E
				// execute only once on keydown, until reset
				toggle = false;
				break;
			}

		}

		document.body.addEventListener( "mousedown", handleMouseDown );
		function handleMouseDown( event ) {
			if ( event.button === 0 ) {
				gun();
			} else {

			}
		}

	}

	Player.prototype.use = function() {

		var hudElement = this.hud.infoText;
		if ( hudElement.visible ) {
			hudElement.fadeOut();
		}

		if ( this.tools.flashlight.pickedUp ) {
			this.tools.flashlight.toggle();
		}

	};

	Player.prototype.interact = function() {

		var object = this.target;
		// dont do nuffin if no object is in target
		if ( object === undefined ) {
			return false;
		}

		// var hudElement = this.hud.interactionText;
		var hudElement = this.hud.infoText;
		// console.log( object );
		var interact = object.userData.interact;

		if ( object.userData.fsm !== undefined ) {
			var fsm = object.userData.fsm;

			if ( isFunction( fsm.interact ) ) {
				fsm.interact();
			}

		} else if ( object.userData instanceof Item ) {

			if ( isFunction( object.userData.interact ) ) {
				object.userData.interact( hudElement );
				this.inventar.addItem( object.userData );
			}

		} else if ( object.userData instanceof Itemslot ||
		        
		        isFunction( object.userData.interact ) ) {

				object.userData.interact( this.inventar );

		} else {

			console.warn("Object has no interaction", object );

		}

	};

	// Player.prototype.raycast = (function() {
	// 	console.log("once");
	// 	return function( objects ) {
	// 		console.log("loop");
	// 	};
	// })();

	Player.prototype.raycast = function( objects ) {

		// pitchObject (parent of camera in First person mode)
		origin.copy( controls.getControls().getObject().getWorldPosition() );
		// direction.set( 0, 0, - 1 ).normalize(); // direction vector must have unit length
		direction.copy( camera.getWorldDirection() );
		raycaster.set( origin, direction );
		intersections = raycaster.intersectObjects( objects, false );
		// raycaster.setFromCamera( vector, camera );
		// intersections = raycaster.intersectObjects( objects );

		// scene.remove( arrowHelper );
		// // var arrowHelper = new THREE.ArrowHelper( camera.getWorldDirection(), camera.getWorldPosition(), 5, 0xFF0000 );
		// var arrowHelper = new THREE.ArrowHelper( direction, origin, 5, 0xFF0000 );
		// scene.add( arrowHelper );

		// console.log("fire", intersections);

		if ( intersections.length > 0 ) {
			var target = intersections[ 0 ];
			// console.log( target );

			if ( target.distance < interactionDistance ) {

				this.setTarget( target.object );

			} else {
				this.resetActive();
			}

		} else {
			this.resetActive();
		}

	};

	Player.prototype.setTarget = function( object ) {
		// console.log( "setActive", object );

		 if ( object !== this.target ) {

			this.resetActive();
			// console.log("active", object );
			// console.log( "userdata", object.userData.fsm );

			// todo check for interaction class item
			// instead of ausschlussverfahren
			var isItem = object.userData instanceof Item;
			var isItemslot = object.userData instanceof Itemslot;

			if ( ! isItem && ! isItemslot ) {

				var hasFSM = isFunction( object.userData.fsm.transitions );

				if ( hasFSM ) {

					var action = object.userData.fsm.transitions()[ 0 ] + " the ";
					var text = action + object.userData.name;

				}
			} else if ( isAnyObject( object.userData.hud ) ) {
				var action = object.userData.hud.action;
				var text = action + " <span class='highlight-item'>" + object.userData.name + "</span>";
			}
			this.hud.interactionText.show( true, text );
			object.userData.highlight( this.inventar, this.hud.interactionText );
			this.target = object;

		}

	};

	Player.prototype.resetActive = function() {

		if ( this.target !== undefined ) {

			this.hud.interactionText.show( false );

			if ( isFunction( this.target.userData.reset ) ) {
				this.target.userData.reset();
			}
			this.target = undefined;

		}

	};

	return Player;

});