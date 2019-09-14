function buildFloor() {
  const loader = new THREE.TextureLoader();
  const loadedTexture = loader.load(
    './assets/textures/ciment_1.jpg',
    texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.repeat.set(6, 6);
    }
  );

  const geometry = new THREE.PlaneGeometry(2500, 2500);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: loadedTexture,
  });

  const floor = new THREE.Mesh(geometry, material);

  floor.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z

  return floor;
}
