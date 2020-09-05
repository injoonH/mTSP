let city = [];
let salesman = [];
let curMode = "City";

let sketch = new p5((s) => {
  s.setup = () => {
    s.createCanvas(SKETCH_X, SKETCH_Y).position(0, 0);
  };

  s.draw = () => {
    s.background(SKETCH_BACKGROUND_COLOR);
    if (salesman.length > 0) {
      s.strokeWeight(2);
      s.stroke(0);
      s.noFill();
      for (let sale of salesman) {
        s.beginShape();
        s.vertex(sale.loc.x, sale.loc.y);
        // for (let idx of sale.bestVisitOrder) {
        //   let c = sale.closeCitiesLocations[idx];
        //   s.vertex(c.x, c.y);
        // }
        for (let i = 0; i < sale.bestVisitOrder.length; i++) {
          let idx = sale.bestVisitOrder[i];
          let c = sale.closeCitiesLocations[idx];
          s.vertex(c.x, c.y);
        }
        s.vertex(sale.loc.x, sale.loc.y);
        s.endShape();
      }
    }
    for (let i = 0; i < city.length; i++) city[i].show();
    for (let i = 0; i < salesman.length; i++) salesman[i].show();
  };

  s.mouseClicked = () => {
    if (
      s.mouseX > 0 &&
      s.mouseX < s.width &&
      s.mouseY > 0 &&
      s.mouseY < s.height
    ) {
      if (curMode == "City") {
        city.push(new Point(s.mouseX, s.mouseY, POINT_RADIUS, curMode, s));
      } else if (curMode == "Salesman") {
        salesman.push(new Point(s.mouseX, s.mouseY, POINT_RADIUS, curMode, s));
      } else if (curMode == "Delete") {
        let flag = true;
        for (let i = city.length - 1; i >= 0; i--) {
          if (city[i].isHovered()) {
            city.splice(i, 1);
            flag = false;
            break;
          }
        }
        if (flag) {
          for (let i = salesman.length - 1; i >= 0; i--) {
            if (salesman[i].isHovered()) {
              salesman.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  };
});
