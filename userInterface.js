let interface = new p5((s) => {
  s.setup = () => {
    s.createCanvas(INTERFACE_X, INTERFACE_Y).position(SKETCH_X + MARGIN, 0);
    document.getElementById("defaultCanvas1").style.zIndex = -1;

    s.cityBtn = s.select("#City");
    s.salesBtn = s.select("#Salesman");
    s.deltBtn = s.select("#Delete");
    s.clrBtn = s.select("#Clear");
    s.xInput = s.select("#DirectX");
    s.yInput = s.select("#DirectY");
    s.genPointBtn = s.select("#DirectGenerate");
    s.firstPopInput = s.select("#FirstPopsize");
    s.popInput = s.select("#Popsize");
    s.genInput = s.select("#Generation");
    s.crossInput = s.select("#CrossoverProb");
    s.mutateInput = s.select("#MutationProb");
    s.maxIterInput = s.select("#MaxIter");
    s.algorithmBtn = s.select("#StartAlgorithm");

    s.setPosition();

    s.cityBtn.mousePressed(function () {
      curMode = "City";
    });
    s.salesBtn.mousePressed(function () {
      curMode = "Salesman";
    });
    s.deltBtn.mousePressed(function () {
      curMode = "Delete";
    });
    s.clrBtn.mousePressed(function () {
      city = [];
      salesman = [];
    });

    s.genPointBtn.mousePressed(function () {
      let x = s.constrain(s.xInput.value(), 0, SKETCH_X);
      let y = s.constrain(s.yInput.value(), 0, SKETCH_Y);
      if (curMode == "City")
        city.push(new Point(x, y, POINT_RADIUS, curMode, sketch));
      else if (curMode == "Salesman")
        salesman.push(new Point(x, y, POINT_RADIUS, curMode, sketch));
    });

    s.algorithmBtn.mousePressed(function () {
      for (let i = 0; i < salesman.length; i++)
        salesman[i].virtualLoc = salesman[i].loc.copy();

      for (let i = 0; i < s.maxIterInput.value(); i++) {
        console.log(i + 1 + "번째 군집화\n");
        for (let j = 0; j < salesman.length; j++)
          salesman[j].closeCitiesLocations = [];
        s.matchCitiesToSalesman();
        let flag = s.moveSalesmanToMeanPoint();
        if (flag) break;
      }
      console.log("==========================================");

      // Genetic Algorithm Starts
      for (let i = 0; i < salesman.length; i++) {
        salesman[i].bestVisitOrder = [];
        salesman[i].shortestDist = Infinity;
        if (salesman[i].closeCitiesLocations.length == 0) {
          salesman[i].shortestDist = 0;
          continue;
        }
        let visitOrders = s.getFirstGeneration(salesman[i]);
        console.log(i + 1 + "번째 외판원의 최초 염색체 풀 형성 완료!");
        for (let j = 0; j < s.genInput.value(); j++) {
          console.log(i + 1 + "번째 외판원의 " + (j + 1) + "번째 세대");
          console.log("==========================================");

          // console.log("orders:", visitOrders);

          let dists = s.getDistsOfOrder(salesman[i], visitOrders);
          console.log("각 경로의 총 거리 계산 완료!");
          // console.log(dists);

          let shortestDist = dists[s.getShortestIndex(dists)];
          console.log("최단 거리 계산 완료!\n최단 거리: " + shortestDist);

          let shortestOrder = visitOrders[s.getShortestIndex(visitOrders)];
          console.log(
            "최단 거리 배열 계산 완료!\n최단 거리 배열: " + shortestOrder
          );

          if (salesman[i].shortestDist > shortestDist) {
            salesman[i].shortestDist = shortestDist;
            salesman[i].bestVisitOrder = shortestOrder;
          }
          console.log("지금까지 최단 거리: " + salesman[i].shortestDist);
          console.log("지금까지 최단 배열: " + salesman[i].bestVisitOrder);

          let fitness = s.getFitness(dists);
          console.log("각 염색체의 적합도 계산 완료!");
          // console.log(fitness);

          let sum = 0;
          for (let f of fitness) sum += f;
          console.log("적합도 합:", sum);

          let parentA = s.getOneParent(fitness, visitOrders);
          let parentB = s.getOneParent(fitness, visitOrders);
          console.log(
            "부모 배열로 선택된 두 배열은 각각\n" + parentA + "\n" + parentB
          );

          let nextOrders = [];
          for (let k = 0; k < s.popInput.value(); k++) {
            let child;
            if (s.crossInput.value() > s.random())
              child = s.getChildByCrossover(parentA, parentB);
            else child = parentA.slice(0);
            if (s.mutateInput.value() > s.random() && child.length > 1)
              child = s.mutateOrder(child);
            nextOrders.push(child);
          }
          visitOrders = nextOrders.slice(0);
          console.log("자식 세대 생성 완료!");
          console.log("==========================================");
        }
      }
    });
  };

  s.draw = () => {
    s.background(INTERFACE_BACKGROUND_COLOR);
    s.fill(INTERFACE_TEXT_COLOR);
    s.textSize(INTERFACE_TEXT_SIZE);
    let x = s.constrain(sketch.mouseX, 0, SKETCH_X);
    let y = s.constrain(sketch.mouseY, 0, SKETCH_Y);

    let top = MARGIN;

    s.push();
    s.textAlign(s.CENTER, s.CENTER);
    s.text("Mouse Coordinate: (" + x + ", " + y + ")", INTERFACE_X / 2, top);
    s.pop();

    top +=
      MARGIN * 3 + s.cityBtn.height + s.clrBtn.height + s.xInput.height / 2;

    s.push();
    s.textAlign(s.LEFT, s.CENTER);
    s.text("x", MARGIN + INTERFACE_TEXT_SIZE, top);
    s.pop();

    top += MARGIN + s.xInput.height / 2 + s.yInput.height / 2;

    s.push();
    s.textAlign(s.LEFT, s.CENTER);
    s.text("y", MARGIN + INTERFACE_TEXT_SIZE, top);
    s.pop();

    top += MARGIN + s.yInput.height / 2;

    s.textAlign(s.RIGHT, s.CENTER);
    s.text(
      "1st Population Size",
      INTERFACE_X / 2 + MARGIN,
      top + s.firstPopInput.height / 2
    );
    top += MARGIN + s.firstPopInput.height;

    s.text(
      "Population Size",
      INTERFACE_X / 2 + MARGIN,
      top + s.popInput.height / 2
    );
    top += MARGIN + s.popInput.height;

    s.text(
      "Total Generation",
      INTERFACE_X / 2 + MARGIN,
      top + s.genInput.height / 2
    );
    top += MARGIN + s.genInput.height;

    s.text(
      "Crossover Probability",
      INTERFACE_X / 2 + MARGIN,
      top + s.crossInput.height / 2
    );
    top += MARGIN + s.crossInput.height;

    s.text(
      "Mutation Probability",
      INTERFACE_X / 2 + MARGIN,
      top + s.mutateInput.height / 2
    );
    top += MARGIN + s.mutateInput.height;

    s.text(
      "Max Iter",
      INTERFACE_X / 2 + MARGIN,
      top + s.maxIterInput.height / 2
    );
  };

  s.setPosition = () => {
    let top = MARGIN * 2;

    const MODE_BUTTON_TOTAL_WIDTH =
      s.cityBtn.width + s.salesBtn.width + s.deltBtn.width;
    const MODE_BUTTON_MARGIN =
      (s.width - MARGIN * 2 - MODE_BUTTON_TOTAL_WIDTH) / 2;

    s.cityBtn.position(EDGE_X + MARGIN, top);
    s.salesBtn.position(
      EDGE_X + MARGIN + MODE_BUTTON_MARGIN + s.cityBtn.width,
      top
    );
    s.deltBtn.position(
      EDGE_X +
        MARGIN +
        MODE_BUTTON_MARGIN * 2 +
        s.cityBtn.width +
        s.salesBtn.width,
      top
    );
    top += MARGIN + s.cityBtn.height;

    s.clrBtn.position(EDGE_X + (INTERFACE_X - s.clrBtn.width) / 2, top);
    top += MARGIN + s.clrBtn.height;

    s.xInput.position(EDGE_X + MARGIN + INTERFACE_TEXT_SIZE * 2, top);
    s.genPointBtn.position(
      EDGE_X + MARGIN * 2 + INTERFACE_TEXT_SIZE * 2 + s.xInput.width,
      top
    );
    top += MARGIN + s.xInput.height;

    s.yInput.position(EDGE_X + MARGIN + INTERFACE_TEXT_SIZE * 2, top);
    top += MARGIN + s.yInput.height;

    s.firstPopInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.firstPopInput.height;

    s.popInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.popInput.height;

    s.genInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.genInput.height;

    s.crossInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.crossInput.height;

    s.mutateInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.mutateInput.height;

    s.maxIterInput.position(EDGE_X + MARGIN * 2 + INTERFACE_X / 2, top);
    top += MARGIN + s.maxIterInput.height;

    s.algorithmBtn.position(
      EDGE_X + (INTERFACE_X - s.algorithmBtn.width) / 2,
      top
    );
  };

  s.getDist = (point1, point2) => {
    return s.dist(point1.x, point1.y, point2.x, point2.y);
  };

  s.matchCitiesToSalesman = () => {
    for (let i = 0; i < city.length; i++) {
      let closestSalesmanIndex = 0;
      let d = s.getDist(city[i].loc, salesman[0].virtualLoc);
      for (let j = 1; j < salesman.length; j++) {
        if (d > s.getDist(city[i].loc, salesman[j].virtualLoc)) {
          d = s.getDist(city[i].loc, salesman[j].virtualLoc);
          closestSalesmanIndex = j;
        }
      }
      salesman[closestSalesmanIndex].closeCitiesLocations.push(city[i].loc);
    }
  };

  s.moveSalesmanToMeanPoint = () => {
    let isClusteringEnd = true;
    for (let i = 0; i < salesman.length; i++) {
      let meanPos = s.createVector(0, 0);
      for (let j = 0; j < salesman[i].closeCitiesLocations.length; j++) {
        meanPos.add(salesman[i].closeCitiesLocations[j]);
      }
      if (salesman[i].closeCitiesLocations.length > 0)
        meanPos.div(salesman[i].closeCitiesLocations.length);
      if (
        salesman[i].virtualLoc.x != meanPos.x &&
        salesman[i].virtualLoc.y != meanPos.y
      )
        isClusteringEnd = false;
      salesman[i].virtualLoc = meanPos.copy();
    }
    return isClusteringEnd;
  };

  s.getFirstGeneration = (oneSalesman) => {
    let result = [];
    let visitOrder = [];
    for (let i = 0; i < oneSalesman.closeCitiesLocations.length; i++)
      visitOrder[i] = i;
    for (let i = 0; i < s.firstPopInput.value(); i++)
      result.push(s.shuffle(visitOrder));
    return result;
  };

  s.getDistsOfOrder = (oneSalesman, orders) => {
    let result = [];
    for (let order of orders) {
      let strt = order[0];
      let finsh = order[order.length - 1];
      let totalDist =
        s.getDist(oneSalesman.loc, oneSalesman.closeCitiesLocations[strt]) +
        s.getDist(oneSalesman.loc, oneSalesman.closeCitiesLocations[finsh]);
      for (let i = 0; i < order.length - 1; i++) {
        let indx1 = order[i];
        let indx2 = order[i + 1];
        totalDist += s.getDist(
          oneSalesman.closeCitiesLocations[indx1],
          oneSalesman.closeCitiesLocations[indx2]
        );
      }
      result.push(totalDist);
    }
    return result;
  };

  s.getShortestIndex = (dists) => {
    let shortest = dists[0];
    let index = 0;
    for (let i = 1; i < dists.length; i++) {
      if (dists[i] < shortest) {
        shortest = dists[i];
        index = i;
      }
    }
    return index;
  };

  s.getFitness = (dists) => {
    let semiResult = [];
    let result = [];
    let sum = 0;
    for (let i = 0; i < dists.length; i++) {
      semiResult.push((1 / dists[i]) ** 2);
      sum += (1 / dists[i]) ** 2;
    }
    for (let i = 0; i < semiResult.length; i++) {
      result.push(semiResult[i] / sum);
    }
    return result;
  };

  s.getOneParent = (fitness, orders) => {
    let r = s.random();
    for (let i = 0; i < fitness.length; i++) {
      r -= fitness[i];
      if (r <= 0) return orders[i];
    }
    return orders[orders.length - 1];
  };

  // 내가 생각한 버전
  // s.getChildByCrossover = (parentA, parentB) => {
  //   let changeTheseIndicesToA = [];
  //   let ImAIndex = [];
  //   let offspring = parentB.slice(0);
  //   for (let i = 0; i < parentB.length; i++) {
  //     if (s.random() < 0.5) changeTheseIndicesToA.push(i);
  //   }

  //   for (let i = 0; i < parentA.length; i++) {
  //     for (let j = 0; j < changeTheseIndicesToA.length; j++) {
  //       let indx = changeTheseIndicesToA[j];
  //       if (parentA[i] == parentB[indx]) ImAIndex.push(i);
  //     }
  //   }

  //   for (let i = 0; i < changeTheseIndicesToA.length; i++) {
  //     let indx1 = changeTheseIndicesToA[i];
  //     let indx2 = ImAIndex[i];
  //     offspring[indx1] = parentA[indx2];
  //   }

  //   return offspring;
  // };

  // The Coding Train
  // https://www.youtube.com/watch?v=hnxn6DtLYcY
  s.getChildByCrossover = (parentA, parentB) => {
    let start = Math.floor(s.random(parentA.length));
    let end = Math.floor(s.random(start + 1, parentA.length));
    let offspring = parentA.slice(start, end);

    for (let i = 0; i < parentB.length; i++) {
      let c = parentB[i];
      if (!offspring.includes(c)) {
        offspring.push(c);
      }
    }

    return offspring;
  };

  s.mutateOrder = (child) => {
    let clone = child.slice(0);
    let i1 = Math.floor(s.random(clone.length));
    let i2 = (i1 + 1) % child.length;
    let temp = clone[i1];
    clone[i1] = clone[i2];
    clone[i2] = temp;
    return clone;
  };
});
