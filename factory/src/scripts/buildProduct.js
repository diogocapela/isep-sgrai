function buildProduct({
  width = 10,
  height = 10,
  depth = 20,
  color = getRandomColor(),
  productionLine,
} = {}) {
  const geometry = new THREE.BoxGeometry(width, height, depth);

  const material = new THREE.MeshBasicMaterial({
    color: color || null,
  });

  const product = new THREE.Mesh(geometry, material);
  product.position.set(0, 0, 0);
  // floor.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  product.receiveShadow = true;
  product.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  const productReturn = {
    product,
    productionLine,
  };
  return productReturn;
}
