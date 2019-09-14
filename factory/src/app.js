/* eslint-disable no-loop-func */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
const socket = io.connect('https://ge.diog.co');

let lstMachines = [];
let lstMachinesTypes = [];
let lstOperations = [];
let lstProductionPlanning = [];

let scene;
let camera;
let renderer;
let factory;
let raycaster;
const machines = [];
let controls;
let selection;
let tooltipDisplayTimeout;
const GLOBALS = {
  productionLine: {
    largura: 100,
  },
  machine: {
    comprimento: 100,
  },
  factoryComprimentoMax: 0,
};

const PRODUCTS = [];
let PRODUCTION_LINES = [];

const mouse = new THREE.Vector2(1, 1);
const intersectObject = [];

let PRODUCT_STARTING_POINT_Y;

async function init() {
  /* Setup
    ================================================================== */
  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();
  camera = new THREE.PerspectiveCamera(
    100, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    10, // near
    1000 // far
  );

  camera.position.set(500, 1000, 1000);
  camera.position.z = 5000;
  // camera.position.set(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('tomato');
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  factory = new THREE.Group();

  const box = new THREE.Box3();
  box.setFromCenterAndSize(
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(2, 1, 3)
  );

  const helper = new THREE.Box3Helper(box, 0xffff00);
  scene.add(helper);

  // Dinamically generate production lines
  // ===================================================================

  lstMachines =
    (await fetch(
      'https://3na66-factory-prod.azurewebsites.net/api/v1/machines'
    )) || [];
  lstMachinesTypes =
    (await fetch(
      'https://3na66-factory-prod.azurewebsites.net/api/v1/machine-types'
    )) || [];
  lstOperations =
    (await fetch(
      'https://3na66-factory-prod.azurewebsites.net/api/v1/operations'
    )) || [];
  PRODUCTION_LINES =
    (await fetch(
      'https://3na66-factory-prod.azurewebsites.net/api/v1/production-lines'
    )) || [];
  lstProductionPlanning =
    (await fetch(
      'http://pp-prod.northeurope.cloudapp.azure.com:8080/api/planning'
    )) || [];

  lstMachines = await lstMachines.json();
  lstMachinesTypes = await lstMachinesTypes.json();
  lstOperations = await lstOperations.json();
  PRODUCTION_LINES = await PRODUCTION_LINES.json();
  lstProductionPlanning = await lstProductionPlanning.json();

  lstProductionPlanning.forEach(pp => {
    lstMachines.forEach(machine => {
      if (pp.machine === `m${machine.id}`) {
        // eslint-disable-next-line no-param-reassign
        machine.tasks = pp.tasks;
      }
    });
  });

  let factoryLargura = 0;
  factoryComprimentoMax = 0;

  // For each PRODUCTION LINE
  // ===================================================================
  for (let i = 0; i < PRODUCTION_LINES.length; i++) {
    factoryLargura = PRODUCTION_LINES.length * GLOBALS.productionLine.largura;

    const pl = buildProductionLine({
      comprimento:
        PRODUCTION_LINES[i].machines.length * GLOBALS.machine.comprimento,
      largura: GLOBALS.productionLine.largura,
      text: PRODUCTION_LINES[i].name,
    });
    pl.position.set(GLOBALS.productionLine.largura * i, 0, 0);
    factory.add(pl);

    // For each MACHINE
    // ===================================================================
    for (let k = 0; k < PRODUCTION_LINES[i].machines.length; k++) {
      baselineY = GLOBALS.machine.comprimento / 2;
      baselineX = GLOBALS.productionLine.largura / 2;

      const machineComprimento = baselineY + k * GLOBALS.machine.comprimento;

      if (machineComprimento > factoryComprimentoMax) {
        factoryComprimentoMax = machineComprimento;
      }
      let currentMachine = lstMachines.find(
        x => x.id === PRODUCTION_LINES[i].machines[k]
      );
      const m = buildSuperMachine({
        width: 40,
        height: 30,
        depth: 20,
        text: PRODUCTION_LINES[i].machines[k],
        tasks: currentMachine.tasks,
      });
      m.position.set(
        baselineX + i * GLOBALS.productionLine.largura,
        4,
        machineComprimento
      );
      let currentMachineType = lstMachinesTypes.find(
        x => x.id === currentMachine.machineType
      );
      let currentOperations = lstOperations.filter(
        value => currentMachineType.operations.indexOf(value.id) !== -1
      );
      let opText = '';
      for (let x = 0; x < currentOperations.length; x++) {
        opText += `${currentOperations[x].name} `;
      }

      const THIS_MAQ_OPERATIONS = lstMachinesTypes
        .find(mt => currentMachine.machineType === mt.id)
        .operations.map(o => o.name)
        .join(', ');

      let TASKS_DATA = '';

      (currentMachine.tasks || []).forEach(task => {
        TASKS_DATA += `<br />`;
        if (task.action === 'setup') {
          TASKS_DATA += `Action: SETUP (${task.fromTime} - ${task.toTime})<br />`;
          TASKS_DATA += `Tool: ${task.bodyAction.tool}`;
        }
        if (task.action === 'exec') {
          TASKS_DATA += `Action: EXEC (${task.fromTime} - ${task.toTime})<br />`;
          TASKS_DATA += `Client: ${task.bodyAction.client}<br />Operation: ${task.bodyAction.op}<br />Product: ${task.bodyAction.product}<br />Qty: ${task.bodyAction.qty}<br />Task: ${task.bodyAction.task}`;
        }
        TASKS_DATA += `<br />`;
      });

      m.userData = {
        text: `ID: ${currentMachine.id}<br />Name: ${
          currentMachine.name
        }<br />Type: ${currentMachineType.name}<br />${
          (currentMachine.tasks || []).length > 0
            ? `<br />Tasks:<br />${TASKS_DATA}`
            : ''
        }`,
      };

      factory.add(m);
      machines.push(m);
      {
        let i;
        for (i = 0; i < m.children.length; i++)
          intersectObject.push(m.children[i]);
      }
    }
  }
  // GLOBAL Para inicio do produto
  PRODUCT_STARTING_POINT_Y = -factoryComprimentoMax / 2;
  factory.position.set(-factoryLargura / 2, 0, -factoryComprimentoMax / 2);
  scene.add(factory);

  const panorama = buildPanorama();
  scene.add(panorama);

  const floor = buildFloor();
  scene.add(floor);
}

