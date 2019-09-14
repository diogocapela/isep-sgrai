function startOrbitControls() {
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.minDistance = 20;
  controls.maxDistance = 250;
  controls.maxPolarAngle = Math.PI / 2;

  controls.target.set(0, 1, 0);
  controls.update();
}

startOrbitControls();
