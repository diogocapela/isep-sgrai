function MODELText({
  content,
  font,
  size = 20,
  height = 5,
  curveSegments,
  bevelEnabled,
  bevelThickness,
  bevelSize,
  bevelOffset,
  bevelSegments,
  color = 0xfe3f4f,
}) {
  const geometry = new THREE.TextGeometry(content, {
    font,
    size,
    height,
    curveSegments,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
  });
  const materials = [
    new THREE.MeshPhongMaterial({ color, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];
  const text = new THREE.Mesh(geometry, materials);
  text.rotation.y = -Math.PI / 2;
  text.position.set(0, 0, 0);
  return text;
}