function animate() {
  requestAnimationFrame(animate);

  PRODUCTS.forEach(p => {
    const comprimento =
      PRODUCTION_LINES[p.productionLine].machines.length *
      GLOBALS.machine.comprimento;
    if (p.product.position.z == comprimento - factoryComprimentoMax / 2) {
      scene.remove(p.product);
    }
    p.product.position.z += 1;
  });

  renderer.render(scene, camera);
}

// This will move tooltip to the current mouse position and show it by timer.
function showTooltip(hoveredObj) {
  const divElement = $('#tooltip');

  if (divElement && latestMouseProjection) {
    divElement.css({
      display: 'block',
      opacity: 0.0,
    });

    const canvasHalfWidth = renderer.domElement.offsetWidth / 2;
    const canvasHalfHeight = renderer.domElement.offsetHeight / 2;

    const tooltipPosition = latestMouseProjection.clone().project(camera);
    tooltipPosition.x =
      tooltipPosition.x * canvasHalfWidth +
      canvasHalfWidth +
      renderer.domElement.offsetLeft;
    tooltipPosition.y =
      -(tooltipPosition.y * canvasHalfHeight) +
      canvasHalfHeight +
      renderer.domElement.offsetTop;

    const tootipWidth = divElement[0].offsetWidth;
    const tootipHeight = divElement[0].offsetHeight;

    divElement.css({
      left: `${tooltipPosition.x - tootipWidth / 2}px`,
      top: `${tooltipPosition.y - tootipHeight - 5}px`,
    });

    // var position = new THREE.Vector3();
    // var quaternion = new THREE.Quaternion();
    // var scale = new THREE.Vector3();
    // hoveredObj.matrix.decompose(position, quaternion, scale);

    // get the data for this specific machine.
    // eslint-disable-next-line guard-for-in
    // eslint-disable-next-line no-restricted-syntax
    let i;
    let j;
    for (i = 0; i < machines.length; i++) {
      let meshArrayForGivenMachine = machines[i].children;
      for (j = 0; j < meshArrayForGivenMachine.length; j++) {
        let msh = meshArrayForGivenMachine[j];
        if (msh.uuid === hoveredObj.uuid) {
          divElement.html(`${machines[i].userData.text}`);
        }
      }
    }

    setTimeout(() => {
      divElement.css({
        opacity: 1.0,
      });
    }, 25);
  }
}

// This will immediately hide tooltip.
function hideTooltip() {
  const divElement = $('#tooltip');
  if (divElement) {
    divElement.css({
      display: 'none',
    });
  }
}

// Following two functions will convert mouse coordinates
// from screen to three.js system (where [0,0] is in the middle of the screen)
function updateMouseCoords(event, coordsObj) {
  coordsObj.x =
    ((event.clientX - renderer.domElement.offsetLeft + 0.5) /
      window.innerWidth) *
      2 -
    1;
  coordsObj.y =
    -(
      (event.clientY - renderer.domElement.offsetTop + 0.5) /
      window.innerHeight
    ) *
      2 +
    1;
}

function handleManipulationUpdate() {
  raycaster.setFromCamera(mouse, camera);
  {
    const intersects = raycaster.intersectObjects(intersectObject, true);
    if (intersects.length > 0) {
      latestMouseProjection = intersects[0].point;
      hoveredObj = intersects[0].object;
    }
  }

  if (tooltipDisplayTimeout || !latestMouseProjection) {
    clearTimeout(tooltipDisplayTimeout);
    tooltipDisplayTimeout = undefined;
    hideTooltip();
  }

  if (!tooltipDisplayTimeout && latestMouseProjection) {
    tooltipDisplayTimeout = setTimeout(function() {
      tooltipDisplayTimeout = undefined;
      showTooltip(hoveredObj);
    }, 330);
  }
}

function onMouseMove(event) {
  updateMouseCoords(event, mouse);

  latestMouseProjection = undefined;
  hoveredObj = undefined;
  handleManipulationUpdate();
}

window.addEventListener('mousemove', onMouseMove, false);
init();
animate();
