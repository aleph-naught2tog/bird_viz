const ROBIN_BLACK = '#0a060d';
const ROBIN_GRAY = '#aaa7ad';
const ROBIN_RED = '#f08a35';

const FILENAME = '../../data/ninesprings.tsv';
const ROBIN_INDEX = 246;
const DATA_POINTS_COUNT = 48;

const CANVAS_SIZE = 700;
const CENTER = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
const INTERNAL_CIRCLE_RADIUS = 70;
const MAX_EXTERNAL_CIRCLE_RADIUS = 300;
const GAP = 4;

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  background(ROBIN_GRAY);
  loadTable(FILENAME, onDataLoad);
}

function draw() {}

function onDataLoad(data) {
  const birdData = data.getRow(ROBIN_INDEX);
  console.debug(birdData.get(0));

  renderChart(birdData);
}

function renderChart(birdData) {
  const barWidth = (2 * PI * INTERNAL_CIRCLE_RADIUS) / DATA_POINTS_COUNT - GAP;

  fill(ROBIN_GRAY);
  circle(CENTER.x, CENTER.y, INTERNAL_CIRCLE_RADIUS * 2);

  beginShape();

  colorMode(HSL);

  angleMode(DEGREES);

  for (let index = 0; index < DATA_POINTS_COUNT; index += 1) {
    const birdIndex = index + 1; // +1 because of the name column
    const rawAbundanceValue = birdData.get(birdIndex);

    push();

    // This moves us to the center of the canvas
    translate(width / 2, height / 2);

    // rotate by however far we are along the circle
    const degreesToRotate = (360 / DATA_POINTS_COUNT) * index;
    rotate(degreesToRotate);

    const radius = map(rawAbundanceValue, 0, 1, INTERNAL_CIRCLE_RADIUS, MAX_EXTERNAL_CIRCLE_RADIUS);

    const distantRadius = INTERNAL_CIRCLE_RADIUS + radius;
    const distantCircumference = 2 * PI * distantRadius;
    const distantBarWidth = distantCircumference / DATA_POINTS_COUNT - GAP;
    const diff = (distantBarWidth - barWidth) / 2;

    const initialPoint = {
      x: 0 - barWidth / 2,
      y: 0 + -1 * INTERNAL_CIRCLE_RADIUS,
    };

    const topLeftPoint = {
      x: initialPoint.x - diff,
      y: initialPoint.y + radius * -1,
    };

    const topRightPoint = {
      x: topLeftPoint.x + distantBarWidth,
      y: topLeftPoint.y,
    };

    // using initialPoint.x here lets us change up the width on top of things
    const bottomRightPoint = {
      x: initialPoint.x + barWidth,
      y: initialPoint.y,
    };

    fill(27, map(rawAbundanceValue, 0, 1, 0, 100), map(rawAbundanceValue, 0, 1, 0, 50));

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

    // if (index % 4 === 0) {
    //   text("honk", 0, INTERNAL_CIRCLE_RADIUS + MAX_EXTERNAL_CIRCLE_RADIUS + 20)
    // }

    pop();
  }
}
