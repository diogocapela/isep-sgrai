function buildMachine({
  width = 30,
  height = 20,
  depth = 10,
  widthSegments = 1,
  heightSegments = 1,
  depthSegments = 1,
  texture,
  color,
} = {}) {
  const geometryCube = new THREE.BoxGeometry(
    width / 6,
    height / 2,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
  );
  const geometryRectangle = new THREE.BoxGeometry(
    width,
    height / 4,
    depth,
    widthSegments,
    heightSegments,
    depthSegments
  );

  const loader = new THREE.TextureLoader();
  const loadedTexture = loader.load(
    `./assets/textures/${texture}`
  ); /* , () => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      loadedTexture.offset.set(0, 0);
      loadedTexture.repeat.set(3, 3);
    }); */

  const material = new THREE.MeshBasicMaterial({
    map: loadedTexture,
    color: color || null,
  });

  const cube = new THREE.Mesh(geometryCube, material);
  const cube2 = new THREE.Mesh(geometryCube, material);
  cube.position.set(-width / 3, 0, 0);
  cube2.position.set(width / 3, 0, 0);
  const rectangle = new THREE.Mesh(geometryRectangle, material);
  rectangle.position.set(0, height / 2, 0);
  // floor.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  cube.receiveShadow = true;
  cube2.receiveShadow = true;
  rectangle.receiveShadow = true;
  const machine = new THREE.Group();
  machine.add(cube);
  machine.add(cube2);
  machine.add(rectangle);

  return machine;
}
