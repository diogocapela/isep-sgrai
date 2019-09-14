function MODELSnake() {
  const geometry = new THREE.TorusKnotBufferGeometry(0.4, 0.08, 95, 20);

  const material = new THREE.MeshPhongMaterial({
    color: 0x80ee10,
    shininess: 100,
    side: THREE.DoubleSide,
  });
  const snake = new THREE.Mesh(geometry, material);
  snake.castShadow = true;
  return snake;
}
