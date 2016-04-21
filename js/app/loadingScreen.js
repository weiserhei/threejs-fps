/**
 * Loading Screen
 *
 * http://www.hongkiat.com/blog/beautiful-progress-bars/ !!!!
 *
 * http://red-team-design.com/stylish-css3-progress-bars/
 * https://css-tricks.com/html5-progress-element/
 * http://www.htmlgoodies.com/html5/css/using-css-to-make-a-visually-consistent-cross-browser-html5-progress-bar.html
 * 
 */

define([], function () {

    'use strict';

	// var container = $('.loading-container');
	var container = document.getElementById("loading-container");

	var progress = document.createElement("progress");
	container.appendChild( progress );

	// progress.max = 1;
	progress.value = 0;

	var label = document.createElement( "p" );
	label.className = "progressText"
	label.textContent = "0%";
	container.appendChild( label );

	var sub = document.createElement( "p" );
	sub.className = "sub";
	sub.textContent = "Processing"
	container.appendChild( sub );

	function setProgress( loaded, total ) {

		progress.value = loaded / total;
		// progress.value = 0.5;
		label.textContent = Math.round( loaded / total * 100 ) + "%";
		sub.textContent = loaded + "/" + total;

	}

	function complete() {

		// container.fadeOut();
		container.classList.toggle('fade');
		// hmm idk
		// its more fluid to fade out using css transitions
		// but element needs to be removed from the flow
		// do it via setTimeout
		setTimeout( function() { container.style.display = "none"; }, 1000 );
	}

	/*
	
	if (container.length) {
		
		var loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"></div>');
		container.prepend(loadingimg);

		// $loadingimg.attr("src","images/flexslider/loading.gif");

		// canvasloader code
		var cl = new CanvasLoader('canvasloader-container');
		cl.setColor('#436284'); // default is '#000000'
		// cl.setColor('#47525c'); // default is '#000000'
		// cl.setColor('#4f4f4f'); // default is '#000000'
		cl.setDiameter(45); // default is 40
		cl.setDensity(75); // default is 40
		cl.setRange(0.7); // default is 1.3
		cl.setSpeed(3); // default is 2
		cl.setFPS(22); // default is 24
		cl.show(); // Hidden by default

		container.fadeOut();
		// $('.loading-container').fadeOut();
	}
	
	var complete = function() {

        // set bar to 100% to prevent overflow
        // progressbar.style.width = 1 * barwidth + "px";
        container.fadeOut();
    };
    */

    return {
    	container: container,
    	setProgress: setProgress,
    	complete: complete
    };
});