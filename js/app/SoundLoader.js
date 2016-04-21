/**
* Sounds
* not positional Audio
*/

define([
	"three"
], function ( THREE ) {

	'use strict';

	function callback( audioBuffer ) {

		this.setBuffer( audioBuffer );

	}

	function SoundLoader( listener, manager ) {

		this.listener = listener;
		this.loader = new THREE.AudioLoader( manager );

	}

	SoundLoader.prototype.loadAudio = function( manifest ) {

		var soundReferences = {};

		while ( manifest.length > 0 ) {

			var item = manifest.shift();
			var sound = new THREE.Audio( this.listener );
			sound.setVolume( item.volume );
			// sound.setLoop( true );
			// sound.autoplay = true;
			// sounds[ item.id ] = sound.load( item.url );
			
			soundReferences[ item.id ] = sound;
			this.loader.load( item.url, callback.bind( sound ) );

		}

		return soundReferences;

	};

	// analyser1 = new THREE.AudioAnalyser( sound1, 32 );

	// cone of sound
	// var panner = sound4.getOutput();
	// panner.coneInnerAngle = 30;
	// panner.coneOuterAngle = 60;
	// panner.coneOuterGain = outerGainFactor;

	SoundLoader.prototype.loadPositionalAudio = function( manifest ) {

		var soundReferences = {};

		while ( manifest.length > 0 ) {

			var item = manifest.shift();
			var sound = new THREE.PositionalAudio( this.listener );
			sound.setVolume( item.volume );
			sound.setRefDistance( item.setRefDistance );
			// positional.safe[ item.id ] = sound.load( item.url );

			soundReferences[ item.id ] = sound;
			this.loader.load( item.url, callback.bind( sound ) );

		}

		return soundReferences;

	};

	return SoundLoader;

});