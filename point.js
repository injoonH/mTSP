class Point {
  constructor(x, y, r, label, canvas) {
    this.loc = canvas.createVector(x, y);
    this.r = r;
    this.label = label;
    this.canvas = canvas;
    if (label == "City") this.c = CITY_COLOR;
    else if (label == "Salesman") {
      this.c = SALESMAN_COLOR;
      this.closeCitiesLocations = [];
      this.virtualLoc = canvas.createVector(x, y);
      this.bestVisitOrder = [];
      this.shortestDist = null;
    }
  }
}

Point.prototype.isHovered = function () {
  return (
    this.canvas.dist(
      this.loc.x,
      this.loc.y,
      this.canvas.mouseX,
      this.canvas.mouseY
    ) < this.r
  );
};

Point.prototype.show = function () {
  if (this.isHovered()) {
    this.canvas.fill(0);
    this.canvas.noStroke();
    this.canvas.text(
      "(" + this.loc.x + ", " + this.loc.y + ")",
      this.loc.x,
      this.loc.y - MARGIN
    );
    this.canvas.fill(POINT_HOVERED_COLOR);
  } else {
    this.canvas.fill(SKETCH_BACKGROUND_COLOR);
  }
  this.canvas.stroke(this.c);
  this.canvas.strokeWeight(2);
  this.canvas.circle(this.loc.x, this.loc.y, this.r * 2);
};
