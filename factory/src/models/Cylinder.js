function MODELCylinder({
  radius = 5,
  height = 20,
  heightSegments = 1,
  radialSegments = 10,
  texture,
  color,
}) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    radialSegments
  );

  const loader = new THREE.TextureLoader();
  const loadedTexture = loader.load(`./assets/textures/${texture}`, () => {
    loadedTexture.wrapS = THREE.RepeatWrapping;
    loadedTexture.wrapT = THREE.RepeatWrapping;
    loadedTexture.offset.set(0, 0);
    loadedTexture.repeat.set(3, 3);
  });

  const material = new THREE.MeshBasicMaterial({
    map: loadedTexture,
    color: color || null,
  });

  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.set(0, 0, 0);
  // floor.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  cylinder.receiveShadow = true;

  return cylinder;
}
