function buildSuperMachine({
  width = 30,
  height = 20,
  depth = 20,
  widthSegments = 1,
  heightSegments = 1,
  depthSegments = 1,
  color,
  text,
  tasks = [],
} = {}) {
  const hasTasks = tasks.length > 0;

  const measurements = {
    cube: {
      width: width / 4,
      height: height / 2,
      depth,
      widthSegemts: widthSegments,
      heigthSegments: heightSegments,
      depthSegemtns: depthSegments,
      texture: hasTasks
        ? `./assets/textures/active_machine.jpg`
        : `./assets/textures/metal_1.jpg`,
    },
    rectangle: {
      width,
      height: height / 4,
      depth,
      widthSegemts: widthSegments,
      heigthSegments: heightSegments,
      depthSegemtns: depthSegments,
      texture: hasTasks
        ? `./assets/textures/active_machine.jpg`
        : `./assets/textures/metal_1.jpg`,
    },
    bigCylinder: {
      radiusTop: 10,
      radiusBottom: 10,
      height: height * 2,
      radialSegments: 30,
      texture: hasTasks
        ? `./assets/textures/active_machine.jpg`
        : `./assets/textures/metal_1.jpg`,
      offset: 13,
    },
    sideCylinder: {
      radiusTop: 3,
      radiusBottom: 3,
      height: (13 * 4) / 3,
      radialSegments: 30,
      texture: hasTasks
        ? `./assets/textures/active_machine.jpg`
        : `./assets/textures/metal_1.jpg`,
    },
  };

  // ###### build geometries#######
  const geometryCube = new THREE.BoxGeometry(
    measurements.cube.width,
    measurements.cube.height,
    measurements.cube.depth,
    measurements.cube.widthSegments,
    measurements.cube.heightSegments,
    measurements.cube.depthSegments
  );
  const geometryRectangle = new THREE.BoxGeometry(
    measurements.rectangle.width,
    measurements.rectangle.height,
    measurements.rectangle.depth,
    measurements.rectangle.widthSegments,
    measurements.rectangle.heightSegments,
    measurements.rectangle.depthSegments
  );

  const geometryBigCylinder = new THREE.CylinderGeometry(
    measurements.bigCylinder.radiusTop,
    measurements.bigCylinder.radiusBottom,
    measurements.bigCylinder.height,
    measurements.bigCylinder.radialSegments
  );

  const geometrySideCylinder = new THREE.CylinderGeometry(
    measurements.sideCylinder.radiusTop,
    measurements.sideCylinder.radiusBottom,
    measurements.sideCylinder.height,
    measurements.sideCylinder.radialSegments
  );
  geometrySideCylinder.rotateZ(-Math.PI * 0.5);

  geometryCube.translate(0.5, 0.5, 0);

  // ######## Texture Loaders ##########

  const loaderBigCylinder = new THREE.TextureLoader();
  const loadedTextureBigCylinder = loaderBigCylinder.load(
    measurements.bigCylinder.texture,
    () => {
      loadedTextureBigCylinder.wrapS = THREE.RepeatWrapping;
      loadedTextureBigCylinder.wrapT = THREE.RepeatWrapping;
      loadedTextureBigCylinder.offset.set(0, 0);
      loadedTextureBigCylinder.repeat.set(3, 3);
    }
  );

  const loaderSideCylinder = new THREE.TextureLoader();
  const loadedTextureSideCylinder = loaderSideCylinder.load(
    measurements.bigCylinder.texture,
    () => {
      loadedTextureSideCylinder.wrapS = THREE.RepeatWrapping;
      loadedTextureSideCylinder.wrapT = THREE.RepeatWrapping;
      loadedTextureSideCylinder.offset.set(0, 0);
      loadedTextureSideCylinder.repeat.set(3, 3);
    }
  );

  const loaderCube = new THREE.TextureLoader();
  const loadedCubeTexture = loaderCube.load(measurements.cube.texture);

  const loaderRectangle = new THREE.TextureLoader();
  const loadedRectangleTexture = loaderRectangle.load(
    measurements.rectangle.texture
  );

  // ######## Mesh Materials ##########

  const materialBigCylinder = new THREE.MeshBasicMaterial({
    map: loadedTextureBigCylinder,
    color: color || null,
  });

  const materialSideCylinder = new THREE.MeshBasicMaterial({
    map: loadedTextureSideCylinder,
    color: color || null,
  });

  const materialCube = new THREE.MeshBasicMaterial({
    map: loadedCubeTexture,
    color: color || null,
  });

  const materialRectangle = new THREE.MeshBasicMaterial({
    map: loadedRectangleTexture,
    color: color || null,
  });

  // ######## Machine parts ##########

  const cube = new THREE.Mesh(geometryCube, materialCube);
  const cube2 = new THREE.Mesh(geometryCube, materialCube);
  const rectangle = new THREE.Mesh(geometryRectangle, materialRectangle);
  const bigCylinder = new THREE.Mesh(geometryBigCylinder, materialBigCylinder);
  const sideCylinder = new THREE.Mesh(
    geometrySideCylinder,
    materialSideCylinder
  );

  // ########### Machine Parts Positions #########

  cube.position.set(
    -measurements.rectangle.width / 2 + measurements.cube.width / 2,
    measurements.cube.height / 4,
    0
  );
  cube2.position.set(
    measurements.rectangle.width / 2 - measurements.cube.width / 2,
    measurements.cube.height / 4,
    0
  );
  rectangle.position.set(0, height / 2, 0);
  bigCylinder.position.set(
    (width / 3) * 2 + measurements.bigCylinder.offset,
    height - height / 5,
    0
  );
  sideCylinder.position.set(
    measurements.rectangle.width - measurements.bigCylinder.offset,
    height / 2,
    0
  );
  // floor.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  cube.receiveShadow = true;
  cube2.receiveShadow = true;
  bigCylinder.receiveShadow = true;
  rectangle.receiveShadow = true;
  sideCylinder.receiveShadow = true;
  cube.castShadow = true;
  cube2.castShadow = true;
  bigCylinder.castShadow = true;
  rectangle.castShadow = true;
  sideCylinder.castShadow = true;

  // ######## Build Machine Group #########

  const machine = new THREE.Group();
  machine.add(cube);
  machine.add(cube2);
  machine.add(rectangle);
  machine.add(bigCylinder);
  machine.add(sideCylinder);

  // ########### Machine Name Font and Text #########

  const loaderText = new THREE.FontLoader();

  loaderText.load(`./assets/fonts/gentilis_bold.typeface.json`, result => {
    const textModel = new MODELText({
      font: result,
      content: `MAQ ${text}`,
      size: 10,
    });
    textModel.rotation.y = 2 * Math.PI;
    textModel.position.set((width / 3) * 2, measurements.bigCylinder.height, 0);

    machine.add(textModel);
  });

  return machine;
}
