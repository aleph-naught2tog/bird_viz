const BACKGROUND = 'gray';
const FILENAME = '../../data/ninesprings.tsv';
const ROBIN_INDEX = 246;
const DATA_POINTS_COUNT = 48;
const MAX_BAR_HEIGHT = 100;
const BAR_WIDTH = 10;
const center = { x: 250, y: 250 };
const X_CENTER = center.x;
const Y_CENTER = center.y;
const GAP = 2;
const CIRCLE_RADIUS = 25;

let allData;

function setup() {
  createCanvas(500, 500);
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

  for (let index = 0; index < DATA_POINTS_COUNT; index += 1) {
    const birdIndex = index + 1; // +1 because of the name column
    const rawAbundanceValue = birdData.get(birdIndex);

    const height = map(rawAbundanceValue, 0, 1, 0, -1 * MAX_BAR_HEIGHT);

    const initialPoint = {
      x: X_CENTER + (BAR_WIDTH * index),
      y: Y_CENTER,
    };
    const topLeftPoint = { x: initialPoint.x, y: initialPoint.y + height };
    const topRightPoint = { x: topLeftPoint.x + BAR_WIDTH, y: topLeftPoint.y };
    const bottomRightPoint = { x: topRightPoint.x, y: initialPoint.y };

    console.debug({
      initialPoint,
      topLeftPoint,
      topRightPoint,
      bottomRightPoint,
    });

    fill('orange');
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
