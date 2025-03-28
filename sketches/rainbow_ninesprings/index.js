// `const` is like `let`, only it means "this won't change"
const ROBIN_INDEX = 14;

const BACKGROUND = "gray";
const FILENAME = "./ninesprings.tsv";

let allData;
let select;

function setup() {
  // The 32 and 16 are just to keep it from
  //    squishing against the edges of the page
  createCanvas(windowWidth - 32, windowHeight - 16);

  // Set the background color
  background(BACKGROUND);

  loadTable(FILENAME, onDataLoad);
}

function onDataLoad(data) {
  // here we assign "data" to "allData" so other functions can access it
  allData = data;

  // then, once we have data, we draw our menu at the top
  makeMenu(data);

  const currentRow = allData.getRow(ROBIN_INDEX);
  renderBarChart(currentRow);
}

// Putting this code in `draw` means that every time `draw` is called
//    it will check to see which bird has been selected, and render that
//    specific bird's chart. It runs 60 times a second unless you change that
function draw() {
  // If the data has been loaded and the select has been created
  // if (allData && select) {
  //   const rowIndex = select.selected();
  //   const currentRow = allData.getRow(rowIndex);

  //   renderBarChart(currentRow);
  // }
}

function makeMenu(data) {
  // Create a select input for us to use
  select = createSelect();

  // Position it 10 pixels to the right and 10 pixels down
  //     from the top-left corner of the canvas
  select.position(10, 10);

  const rows = data.getRows();

  // This sorts all the rows by the name of the bird.
  rows.sort(sortBirdsByName);

  // For every row in the table, add its name to our select input.
  //     rowIndex += 1 is a longer way of writing rowIndex++
  for (let rowIndex = 0; rowIndex < data.getRowCount(); rowIndex += 1) {
    const birdData = data.getRow(rowIndex);

    // The bird name is the first item in the row
    const birdName = birdData.get(0);
    const name = cleanBirdName(birdName);

    // Add an option to the select that reads `name` and
    //    has the value of `rowIndex`
    select.option(name, rowIndex);
  }

  // This, **outside** the loop, sets what default selection should be
  select.selected(ROBIN_INDEX);
}

function renderBarChart(birdData) {
  // Resetting the background here resets the graph, and ensures that
  //     we aren't putting bars on top of bars on top of bars.
  //     If you remove this line, you can see how the bars
  //   start to stack!
  background(BACKGROUND);

  // This is a little ugly; the "birdData" object has something called
  //     "arr" in it that represents the items inside the row. Then we subtract
  //     1 from it, since we are ignoring the first item (the bird name)
  const barCount = birdData.arr.length - 1;

  for (let index = 1; index < barCount; index += 1) {
    // This groups the values by "month" -- 48 columns into 12 months
    const monthIndex = index / 4;

    const abundanceValue = birdData.get(index);

    // The code here is to make the rainbow
    //     "Saturation" is how vivid the color should be, represented as a percent
    //     100% is full living color, 0% is colorless (black or white)
    //     By mapping the abundanceValue from 0 to 100, we have intense colors
    //     on days with lots of observations, and pale colors when there are few
    const saturation = map(abundanceValue, 0, 1, 0, 100);

    // Here, we do something similar.
    //     "Hue" represents the actual color on a color wheel -- as you walk around
    //     the colorwheel like a circle, your angle changes, and that represents the color
    //     There's 360 degrees in a circle, so that's why we vary here
    // const hue = map(monthIndex, 0, 12, 0, 360);
    const hue = calculateColor(monthIndex)

    // This changes the way p5 interprets colors from names or hex codes to
    //     a "Hue Saturation Brightness" color, which lets us use our values above!
    colorMode(HSB);

    // Here, since we changed to HSB, we give the fill three
    //     values -- hue, saturation, and brightness which we set to 100%
    //     (this keeps things bright instead of being black)
    fill(hue, saturation * 1.5, 100);

    const barWidth = width / barCount;

    // -1 makes the chart go upwards instead
    const barHeight = -1 * height * abundanceValue;

    // This is how much space you want in between the bars
    const gap = 2;

    // Where to start the columns on the x axis
    const xStart = index * barWidth;

    // Draw the rectangle!
    rect(xStart, height, barWidth - gap, barHeight);
  }
}

// ======================================
// ====== Little helper functions =======
// ======================================

/*
  This is used to sort the rows by the name of the bird.

  It is a function that takes two rows at a time and compares them,
  however we want to compare them.

  Returning `1` or `-1` is just how you write functions like this.
*/
function sortBirdsByName(firstRow, secondRow) {
  // The bird name is the first item
  const firstRowName = firstRow.get(0).toLowerCase();
  const secondRowName = secondRow.get(0).toLowerCase();

  // The < here is just like in math, even though we're comparing names
  // Here it means:  "if the first name comes before the second name"
  if (firstRowName < secondRowName) {
    return -1;
  } else {
    return 1;
  }
}

// This removes the stuff after the bird name that looks like `<em ...`
function cleanBirdName(birdName) {
  return birdName.replaceAll(/<\/?[^>]+>/g, "");
}

function calculateColor(monthIndex) {
  const scaled = map(monthIndex, 0, 12, 0, 1);
  const degrees = Math.floor(scaled * 180);
  const asRadians = radians(degrees);

  // subtracting from 360 changes the direction we go through the wheel
  // 180 to 360 pins us on a certain part

  // TODO: it'd be really cool to use weather data here
  const hue = 360 - map(sin(asRadians), 0, 1, 180, 360);

  return hue;
}
