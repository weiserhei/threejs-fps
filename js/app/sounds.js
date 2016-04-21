/**
* Sounds
* not positional Audio
*/

define([
	"three",
	"listener",
	"loadingManager"
], function ( THREE, listener, loadingManager ) {

	'use strict';

	// var loader = new THREE.AudioLoader( loadingManager );
	/*
	loader.load(
		// resource URL
		'audio/ambient_ocean.ogg',
		// Function when resource is loaded
		function ( audioBuffer ) {
			// set the audio object buffer to the loaded object
			oceanAmbientSound.setBuffer( audioBuffer );

			// play the audio
			oceanAmbientSound.play();
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
	*/

	var sounds = {};
	var manifest = [
		// ITEM PICKUP
		{ id: "wusch", url: "assets/sounds/wusch.ogg", volume: 0.5  },
		// ITEM SLOTS
		{ id: "lightswitch", url: "assets/sounds/lightswitch.ogg", volume: 0.5  },
		{ id: "harfe", url: "assets/sounds/harfe.ogg", volume: 0.5  },
		{ id: "schlag", url: "assets/sounds/schlag.ogg", volume: 0.1  },
		// SAFE
		{ id: "beep", url: "assets/sounds/beep.ogg", volume: 0.5  },
	];

	while ( manifest.length > 0 ) 
	{

		var item = manifest.shift();
		var sound = new THREE.Audio( listener );
		sound.setVolume( item.volume );
		// sound.setLoop( true );
		// sound.autoplay = true;
		sounds[ item.id ] = sound.load( item.url );

		/*
		sounds[ item.id ] = sound;
		loader.load( item.url, function ( audioBuffer ) {
			// console.log("setting Buffer", audioBuffer );
			console.log( "item", item );
			sounds[ item.id ].setBuffer( audioBuffer );
			// sound.setBuffer( audioBuffer );
		} );
		*/
	}
	
	// var sound1 = new THREE.Audio( listener );
	// var url = 'assets/sounds/wusch.ogg';

	/* what a bullshit */
	/* other modules using this sound module
	 * are not updated when the audio buffer callback
	 * is set. they just have empty sounds then
	 */

	// POSITIONAL
	// analyser1 = new THREE.AudioAnalyser( sound1, 32 );

	var positional = {};
	positional.safe = {};
	sounds.positional = positional;

	var manifest = [
		// SAFE
		{ id: "safe_door", url: "assets/sounds/safe_door.ogg", volume: 0.1, setRefDistance: 8  },
		{ id: "door", url: "assets/sounds/door.ogg", volume: 0.1, setRefDistance: 8  },
		{ id: "quietsch2", url: "assets/sounds/quietsch2.ogg", volume: 0.5, setRefDistance: 8 },
		{ id: "click_slow", url: "assets/sounds/click_slow.ogg", volume: 0.1, setRefDistance: 8  },
	];

	while ( manifest.length > 0 ) 
	{

		var item = manifest.shift();
		var sound = new THREE.PositionalAudio( listener );
		sound.setVolume( item.volume );
		sound.setRefDistance( item.setRefDistance );
		positional.safe[ item.id ] = sound.load( item.url );

	}

	// cone of sound
	// var panner = sound4.getOutput();
	// panner.coneInnerAngle = 30;
	// panner.coneOuterAngle = 60;
	// panner.coneOuterGain = outerGainFactor;


	// SICHERUNGSKASTEN
	var sound1 = new THREE.PositionalAudio( listener );
	sound1.load( 'assets/sounds/schlag.ogg' );
	sound1.setRefDistance( 8 );
	sound1.setVolume( 0.1 );    

	var sound2 = new THREE.PositionalAudio( listener );
	sound2.load( 'assets/sounds/sicherung2.ogg' );
	sound2.setRefDistance( 8 );
	sound2.setVolume( 0.3 );

	var sicherungskasten = {};
	sicherungskasten.schlag = sound1;
	sicherungskasten.sicherung2 = sound2;

	positional.sicherungskasten = sicherungskasten;
	

	return sounds;

});