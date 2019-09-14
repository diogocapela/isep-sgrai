/* eslint-disable no-undef */
/* eslint-disable camelcase */

$('body').append(`
<section style="position: absolute; top: 0; right: 0;">

    <div>
        <input type="range" id="inputCameraPositionX" min="-500" max="500">
        <label>Camera X</label>
    </div>

    <div>
        <input type="range" id="inputCameraPositionY" min="-500" max="500">
        <label>Camera Y</label>
    </div>

    <div>
        <input type="range" id="inputCameraPositionZ" min="-500" max="500">
        <label>Camera Z</label>
    </div>

    <input id="productionLineIndex" placeholder="Production Line Index" />
    <button id="generateOrder">Generate Order</button>
    <br/>

    <input id="factoryRotationDegress" placeholder="Factory Rotation Degrees" />
    <button id="factoryRotationButton">Rotate Factory</button>
    <br/>

    <input id="machineId" placeholder="Machine id" />
    <br/>
    <input id="productionLineDestinationId" placeholder="ProductionLine Destination id" />
    <button id="moveMachineButton">Move Machine</button>


</section>
`);

$('#inputCameraPositionX').change(e => {
  camera.position.x = e.target.value || 0;
});

$('#inputCameraPositionY').change(e => {
  camera.position.y = e.target.value || 0;
});

$('#inputCameraPositionY').change(e => {
  camera.position.z = e.target.value || 0;
});

$('#generateOrder').click(e => {
  const index = $('#productionLineIndex').val();

  const productObject = buildProduct({
    productionLine: index,
  });

  if (typeof PRODUCTION_LINES[index] === 'undefined') return;

  const sound_machine_1 = document.getElementById('sound_machine_1');

  sound_machine_1.play();

  productObject.product.position.set(
    GLOBALS.productionLine.largura * (index - 2) +
      GLOBALS.productionLine.largura / 2 +
      GLOBALS.productionLine.largura -
      (GLOBALS.productionLine.largura * PRODUCTION_LINES.length) / 2,
    10,
    PRODUCT_STARTING_POINT_Y
  );

  scene.add(productObject.product);
  PRODUCTS.push(productObject);

  setTimeout(() => {
    scene.remove(productObject.product);
    sound_machine_1.pause();
  }, PRODUCTION_LINES[index].machines.length * 3300);
});

$('#factoryRotationButton').click(e => {
  const degrees = $('#factoryRotationDegress').val();
  const radians = (degrees * Math.PI) / 180;
  const axis = new THREE.Vector3(0, 1, 0);
  const matrix = new THREE.Matrix4();
  /* matrix.set( 1, 1, 1, 1,
              1, 1, 1, 1,
              1, 1, 1, 123445,
              1, 1, 1, 1); */
  matrix.makeRotationY(radians);
  factory.applyMatrix(matrix.makeTranslation(0, 0, 0));
  factory.rotateOnAxis(axis, radians);
});

$('#moveMachineButton').click(async e => {
  const machineId = $('#machineId').val();
  const productionLineName = $('#productionLineDestinationId').val();

  let newProductionLine;
  let newProductionLineId;
  let data = await fetch(
    'https://3na66-factory-prod.azurewebsites.net/api/v1/production-lines',
    {
      method: 'GET',
    }
  );
  data = await data.json();

  data.forEach(function(productionLine) {
    if (productionLine.name == productionLineName) {
      productionLine.machines.push(parseInt(machineId, 10));
      console.log(productionLine);
      newProductionLineId = productionLine.id;
      newProductionLine = {
        name: productionLine.name,
        description: productionLine.description,
        machines: productionLine.machines,
      };
    }
  });

  await fetch(
    `https://3na66-factory-prod.azurewebsites.net/api/v1/production-lines/${newProductionLineId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProductionLine),
    }
  );

  /* const resData = await fetch(
    `https://3na66-factory-prod.azurewebsites.net/api/v1/production-lines`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  const data222222 = await resData.json(); */

  window.location.reload();
});
