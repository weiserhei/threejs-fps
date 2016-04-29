/**
* Sounds
* not positional Audio
*/

define([
	"listener",
	"classes/SoundLoader",
	"loadingManager"
], function ( listener, SoundLoader, loadingManager ) {

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
		// GUN
		{ id: "railgun", url: "assets/sounds/railgun.ogg", volume: 0.1  },
		{ id: "shellload", url: "assets/sounds/shell-load.ogg", volume: 0.2  },
		{ id: "weaponclick", url: "assets/sounds/weaponclick.ogg", volume: 0.3  },
		{ id: "sniperrifle", url: "assets/sounds/sniper.ogg", volume: 0.2  },
		{ id: "sniperreload", url: "assets/sounds/reload.ogg", volume: 0.3  },
		{ id: "cling", url: "assets/sounds/ding.ogg", volume: 0.3  },
		{ id: "rifleshot", url: "assets/sounds/163460__lemudcrab__sniper-shot.wav", volume: 0.2  },
		{ id: "g36reload", url: "assets/sounds/276960__gfl7__g36c-reload-sound.mp3", volume: 0.2  },
	];

	sounds = soundLoader.loadAudio( manifest );

	// POSITIONAL
	var positional = {};
	positional.safe = {};
	sounds.positional = positional;

	sounds.positional.bow = soundLoader.loadPositionalAudio( [{ id: "bow", url: "assets/sounds/bow.ogg", volume: 0.5, setRefDistance: 8  }])

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