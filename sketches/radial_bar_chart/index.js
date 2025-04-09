const ROBIN_BLACK = 'black';
const ROBIN_GRAY = '#665864';
const ROBIN_RED = '#dc8758';

const FILENAME = '../../data/ninesprings.tsv';
const ROBIN_INDEX = 246;
const DATA_POINTS_COUNT = 48;

const CANVAS_SIZE = { width: 600 * 2, height: 400 * 2 };
const CENTER = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
const INTERNAL_CIRCLE_RADIUS = 70;
const MAX_EXTERNAL_CIRCLE_RADIUS =
  CANVAS_SIZE.height / 1.5 - INTERNAL_CIRCLE_RADIUS;
const GAP = 4;
// using `Math.PI` instead of PI because p5 constants don't exist before `setup`
const BAR_WIDTH =
  (2 * Math.PI * INTERNAL_CIRCLE_RADIUS) / DATA_POINTS_COUNT - GAP;

const BIRD_NAME = 'American Robin';
const SCIENTIFIC_NAME = 'Turdus migratorius';
const LOCATION_NAME = 'Nine Springs Natural Area';
let img;
let shape;

function preload() {
  img = loadImage('./robin.svg');
}

function setup() {
  createCanvas(CANVAS_SIZE.width, CANVAS_SIZE.height);
  loadTable(FILENAME, onDataLoad);
}

function draw() {}

function onDataLoad(data) {
  const birdData = data.getRow(ROBIN_INDEX);

  renderChart(birdData);
}

function renderChart(birdData) {
  textFont('Happy Monkey');

  background('#a8b5c8');

  colorMode(HSL);
  angleMode(DEGREES);

  writeRobinMetadata();

  translateToCircleCenter();

  image(
    img,
    0 - INTERNAL_CIRCLE_RADIUS / 1.35 + 8,
    0 - INTERNAL_CIRCLE_RADIUS / 1.35 + 4,
    INTERNAL_CIRCLE_RADIUS * 1.35,
    INTERNAL_CIRCLE_RADIUS * 1.35
  );

  push();
  stroke(ROBIN_BLACK);
  strokeWeight(2);
  noFill();
  circle(0, 0, 2 * INTERNAL_CIRCLE_RADIUS - 8);
  pop();

  for (let index = 0; index < DATA_POINTS_COUNT; index += 1) {
    const birdIndex = index + 1; // +1 because of the name column
    const rawAbundanceValue = birdData.get(birdIndex);

    drawQuad(index, rawAbundanceValue);
  }
}

function drawQuad(index, rawAbundanceValue) {
  push();
  strokeWeight(1.5);

  // rotate by however far we are along the circle
  const degreesToRotate = (360 / DATA_POINTS_COUNT) * index;
  rotate(degreesToRotate);

  const barHeight = map(
    rawAbundanceValue,
    0,
    1,
    INTERNAL_CIRCLE_RADIUS,
    MAX_EXTERNAL_CIRCLE_RADIUS
  );

  const distantRadius = INTERNAL_CIRCLE_RADIUS + barHeight;
  const distantCircumference = 2 * PI * distantRadius;
  const distantBarWidth = distantCircumference / DATA_POINTS_COUNT - GAP;
  const diff = (distantBarWidth - BAR_WIDTH) / 2;

  // 48 / 12 is 4
  const isMonthStart = index % 4 === 0;
  const verticalAddition = isMonthStart ? 12 : 0;

  if (isMonthStart) {
    stroke(ROBIN_BLACK);
    strokeWeight(3);
  }

  const initialPoint = {
    x: 0 - BAR_WIDTH / 2,
    y: 0 + -1 * INTERNAL_CIRCLE_RADIUS + verticalAddition,
  };

  const topLeftPoint = {
    x: initialPoint.x - diff,
    y: initialPoint.y + barHeight * -1 - verticalAddition,
  };

  const topRightPoint = {
    x: topLeftPoint.x + distantBarWidth,
    y: topLeftPoint.y,
  };

  // using initialPoint.x here lets us change up the width on top of things
  const bottomRightPoint = {
    x: initialPoint.x + BAR_WIDTH,
    y: initialPoint.y,
  };

  const fillColor = color(
    27,
    map(rawAbundanceValue, 0, 1, 0, 100),
    100 - map(rawAbundanceValue, 0, 1, 0, 50)
  );

  fill(fillColor);

  quad(
    initialPoint.x,
    initialPoint.y,

    topLeftPoint.x,
    topLeftPoint.y,

    topRightPoint.x,
    topRightPoint.y,

    bottomRightPoint.x,
    bottomRightPoint.y
  );

  pop();
}

function translateToCircleCenter() {
  translate(width / 2, height / 3);
}

function writeRobinMetadata() {
  const leftOffset = 16;
  const topOffsetInitial = 600;

  const textDiv = createDiv(`
    <div style='display: flex; flex-direction: column; width: auto; gap: 1rem; font-size: 20px;'>
      <p style='font-size: 24px; font-weight: medium; padding: 0; margin: 0;'>
        American Robin
      </p>
      <p style='font-style: italic; padding: 0; margin: 0;'>
        (Turdus migratorius)
      </p>
      <div style='display: flex; flex-direction: column; gap: 1px;'>
        <p style='padding: 0; margin: 0;'>Nine Springs Natural Area</p>
        <p style='padding: 0; margin: 0;'>Dane County</p>
        <p style='padding: 0; margin: 0;'>Wisconsin</p>
      </div>
      <p style='padding: 0; margin: 0;'>
        1900–2025
      </p>
    </div>
  `);

  textDiv.position(leftOffset, topOffsetInitial);
}
