function buildPanorama() {
  const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load(
    './assets/textures/panorama_2.jpg'
  );
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const panorama = new THREE.Mesh(geometry, material);

  return panorama;
}
