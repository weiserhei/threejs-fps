jsonLoader.load("Content/models/office/safe.js", function callback(geometry, materials) {
safe= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe.scale.set(10,10,10);
    safe.position.set(264.3936538696289, 55.166077613830566, -97.69061088562012);
    safe.castShadow = true;
    safe.receiveShadow = true;
    scene.add(safe);
});

jsonLoader.load("Content/models/office/safe_great_door.js", function callback(geometry, materials) {
safe_great_door= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe_great_door.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe_great_door.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe_great_door.scale.set(10,10,10);
    safe_great_door.position.set(258.6172294616699, 48.356266021728516, -92.3811149597168);
    safe_great_door.castShadow = true;
    safe_great_door.receiveShadow = true;
    scene.add(safe_great_door);
});

jsonLoader.load("Content/models/office/safe_griff.js", function callback(geometry, materials) {
safe_griff= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe_griff.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe_griff.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe_griff.scale.set(10,10,10);
    safe_griff.position.set(-0.4609107971191406, 12.544717788696289, -8.215837478637695);
    safe_griff.castShadow = true;
    safe_griff.receiveShadow = true;
    scene.add(safe_griff);
});

jsonLoader.load("Content/models/office/safe_little_door.js", function callback(geometry, materials) {
safe_little_door= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe_little_door.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe_little_door.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe_little_door.scale.set(10,10,10);
    safe_little_door.position.set(262.7901840209961, 57.493743896484375, -95.03728866577148);
    safe_little_door.castShadow = true;
    safe_little_door.receiveShadow = true;
    scene.add(safe_little_door);
});

jsonLoader.load("Content/models/office/safe_middle_door.js", function callback(geometry, materials) {
safe_middle_door= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe_middle_door.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe_middle_door.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe_middle_door.scale.set(10,10,10);
    safe_middle_door.position.set(260.8685111999512, 49.950079917907715, -94.67495918273926);
    safe_middle_door.castShadow = true;
    safe_middle_door.receiveShadow = true;
    scene.add(safe_middle_door);
});

jsonLoader.load("Content/models/office/safe_wheel.js", function callback(geometry, materials) {
safe_wheel= new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
    for ( i = safe_wheel.material.materials.length - 1; i >= 0 ; i -- ) {
        obj = safe_wheel.material.materials[ i ];
        obj.shading= THREE.FlatShading;
    }
    safe_wheel.scale.set(10,10,10);
    safe_wheel.position.set(-1.0613632202148438, 6.809806823730469, -5.309467315673828);
    safe_wheel.castShadow = true;
    safe_wheel.receiveShadow = true;
    scene.add(safe_wheel);
});
