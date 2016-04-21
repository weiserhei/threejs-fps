/**
* Sounds
* not positional Audio
*/

define([
	"three",
	"listener"
	"SoundLoader",
	"loadingManager",
], function ( THREE, listener, SoundLoader, loadingManager ) {

	'use strict';

	var sounds = {};
	var soundLoader = new SoundLoader( listener, loadingManager );

	var manifest = [
		// ITEM PICKUP
		{ id: "wusch", url: "assets/sounds/wusch.ogg", volume: 0.5  },
		// ITEM SLOTS
		{ id: "lightswitch", url: "assets/sounds/lightswitch.ogg", volume: 0.5  },
		{ id: "harfe", url: "assets/sounds/harfe.ogg", volume: 0.5  },
		{ id: "schlag", url: "assets/sounds/schlag.ogg", volume: 0.2  },
		// SAFE
		{ id: "beep", url: "assets/sounds/beep.ogg", volume: 0.5  },
	];

	sounds = soundLoader.loadAudio( manifest );

	// POSITIONAL
	var positional = {};
	positional.safe = {};
	sounds.positional = positional;

	// SAFE
	var manifest = [
		{ id: "safe_door", url: "assets/sounds/safe_door.ogg", volume: 0.1, setRefDistance: 8  },
		{ id: "door", url: "assets/sounds/door.ogg", volume: 0.1, setRefDistance: 8  },
		{ id: "quietsch2", url: "assets/sounds/quietsch2.ogg", volume: 0.5, setRefDistance: 8 },
		{ id: "click_slow", url: "assets/sounds/click_slow.ogg", volume: 0.1, setRefDistance: 8  },
	];

	positional.safe = soundLoader.loadPositionalAudio( manifest );

	// SICHERUNGSKASTEN	
	var manifest = [
		{ id: "schlag", url: "assets/sounds/schlag.ogg", volume: 0.1, setRefDistance: 8  },
		{ id: "sicherung2", url: "assets/sounds/sicherung2.ogg", volume: 0.3, setRefDistance: 8  },
	];

	positional.sicherungskasten = soundLoader.loadPositionalAudio( manifest );

	return sounds;

});