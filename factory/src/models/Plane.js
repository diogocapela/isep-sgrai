function MODELPlane({
  width = 10,
  height = 10,
  widthSegments = 1,
  heightSegments = 1,
  texture,
  color = 0xa0adaf,
  shininess = 150,
}) {
  const geometry = new THREE.PlaneBufferGeometry(
    width,
    height,
    widthSegments,
    heightSegments
  );

  const loader = new THREE.TextureLoader();
  const loadedTexture = loader.load(`./assets/textures/${texture}`);

  const material = new THREE.MeshPhongMaterial({
    color,
    shininess,
    map: loadedTexture,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0);
  // plane.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  plane.receiveShadow = true;

  return plane;
}
