// 1000px is wide enough for all the bars horizontally
// we can reduce this later once we're rotating
const CANVAS_SIZE = 1000;
const BACKGROUND = 'gray';
const FILENAME = '../../data/ninesprings.tsv';
const ROBIN_INDEX = 246;
const DATA_POINTS_COUNT = 48;
const MAX_BAR_HEIGHT = 100;
const BAR_WIDTH = 10;
const center = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
const X_CENTER = center.x;
const Y_CENTER = center.y;
const GAP = 2;
const INTERNAL_CIRCLE_RADIUS = 25;
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
  // draw a circle

  /*
    for every point
      draw a quadrilateral
      whose "base" points are on the circle
      and whose end points are the value scaled to some height
      (long-term: arc, line, arc, line)

      will need trig eventually
      eg, very first point will start at 250, 250
      height: map(abundance, 0, 1, 0, MAX_BAR_HEIGHT)
      point 1: 250, 250
      point 2: 250, height
      point 3: height, 250 + barwidth
      point 4:: 250 + bar width, 250

      maybe pointy arcs is easier to start?
  */
  circle(X_CENTER, Y_CENTER, INTERNAL_CIRCLE_RADIUS * 2);

  translate(width / 2, height / 2);

  beginShape()
  noFill()

  for (let index = 0; index < DATA_POINTS_COUNT; index += 1) {
    rotate(7.5)
    const birdIndex = index + 1; // +1 because of the name column
    const rawAbundanceValue = birdData.get(birdIndex);

    const radius = -1 * map(rawAbundanceValue, 0, 1, 25, 200);
    const currentAngle = map(index, 0, DATA_POINTS_COUNT, 0, 360);

    const initialPoint = {
      x: (BAR_WIDTH * index),// * Math.cos(currentAngle),
      y: -1 * INTERNAL_CIRCLE_RADIUS,//  * Math.sin(currentAngle),
      // x: radius * Math.cos(currentAngle),
      // y: radius * Math.sin(currentAngle)
    };

    const topLeftPoint = { x: initialPoint.x, y: initialPoint.y + radius };
    const topRightPoint = { x: topLeftPoint.x + BAR_WIDTH, y: topLeftPoint.y };
    const bottomRightPoint = { x: topRightPoint.x, y: initialPoint.y };

    // console.debug({
    //   initialPoint,
    //   topLeftPoint,
    //   topRightPoint,
    //   bottomRightPoint,
    // });

    colorMode(HSB);
    fill(map(index, 0, 48, 0, 360), 100, 85);
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
  }
}
