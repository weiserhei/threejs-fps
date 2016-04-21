/**
* Inventar
* minimalistic list
* add / remove items, display in dat.gui
*
*/

define([
	"three",
	"classes/Item",
	"classes/Itemslot",
	"debugGUI"
], function ( THREE, Item, Itemslot, debugGUI ) {


	function Inventar() {

		// dat.gui
		this.folder = debugGUI.getFolder( "Inventar" );
		this.guiHandler = [];

		this.items = [];

	}

	Inventar.prototype.addItem = function( item ) {

		if( ! item instanceof Item ) {
			console.error( "item added is not an instance of Item", item );
			return;
		}
		// handler for dat.gui
		var dgItem = this.folder.add( item, "name" );
		this.guiHandler.push( dgItem );

		this.items.push( item );

	};

	Inventar.prototype.removeItem = function( item ) {

		// remove from dat.gui
		var handler = findWithAttr( this.guiHandler, "object", item );
		this.folder.remove( handler );

		// remove from inventar list
		var index = this.items.indexOf( item );

		if ( index > - 1 ) {
			this.items.splice( index, 1 );
		}

	};

	Inventar.prototype.containsObject = function( item ) {
		
		function containsObject(obj, list) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (list[i] === obj) {
					return true;
				}
			}

			return false;
		}

		return containsObject( item, this.items );
	};

	return Inventar;


	// http://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
	function findWithAttr(array, attr, value) {
		for(var i = 0; i < array.length; i += 1) {
			if(array[i][attr] === value) {
				return array[i];
			}
		}
	}

} );