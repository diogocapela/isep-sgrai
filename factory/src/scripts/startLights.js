function startLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-80, 80, 80);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  camera.add(pointLight);

  /*
  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(15, 40, 150);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 600;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;

  scene.add(spotLight);

  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);
  */
}

startLights();
