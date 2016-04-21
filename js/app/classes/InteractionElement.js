/**
* Safe Object (interactive)
* consists of
* Model (mesh)
* Tweens
* State Machine
* Sounds
*/

define([
	"three"
], function ( THREE ) {

	'use strict';

	function InteractionElement( name ) {
		this.name = name;
	}

	InteractionElement.prototype.addHighlightMaterial = function( mesh ) {

		this.mesh = mesh;

		if ( mesh instanceof THREE.Group ) {

			var group = mesh;

			for ( var i = 0; i < group.children.length; i ++ ) {

				var mesh = group.children[ i ];
				var material = mesh.material;

				mesh.userData.stdMaterial = material;
				mesh.userData.highlightMaterial = this.highlightMaterial( material.clone() );

			}

		} else {

			mesh.userData.stdMaterial = mesh.material;
			mesh.userData.highlightMaterial = this.highlightMaterial( mesh.material.clone() );

		}

	};

	InteractionElement.prototype.highlightMaterial = function( material ) {

		if ( material instanceof THREE.MultiMaterial ) {

			// console.log( "material", child.material )
			var multiMaterial = material;

			for ( var i = 0; i < multiMaterial.materials.length; i ++ ) {
				var material = multiMaterial.materials[ i ];
				// if ( mesh.userData.color === undefined ) {
				// 	mesh.userData.color = [];
				// }
				// mesh.userData.color.push( material.color.clone() );
				// material.wireframe = true;
				// material.color.setHex( 0xFF0000 );
				// material.emissive.setHex( 0x112211 );
				// material.emissive.setHex( 0x011001 );
				// material.transparent = true;
				// material.opacity = 0.8;
				material.color.offsetHSL( 0, 0.04, 0.08 );

			}

		} else {
			// single material
			var multiMaterial = material;
			material.color.offsetHSL( 0, 0.04, 0.08 );
			// material.wireframe = true;
		}
		// console.log( "returning", material );

		return multiMaterial;

	};

	InteractionElement.prototype.addHighlightFunction = function( raycastMesh, fsm, constraint ) {

		raycastMesh.userData.name = this.name;
		raycastMesh.userData.highlight = highlight;
		raycastMesh.userData.reset = reset;

		var highlightMesh = this.mesh;

		function highlight( inventar, hudElement ) {

			if ( constraint.active === true ) {
				var innerHTML = "You need to " + constraint.hud.action + " <span class='highlight-inactive'>" + constraint.name + "</span>";
				innerHTML += " to " + fsm.transitions()[ 0 ] + " the " + this.name;
				hudElement.setHTML( innerHTML );
			} else {
			}

			// single mesh like fuse switch
			if ( highlightMesh.userData.highlightMaterial instanceof THREE.Material ) {

				highlightMesh.material = highlightMesh.userData.highlightMaterial;

			}
			else {

				// multi mesh like safe door
				for ( var i = 0; i < highlightMesh.children.length; i ++ ) {

					var mesh = highlightMesh.children[ i ];
					if ( mesh.userData.highlightMaterial !== undefined ) {
						mesh.material = mesh.userData.highlightMaterial;
					}

				}
				
			}

		}

		function reset() {

			// single mesh like fuse switch
			if ( highlightMesh.userData.stdMaterial instanceof THREE.Material ) {

				highlightMesh.material = highlightMesh.userData.stdMaterial;

			} else {

				// multi mesh like safe door
				for ( var i = 0; i < highlightMesh.children.length; i ++ ) {

					var mesh = highlightMesh.children[ i ];
					if ( mesh.userData.stdMaterial !== undefined ) {
						mesh.material = mesh.userData.stdMaterial;
					}

				}
			}

		}

	}


	return InteractionElement;

});