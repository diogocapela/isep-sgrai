const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector3();

function getIntersects(x, y) {
  const newX = (x / window.innerWidth) * 2 - 1;
  const newY = -(y / window.innerHeight) * 2 + 1;
  mouseVector.set(newX, newY, 0.5);
  raycaster.setFromCamera(mouseVector, camera);
  return raycaster.intersectObject(scene, true);
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  let selectedObject = null;

  const intersects = getIntersects(event.layerX, event.layerY);

  if (intersects.length > 0) {
    const res = intersects.filter(function(res) {
      return res && res.object;
    })[0];

    if (res && res.object) {
      selectedObject = res.object;
      selectedObject.material.color.set('#f00');
      selectedObject.material.color.set('blue');
    }
  }
}
window.addEventListener('mousemove', onDocumentMouseMove, false);
