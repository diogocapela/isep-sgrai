function buildProductionLine({ largura, comprimento, text } = {}) {
  this.largura = largura;
  this.comprimento = comprimento;
  this.text = text;

  const measurements = {
    backWall: {
      width: this.largura,
      height: 50,
      texture: 'factory_wall_1.jpg',
    },
    frontWall: {
      width: this.largura,
      height: 10,
      texture: 'factory_wall_1.jpg',
    },
    sideWall: {
      width: this.comprimento,
      texture: 'factory_wall_1.jpg',
      height: 10,
    },
    conveyorBelt: {
      width: 25,
      height: 5,
      texture: 'moving_staircase_1.jpg',
      depth: this.comprimento,
    },
  };

  const productionLine = new THREE.Group();

  const ground = MODELCube({
    width: this.largura,
    height: this.comprimento,
    texture: 'factory_floor_1.jpg',
  });
  ground.position.set(this.largura / 2, 0, this.comprimento / 2);
  ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z

  const wall_1 = new MODELCube({
    width: measurements.backWall.width,
    texture: measurements.backWall.texture,
    height: measurements.backWall.height,
  });
  wall_1.position.set(this.largura / 2, 25, 0);

  const wall_2 = new MODELCube({
    width: measurements.frontWall.width,
    texture: measurements.frontWall.texture,
    height: measurements.frontWall.height,
  });
  wall_2.position.set(this.largura / 2, 5, this.comprimento);

  const wall_3 = new MODELCube({
    width: measurements.sideWall.width,
    texture: measurements.sideWall.texture,
    height: measurements.sideWall.height,
  });
  wall_3.position.set(0, 5, this.comprimento / 2);
  wall_3.rotation.y = -Math.PI / 2;

  const wall_4 = new MODELCube({
    width: measurements.sideWall.width,
    texture: measurements.sideWall.texture,
    height: measurements.sideWall.height,
  });
  wall_4.position.set(this.largura, 5, this.comprimento / 2);
  wall_4.rotation.y = -Math.PI / 2;

  const conveyorBelt = new MODELCube({
    width: measurements.conveyorBelt.width,
    height: measurements.conveyorBelt.height,
    texture: measurements.conveyorBelt.texture,
    depth: measurements.conveyorBelt.depth,
  });
  conveyorBelt.position.set(
    this.largura / 2,
    measurements.conveyorBelt.height / 2,
    this.comprimento / 2
  );

  const loader = new THREE.FontLoader();

  loader.load(`assets/fonts/gentilis_bold.typeface.json`, result => {
    const textModel = new MODELText({
      font: result,
      content: text,
      size: 10,
      color: 0xfff000
    });
    textModel.rotation.y = 2 * Math.PI;
    textModel.position.set(0, 25, 0);

    productionLine.add(textModel);
  });

  productionLine.add(ground);
  productionLine.add(wall_1);
  productionLine.add(wall_2);
  productionLine.add(wall_3);
  productionLine.add(wall_4);
  productionLine.add(conveyorBelt);

  return productionLine;
}
