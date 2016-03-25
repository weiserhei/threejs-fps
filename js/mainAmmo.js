require.config({
    // Default load path for js files
    baseUrl: 'js/app',
    // export globals
    shim: {
        // --- Use shim to mix together all THREE.js subcomponents
        'threeCore': {exports: "THREE"},
        'OrbitControls': {deps: ['threeCore'], exports: "THREE"},
        'ColladaLoader': {deps: ['threeCore'], exports: "THREE"},
        'OBJLoader': {deps: ['threeCore'], exports: "THREE"},
        'MTLLoader': {deps: ['threeCore'], exports: "THREE"},
        // --- end THREE sub-components
        'detector': { exports: 'Detector' },
        'Stats': {exports: "Stats"},
        'CanvasLoader': {exports: "CanvasLoader"},
        'TWEEN': {exports: "TWEEN"},
        'dat': {exports: "dat"},

    },
    // Third party code lives in js/lib
    paths: {
        'jquery': "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min",
        'dat': "../libs/dat.gui.min",
        'CanvasLoader': "../libs/heartcode-canvasloader-min",
        'TWEEN': "../libs/tween.min",
        // --- start THREE sub-components
        // 'threeCore': "../../scripts/three.js/build/three.min",
        'threeCore': "../libs/three/three",
        'three': "../libs/three",
        'OrbitControls': "../libs/three/controls/OrbitControls",
        'Stats': "../libs/stats.min",
        'detector': "../libs/three/Detector",
        'ColladaLoader': "../libs/three/loaders/ColladaLoader2",
        'OBJLoader': "../libs/three/loaders/OBJLoader",
        'MTLLoader': "../libs/three/loaders/MTLLoader",
        // --- end THREE sub-components
        'PhysicFactory': "physicFactoryAmmo"

    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
	'detector',
    'loadingScreen'
], function (App,Detector) {

	if ( ! Detector.webgl ) {
	
		// loadingScreen.container.style.display = "none";
		// message.style.display = "none";
		// loadingScreen.message.innerHTML = "<h1>No webGL, no panoglobe! :(</h1>";
		Detector.addGetWebGLMessage();
		
	} else {
		
		// The "app" dependency is passed in as "App"
		App.initialize();
		App.animate();

	}
	
});