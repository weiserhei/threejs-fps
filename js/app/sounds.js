/**
* Sounds
* not positional Audio
*/

define([
	"three",
	"listener"
], function ( THREE, listener ) {

	'use strict';

	var sounds = {};

	// ITEM PICKUP
	var sound1 = new THREE.Audio( listener );
	sound1.load( 'assets/sounds/wusch.ogg' );
	// sound1.autoplay = true;
	// sound1.setLoop( true );
	sound1.setVolume( 0.5 );

	sounds.wusch = sound1;

	// ITEM SLOTS
	var sound1 = new THREE.Audio( listener );
	sound1.load( 'assets/sounds/lightswitch.ogg' );
	sound1.setVolume( 0.5 );

	sounds.lightswitch = sound1;

	var sound2 = new THREE.Audio( listener );
	sound2.load( 'assets/sounds/harfe.ogg' );
	sound2.setVolume( 0.5 );

	sounds.harfe = sound2;

	var sound3 = new THREE.Audio( listener );
	sound3.load( 'assets/sounds/schlag.ogg' );
	sound3.setVolume( 0.5 );

	sounds.schlag = sound3;

	// SAFE
	var sound5 = new THREE.Audio( listener );
	sound5.load( 'assets/sounds/beep.ogg' );
	sound5.setVolume( 0.5 );

	sounds.beep = sound5;

	// POSITIONAL
	// analyser1 = new THREE.AudioAnalyser( sound1, 32 );

	var positional = {};
	sounds.positional = positional;

	// SAFE
	var sound1 = new THREE.PositionalAudio( listener );
	sound1.load( 'assets/sounds/safe_door.ogg' );
	sound1.setRefDistance( 8 );
	sound1.setVolume( 0.1 );

	var sound2 = new THREE.PositionalAudio( listener );
	sound2.load( 'assets/sounds/door.ogg' );
	sound2.setRefDistance( 8 );
	sound2.setVolume( 0.1 );

	var sound3 = new THREE.PositionalAudio( listener );
	sound3.load( 'assets/sounds/quietsch2.ogg' );
	sound3.setRefDistance( 8 );
	sound3.setVolume( 0.1 );

	var sound4 = new THREE.PositionalAudio( listener );
	// sound4.load( 'assets/sounds/click.ogg' ); // needs delay 300ms
	sound4.load( 'assets/sounds/click_slow.ogg' );
	sound4.setRefDistance( 8 );
	sound4.setVolume( 0.1 );

	positional.safe = {};
	positional.safe.safe_door = sound1;
	positional.safe.door = sound2;
	positional.safe.quietsch2 = sound3;
	positional.safe.click_slow = sound4;


	// SICHERUNGSKASTEN
	var sound1 = new THREE.PositionalAudio( listener );
	sound1.load( 'assets/sounds/schlag.ogg' );
	sound1.setRefDistance( 8 );
	sound1.setVolume( 0.5 );    

	var sound2 = new THREE.PositionalAudio( listener );
	sound2.load( 'assets/sounds/sicherung2.ogg' );
	sound2.setRefDistance( 8 );
	sound2.setVolume( 0.5 );

	var sicherungskasten = {};
	sicherungskasten.schlag = sound1;
	sicherungskasten.sicherung2 = sound2;

	positional.sicherungskasten = sicherungskasten;
	

	return sounds;

});