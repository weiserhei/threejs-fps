/**
 * Loading Screen
 * with CanvasLoader
 */
define(["jquery","CanvasLoader"], function ($, CanvasLoader) {

    'use strict';

	var container = $('.loading-container');
	
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

    return {
    	container: container,
    	complete: complete
    };
});