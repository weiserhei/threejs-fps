/**
 * Setup the renderer
 */
define(["three","container","scene"], function (THREE, container, scene) {

    'use strict';

    var screen_width = window.innerWidth;
    var screen_height = window.innerHeight;

    // RENDERER
    var renderer = new THREE.WebGLRenderer( { antialias:true } );       
    // var renderer = new THREE.WebGLRenderer( { antialias:true, alpha: true, logarithmicDepthBuffer: false } );       
    renderer.setSize( screen_width, screen_height );
    // renderer.setClearColor( 0x778899, 1);
    // renderer.setClearColor( 0xffffff, 1);
    //renderer.setClearColor( scene.fog.color );
    // renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.shadowMap.type = THREE.BasicShadowMap;

    // renderer.autoClear = false;
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;

    // var updateSize = function () {
    //     renderer.setSize(container.element.offsetWidth, container.element.offsetHeight);
    // };

    // $(window).resize(updateSize);
    // updateSize();

    container.appendChild( renderer.domElement );

    return renderer;
});