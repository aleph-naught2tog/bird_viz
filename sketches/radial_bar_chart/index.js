// 1000px is wide enough for all the bars horizontally
// we can reduce this later once we're rotating
const CANVAS_SIZE = 700;
const BACKGROUND = 'gray';
const FILENAME = '../../data/ninesprings.tsv';
const ROBIN_INDEX = 246;
const DATA_POINTS_COUNT = 48;
const MAX_BAR_HEIGHT = 100;
const center = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
const X_CENTER = center.x;
const Y_CENTER = center.y;
const GAP = 2;
const INTERNAL_CIRCLE_RADIUS = 70;
const EXTERNAL_CIRCLE_MAX_RADIUS = INTERNAL_CIRCLE_RADIUS + MAX_BAR_HEIGHT;
const DEGREE_SHIFT = 7.5;

let allData;

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  background(BACKGROUND);
  loadTable(FILENAME, onDataLoad);
}

function draw() {}

function onDataLoad(data) {
  const birdData = data.getRow(ROBIN_INDEX);
  console.debug(birdData.get(0));

  renderChart(birdData);
}

function renderChart(birdData) {
  const barWidth = (2 * PI * INTERNAL_CIRCLE_RADIUS) / DATA_POINTS_COUNT;

  noFill();
  circle(X_CENTER, Y_CENTER, INTERNAL_CIRCLE_RADIUS * 2);

  beginShape();

  colorMode(HSB);

  angleMode(DEGREES);

  for (let index = 0; index < DATA_POINTS_COUNT; index += 1) {
    const birdIndex = index + 1; // +1 because of the name column
    const rawAbundanceValue = birdData.get(birdIndex);

    push();

    // This moves us to the center of the canvas
    translate(width / 2, height / 2);

    // rotate by however far we are
    const degreesToRotate = (360 / DATA_POINTS_COUNT) * index;
    rotate(degreesToRotate);

    const radius = map(rawAbundanceValue, 0, 1, INTERNAL_CIRCLE_RADIUS, 200);
    console.debug(radius);

    const distantRadius = INTERNAL_CIRCLE_RADIUS + radius;
    const distantCircumference = 2 * PI * distantRadius;
    const distantBarWidth = distantCircumference / DATA_POINTS_COUNT;
    const diff = (distantBarWidth - barWidth) / 2;

    const initialPoint = {
      x: 0,
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

    const hue = map(index, 0, 48, 0, 360);
    fill(hue, 100, 85);

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
}
