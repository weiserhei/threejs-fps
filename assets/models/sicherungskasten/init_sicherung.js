<<<<<<< HEAD


//jsonLoader.load("Content/models/office/sicherung.js", function callback(geometry, materials) {
//	sicherung = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
//    for ( i = sicherung.material.materials.length - 1; i >= 0 ; i -- ) {
//        obj = sicherung.material.materials[ i ];
//        obj.shading= THREE.FlatShading;
//    }
//    sicherung.scale.set(10,10,10);
//    sicherung.position.set(0.0, 0.0, -0.0);
//    sicherung.castShadow = true;
//    sicherung.receiveShadow = true;
//    scene.add(sicherung);
//
//	Shadow = true;
//    scene.add(sicherung);
//});


//jsonLoader.load("Content/models/office/sicherung_kasten.js", function callback(geometry, materials) {
//sicherung_kasten= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
//    for ( i = sicherung_kasten.material.materials.length - 1; i >= 0 ; i -- ) {
//        obj = sicherung_kasten.material.materials[ i ];
//        obj.shading= THREE.FlatShading;
//    }
//    sicherung_kasten.scale.set(10,10,10);
//    sicherung_kasten.position.set(194.90493774414062, 16.234487295150757, -149.0892791748047);
//    sicherung_kasten.castShadow = true;
//    sicherung_kasten.receiveShadow = true;
//    scene.add(sicherung_kasten);
//});
//
//jsonLoader.load("Content/models/werkstatt/sicherung_schalter.js", function callback(geometry, materials) {
//sicherung_schalter= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
//    for ( i = sicherung_schalter.material.materials.length - 1; i >= 0 ; i -- ) {
//        obj = sicherung_schalter.material.materials[ i ];
//        obj.shading= THREE.FlatShading;
//    }
//    sicherung_schalter.scale.set(10,10,10);
//    sicherung_schalter.position.set(153.244,9.13409,-173.883);
//    sicherung_schalter.castShadow = true;
//    sicherung_schalter.receiveShadow = true;
//    scene.add(sicherung_schalter);
//});
//
//jsonLoader.load("Content/models/werkstatt/sicherung_tür.js", function callback(geometry, materials) {
//	sicherung_tuer = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
//    for ( i = sicherung_tuer.material.materials.length - 1; i >= 0 ; i -- ) {
//        obj = sicherung_tuer.material.materials[ i ];
//        obj.shading= THREE.FlatShading;
//    }
//    sicherung_tuer.scale.set(10,10,10);
//    sicherung_tuer.position.set(193.34012985229492, 16.600794792175293, -145.14260292053223);
//    sicherung_tuer.castShadow = true;
//    sicherung_tuer.receiveShadow = true;
//    scene.add(sicherung_tuer);
//
//});
=======
jsonLoader.load("Content/models/office/sicherung.js", function callback(geometry, materials) {
sicherung= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = sicherung.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = sicherung.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    sicherung.scale.set(10,10,10);
    sicherung.position.set(0.0, 0.0, -0.0);
    sicherung.castShadow = true;
    sicherung.receiveShadow = true;
    scene.add(sicherung);

Shadow = true;
    scene.add(sicherung);

jsonLoader.load("Content/models/office/sicherung_kasten.js", function callback(geometry, materials) {
sicherung_kasten= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = sicherung_kasten.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = sicherung_kasten.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    sicherung_kasten.scale.set(10,10,10);
    sicherung_kasten.position.set(194.90493774414062, 16.234487295150757, -149.0892791748047);
    sicherung_kasten.castShadow = true;
    sicherung_kasten.receiveShadow = true;
    scene.add(sicherung_kasten);

jsonLoader.load("Content/models/office/sicherung_schalter.js", function callback(geometry, materials) {
sicherung_schalter= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = sicherung_schalter.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = sicherung_schalter.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    sicherung_schalter.scale.set(10,10,10);
    sicherung_schalter.position.set(194.7380828857422, 16.317330598831177, -147.18859672546387);
    sicherung_schalter.castShadow = true;
    sicherung_schalter.receiveShadow = true;
    scene.add(sicherung_schalter);

jsonLoader.load("Content/models/office/sicherung_tür.js", function callback(geometry, materials) {
sicherung_tür= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = sicherung_tür.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = sicherung_tür.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    sicherung_tür.scale.set(10,10,10);
    sicherung_tür.position.set(193.34012985229492, 16.600794792175293, -145.14260292053223);
    sicherung_tür.castShadow = true;
    sicherung_tür.receiveShadow = true;
    scene.add(sicherung_tür);

>>>>>>> 6e44549605e05e994e58e8e5df08f58b69d1599b
