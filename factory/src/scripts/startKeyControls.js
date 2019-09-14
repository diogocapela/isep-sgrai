function onDocumentKeyDown(event) {
  const delta = 1;
  event = event || window.event;
  const keycode = event.keyCode;
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      camera.position.x += delta;
      break;
    case 'ArrowDown':
    case 's':
      camera.position.x -= delta;
      break;
    case 'ArrowLeft':
    case 'a':
      camera.rotation.y += degInRad(1);
      break;
    case 'ArrowRight':
    case 'd':
      camera.rotation.y -= degInRad(1);
      break;
    default:
  }
}

document.addEventListener('keydown', onDocumentKeyDown, false);
