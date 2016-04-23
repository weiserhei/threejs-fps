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
	"classes/Weapon",
	"physics",
	"sounds",
	"container"
], function ( THREE, Item, Itemslot, debugGUI, controls, scene, Inventar, Weapon, physics, sounds, container ) {

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


	function createFlashlight( mesh ) {

		//spotlight
		var spotLight = new THREE.SpotLight( 0xf1ffb1, 0 ); //0xFFFFFF //0x44ffaa mystic green 500, 4 0xCCFF88
		spotLight.angle = 40 * Math.PI / 180;
		spotLight.distance = 15;
		spotLight.penumbra = 0.5;
		spotLight.decay = 1.5;
		spotLight.position.set( 0.1, -0.1, 0.1 );
		spotLight.castShadow = true;
		// spotLight.shadowBias = 50;
		// spotLight.shadowCameraFov = 60;
		spotLight.shadow.camera.near = 0.01;
		spotLight.shadow.camera.far = 30;
		// spotLight.shadowMapWidth = spotLight.shadowMapHeight = 1024;
		// spotLight.shadowDarkness = 0.5;

		// light helper
		spotLightHelper = new THREE.SpotLightHelper( spotLight );
		scene.add( spotLightHelper );
		spotLightHelper.updateMatrixWorld();
		spotLightHelper.visible = false;

		mesh.add( spotLight );
		spotLight.target.position.set( 0, 0, -10 );
		mesh.add( spotLight.target );
		mesh.updateMatrixWorld();
		spotLightHelper.update();

		// gui
		var gui = debugGUI.getFolder("Flashlight");
		
		buildGui( spotLight );

		function buildGui( light ) {

			gui.addThreeColor( light, "color" );
			gui.add( light, "intensity" ).min( 0 ).max( 5 );
			gui.add( light, "distance" ).min( 0 ).max( 20 );
			gui.add( light, "angle" ).min( 0 ).max( Math.PI / 2 ).onChange( update );
			gui.add( light, "penumbra" ).min( 0 ).max( 1 );
			gui.add( light, "decay" ).min( 0 ).max( 100 );
			gui.add( spotLightHelper, "visible" ).name("Helper visible");

			function update() {
				spotLightHelper.update();
			}

		}

		return spotLight;
	}

	Player.prototype.getPawn = function() {
		return this._playerMesh;
	};


	// hud.x = hud.box( "end: " );
	// hud.x2 = hud.box( "start: " );
	// hud.x2.style.bottom = "50px";
	// hud.x2.show( true );
	// hud.x.show( true );


	// var that = this;
	// var hud = hud;
 //    var weapons = {};

	// weapons.portalgun = new Weapon( "portalgun", {
	// 	maxCapacity: 0, 
	// 	magazines: 0, 
	// 	reloadTime: 0, 
	// 	shootDelay: 0.5,
	// 	shootSound: that.sounds.swosh1,
	// 	altSound: that.sounds.swosh5,
	// 	// reloadSound: that.sounds.sniperreload,
	// 	// emitterPool: this.muzzleFlash,
	// 	} );

 //    weapons.sniper = new Weapon( "sniper", { 
	// 	maxCapacity: 6, 
	// 	magazines: 2, 
	// 	reloadTime: 4, 
	// 	shootDelay: 1,
	// 	shootSound: that.sounds.sniperrifle,
	// 	reloadSound: that.sounds.sniperreload,
	// 	// emitterPool: this.muzzleFlash,
	// 	} );

	// for ( var key in weapons ) {
	// 	weapons[key].emitterPool = this.muzzleFlash;
	// 	weapons[key].emptySound = this.sounds.soundClick;
	// 	weapons[key].restockSound = this.sounds.sound3;
	// }	


	function Player( hud, clock ) {

		this.tools = {};
		this.tools.flashlight = {};

		this.clock = clock;

		var playerMesh = controls.getControls().getObject();
		this._playerMesh = playerMesh;


		var T_shotgun = new THREE.Texture();
		var textureLoader = new THREE.ImageLoader(  );
		textureLoader.load( 'assets/models/shotgun_l4d/twd_shotgun.png', function ( image ) {

			T_shotgun.image = image;
			T_shotgun.needsUpdate = true;

		} );	
		var loader = new THREE.OBJLoader(  );
		loader.load( 'assets/models/shotgun_l4d/shotgun.obj', function ( object ) {
			
			/*		
				object.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						child.material.map = T_shotgun;

					}

				} );
			*/

			object = object.children[0];

			object.material.map = T_shotgun;

			object.scale.set( 0.55,0.55,0.55 ); 
			object.receiveShadow = true;
			object.material.map.anisotropy = 8; //front barrel of the weapon gets blurry
			object.material.color.setHSL( 0, 0, 1 );

			object.rotation.y = -90 * Math.PI / 180;
			object.rotation.x = -2 * Math.PI / 180;
			
			// http://stackoverflow.com/questions/12666570/how-to-change-the-zorder-of-object-with-threejs
			
			var pyramidPercentX = 56;
			var pyramidPercentY = -28;
			var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
			var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
			object.position.x = pyramidPositionX * camera.aspect;
			object.position.y = pyramidPositionY;
			object.position.z = -0.5;
					
			var pyramidPercentX = 58;
			var pyramidPercentY = 35;
			var pyramidPositionX = (pyramidPercentX / 100) * 2 - 1;
			var pyramidPositionY = (pyramidPercentY / 100) * 2 - 1;
				
			object.emitterVector = new THREE.Vector3( pyramidPositionX * camera.aspect, pyramidPositionY, -1.35 );

			// console.log( object );
			
			// weaponModels.shotgun = object;
			// cameraChildrenGroup.add( object );

			// object.position.y = -1;
			playerMesh.add( object );

		});


		this.flashlight = new createFlashlight( playerMesh );

		this.target = undefined;
		this.hud = hud;

		this.inventar = new Inventar();

		this.inHands;


		var weapons = {};
		var shotgun = new Weapon();
		weapons.shotgun = shotgun;

		this.inHands = shotgun;


		shotgun.name = "shotgun";
		shotgun.maxCapacity = 8;
		shotgun.currentCapacity = 2;
		shotgun.magazines = 1;
		shotgun.shootDelay = 0.15;
		shotgun.shootSound = sounds.railgun;
		shotgun.reloadSound = sounds.shellload;
		shotgun.reloadTime = 2;
		// shotgun.emitterPool = "shotgun";

		hud.weaponText = hud.box();
		hud.weaponText.show( true, this.inHands );
		hud.weaponText.setHTML = "";
		hud.weaponText.style = "padding:4px; background:rgba( 0, 0, 0, 0.25 ); width: unset; text-align:right; right: 100px;";

		function update() {
			hud.weaponText.show( true, this.inHands );
		}

	    // register update hud on ammo change and reload
		for ( var key in weapons ) {
			weapons[key].setCallback( this, update );
		}	

		var toggle = false; // toggle key down

		document.addEventListener('keydown', onDocumentKeyDown.bind( this ), false);
		document.addEventListener('keyup', onDocumentKeyUp, false);


		function onDocumentKeyDown( event ){

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

		// if (document.mozFullScreen && document.webkitFullScreen) {
		// 	console.log("fullscreen");
		// }
		// container.addEventListener( "mousedown", handleMouseDown );
		document.body.addEventListener( "mousedown", handleMouseDown.bind( this ) );
		function handleMouseDown( event ) {

			// cheap way of blocking shooting while entering fullscreen
			if ( !controls.getControls().enabled ) {
				return;
			}

			if ( event.button === 0 ) {

				if ( this.inHands instanceof Weapon ) {
					this.LMB();
				}

			} else {

			}
		}

	}

	Player.prototype.LMB = function() {

		this.inHands.shoot( this.clock );

	};

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