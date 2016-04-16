/**
 * Setup the control method
 */

define([
       ], function () {

    // 'use strict';

    function HUD( domElement ) {

		var container	= document.createElement( 'div' );
		container.className = "container";
		// container.appendChild( container2 );
		document.body.insertBefore( container, domElement );

		this.container = container;

    }

    HUD.prototype.box = function( message ) {

		var infoText = document.createElement( 'div' );
		infoText.className = "infoText";
		// infoText.style.opacity = "0";
		// infoText.classList.add("hidden");

		infoText.initial = message;
		infoText.innerHTML = message;

		this.container.appendChild( infoText );

		infoText.played = false;
		infoText.autoFadeOut = false;

		infoText.show = function( value, message ) {

			// if( this.played ) { return; }
			this.played = true;

			if( message ) {
				
				this.innerHTML = this.initial + " " + message;
				
			}

			if ( value ) {
				// this.classList.remove("hidden");
				// this.classList.add("visible");
				this.fadeIn();

        	} else {
				// this.classList.remove("visible");
				// this.classList.add("hidden");
				// this.classList.add("fadeOut");
				// console.log("fadeout");
				this.fadeOut();

        	}
		}

		infoText.fadeIn = function() {
			// console.log("fadeIn", this);
			this.classList.remove("fadeOut");
			this.classList.remove("animate");

			// https://css-tricks.com/restart-css-animation/
			// -> triggering reflow /* The actual magic */
			// without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
			this.offsetWidth = this.offsetWidth;
			// -> and re-adding the class
			this.classList.add("animate");
			this.autoFadeOut = false;

			// clearTimeout(this.currentTimeout);

			this.currentTimeout = setTimeout(function(){ 
				// this.fadeOut( true ); 
			}.bind( this ), 2000);
		};

		// fade out after 2s
		// if faded out automatically, 
		// cancel the fadeOut on losing active state
		// kill the scheduled auto fadeout
		infoText.fadeOut = function( value ) {

			if ( this.autoFadeOut ) {
				return;
			}
			if ( value ) {
				this.autoFadeOut = true;
			}
			clearTimeout(this.currentTimeout);

			this.classList.remove("fadeIn");
			this.classList.remove("fadeOut");

			// https://css-tricks.com/restart-css-animation/
			// -> triggering reflow /* The actual magic */
			// without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
			this.offsetWidth = this.offsetWidth;
			// -> and re-adding the class
			this.classList.add("fadeOut");

		};

		return infoText;

    }

    return HUD;

});