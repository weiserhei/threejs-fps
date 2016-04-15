keller = function() {

		fackelpos.push(new THREE.Vector3(-20.370571, -61.029282, -169.723297));
		fackelrot.push(new THREE.Vector3(0.000000, -1.570796, -0.000000));
		fackelpos.push(new THREE.Vector3(57.610092, -61.029282, -169.723297));
		fackelrot.push(new THREE.Vector3(0.000000, -1.570796, -0.000000));
		fackelpos.push(new THREE.Vector3(57.610092, -61.029282, -85.378456));
		fackelrot.push(new THREE.Vector3(0.000000, -4.712389, -0.000000));
		fackelpos.push(new THREE.Vector3(-102.455063, -81.215042, -116.198730));
		fackelrot.push(new THREE.Vector3(0.000000, -4.712389, -0.000000));
		fackelpos.push(new THREE.Vector3(-170.995514, -81.215042, -107.063675));
		fackelrot.push(new THREE.Vector3(0.000000, -6.850197, -0.000000));
		fackelpos.push(new THREE.Vector3(-224.759796, -77.110168, -105.023407));
		fackelrot.push(new THREE.Vector3(0.000000, -8.925650, -0.000000));
		fackelpos.push(new THREE.Vector3(-304.466705, -73.530983, -123.002960));
		fackelrot.push(new THREE.Vector3(0.000000, -11.023123, -0.000000));
		fackelpos.push(new THREE.Vector3(-422.909363, -73.530983, -108.094170));
		fackelrot.push(new THREE.Vector3(0.000000, -10.891738, -0.000000));
		fackelpos.push(new THREE.Vector3(-605.479614, -73.530983, -113.336517));
		fackelrot.push(new THREE.Vector3(0.000000, -11.721951, -0.000000));
		fackelpos.push(new THREE.Vector3(-585.047058, -73.530983, -168.765274));
		fackelrot.push(new THREE.Vector3(0.000000, -14.073915, -0.000000));
		fackelpos.push(new THREE.Vector3(-20.370569, -61.029282, -85.378456));
		fackelrot.push(new THREE.Vector3(0.000000, -4.712389, -0.000000));

	
var jsonLoader = new THREE.JSONLoader();
jsonLoader.load("Content/models/keller/fackel.js", function callback(geometry, materials) {
	
	fire = new TextureAnimator(materials[1].map, 1, 10, 10, 125);

	//materials[1] == flamme
	materials[1].emissive.set(0xB45F04);
	materials[1].ambient.set(0xff00aa);			
	materials[1].side = THREE.DoubleSide;
		
	fire = new TextureAnimator(materials[1].map, 1, 10, 10, 125);
	
	var combined = new THREE.Geometry();
	
	// fackelgeometry gruppieren
	for(var i = fackelpos.length -1; i >= 0; i-- ) {
		var fackelgeo = new THREE.Mesh(geometry);
		
		fackelgeo.position.set(fackelpos[i].x, fackelpos[i].y, fackelpos[i].z);
		fackelgeo.rotation.set(fackelrot[i].x, fackelrot[i].y, fackelrot[i].z);
		fackelgeo.scale.set(10,10,10);			
		
		THREE.GeometryUtils.merge( combined, fackelgeo );
	}

	var fackel = new THREE.Mesh( combined, new THREE.MeshFaceMaterial( materials ) );
	scene.add( fackel );		
		
	//Old fashioned way
	//fackel1= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
	//fackel1.position.set(-20.370571613311768, -61.02928161621094, -169.7233009338379);
	//fackel1.scale.set(10,10,10);
	//fackel1.rotation.set(0.000000, -1.570796, 0.000000);
	//scene.add(fackel1);

});

// folgende 2 zeilen machen nichts, werden aber benötigt damit variable gültig ist - der pfad ist egal
// DONT ASK ME
var runnerTexture = new THREE.ImageUtils.loadTexture( '../content/models/keller/sprite_downup.png' );
fire = new TextureAnimator( runnerTexture, 1, 10, 10, 125 );

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
		{	
			// note: texture passed by reference, will be updated by the update function.
				
			this.tilesHorizontal = tilesHoriz;
			this.tilesVertical = tilesVert;
			// how many images does this spritesheet contain?
			//  usually equals tilesHoriz * tilesVert, but not necessarily,
			//  if there at blank tiles at the bottom of the spritesheet. 
			this.numberOfTiles = numTiles;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
			texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
		
			// how long should each image be displayed?
			this.tileDisplayDuration = tileDispDuration;
		
			// how long has the current image been displayed?
			this.currentDisplayTime = 0;
		
			// which image is currently being displayed?
			this.currentTile = 0;
				
			this.update = function( milliSec )
			{
				this.currentDisplayTime += milliSec;
				while (this.currentDisplayTime > this.tileDisplayDuration)
				{
					this.currentDisplayTime -= this.tileDisplayDuration;
					this.currentTile++;
					if (this.currentTile == this.numberOfTiles)
						this.currentTile = 0;
					var currentColumn = this.currentTile % this.tilesHorizontal;
					texture.offset.x = currentColumn / this.tilesHorizontal;
					var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
					texture.offset.y = currentRow / this.tilesVertical;
				}
			};
		}	


jsonLoader.load("Content/models/keller/keller_gear.js", function callback(geometry, materials) {
keller_gear1= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_gear1.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_gear1.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_gear1.scale.set(10,10,10);
    keller_gear1.position.set(-245.57139826478334, 10, -232.71262566571835);
	keller_gear1.rotation.x = Math.PI/2;
    keller_gear1.castShadow = true;
    keller_gear1.receiveShadow = true;
    scene.add(keller_gear1);
});

jsonLoader.load("Content/models/keller/keller_gear.js", function callback(geometry, materials) {
keller_gear2= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_gear2.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_gear2.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_gear2.scale.set(10,10,10);
    keller_gear2.position.set(-20.423407554626465, -73.26005458831787, -167.74248123168945);
    keller_gear2.rotation.set(0.000000, 0.000000, 0.000000);
    keller_gear2.castShadow = true;
    keller_gear2.receiveShadow = true;
    scene.add(keller_gear2);
});

jsonLoader.load("Content/models/keller/keller_gear.js", function callback(geometry, materials) {
keller_gear3= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_gear3.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_gear3.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_gear3.scale.set(10,10,10);
    keller_gear3.position.set(-28.77720594406128, -73.26005458831787, -167.74248123168945);
    keller_gear3.rotation.set(0.000000, 0.000000, 0.000000);
    keller_gear3.castShadow = true;
    keller_gear3.receiveShadow = true;
    scene.add(keller_gear3);
});

jsonLoader.load("Content/models/keller/keller_hebel.js", function callback(geometry, materials) {
keller_hebel= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_hebel.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_hebel.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_hebel.scale.set(10,10,10);
    keller_hebel.position.set(-20.697331428527832, -73.14287185668945, -84.85578536987305);
    keller_hebel.rotation.set(0.0, 0.000000, 0.000000);
    keller_hebel.castShadow = true;
    keller_hebel.receiveShadow = true;
    scene.add(keller_hebel);
});

jsonLoader.load("Content/models/keller/keller_riegel.js", function callback(geometry, materials) {
keller_riegel= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_riegel.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_riegel.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_riegel.scale.set(10,10,10);
    keller_riegel.position.set(-20.40278434753418, -73.24409008026123, -166.51939392089844);
    keller_riegel.rotation.set(0.000000, 0.000000, 0.000000);
    keller_riegel.castShadow = true;
    keller_riegel.receiveShadow = true;
    scene.add(keller_riegel);
});

jsonLoader.load("Content/models/keller/keller_schraube.js", function callback(geometry, materials) {
keller_schraube1= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_schraube1.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_schraube1.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_schraube1.scale.set(10,10,10);
    keller_schraube1.position.set(-11.971445083618164, -73.222336769104, -167.96030044555664);
    keller_schraube1.rotation.set(0.000000, 0.000000, 0.000000);
    keller_schraube1.castShadow = true;
    keller_schraube1.receiveShadow = true;
    scene.add(keller_schraube1);
});

jsonLoader.load("Content/models/keller/keller_schraube.js", function callback(geometry, materials) {
keller_schraube2= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_schraube2.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_schraube2.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_schraube2.scale.set(10,10,10);
    keller_schraube2.position.set(-28.782575130462646, -73.26173782348633, -167.96030044555664);
    keller_schraube2.rotation.set(0.000000, 0.000000, 0.000000);
    keller_schraube2.castShadow = true;
    keller_schraube2.receiveShadow = true;
    scene.add(keller_schraube2);
});

jsonLoader.load("Content/models/keller/keller_technik.js", function callback(geometry, materials) {
keller_technik= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_technik.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_technik.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_technik.scale.set(10,10,10);
    keller_technik.position.set(0,0,0);
    keller_technik.rotation.set(0.000000, 0.000000, 0.000000);
    keller_technik.castShadow = true;
    keller_technik.receiveShadow = true;
    scene.add(keller_technik);
});

jsonLoader.load("Content/models/keller/keller_tuer.js", function callback(geometry, materials) {
keller_tuer= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = keller_tuer.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = keller_tuer.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    keller_tuer.scale.set(10,10,10);
    keller_tuer.position.set(-65.22868633270264, -90.0, -137.72605895996094);
    keller_tuer.rotation.set(0.000000, 0.000000, 0.000000);
    keller_tuer.castShadow = true;
    keller_tuer.receiveShadow = true;
    scene.add(keller_tuer);
});

jsonLoader.load("Content/models/keller/altar.js", function callback(geometry, materials) {
altar = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));

    altar.scale.set(10,10,10);
    altar.position.set(0,0,0);
    altar.rotation.set(0.000000, 0.000000, 0.000000);
    altar.castShadow = true;
    altar.receiveShadow = true;
    scene.add(altar);
});


}