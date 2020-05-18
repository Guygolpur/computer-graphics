import React, { Component } from "react";
import Button from "@material-ui/core/Button";
const canvasWidth = 1000;
const canvasHeight = 800;
class Draw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      operation: "",
      drawData: [],
      points: [],
      Ymin: 0,
      Ymax: 0,
      Xmax: 0,
      Xmin: 0,
      prevmouseX:0,
      prevmouseY:0
    };
    this.handleMoveOperation = this.handleMoveOperation.bind(this);
    this.handleRotateOperation = this.handleRotateOperation.bind(this);
    // this.pointCalcRotateX = this.pointCalcRotateX.bind(this);
    // this.pointCalcRotateY = this.pointCalcRotateY.bind(this);
  }
  componentDidMount() {
    // this.draw();
    document.addEventListener("mousemove", (e) => {
      this.setState({ mouseX: e.offsetX , mouseT: e.offsetY }, () => {
        console.log(this.state.left)
        console.log(this.state.top)
        if (
          // this.state.left > 0 &&
          // this.state.left < 300 &&
          // this.state.top > 0 &&
          // this.state.top < 300 &&
          this.state.operation === "move"
        ) {
          let {points} = this.state
          // this.cleanScreen()
          points.map((point, index) => {
            console.log(point)
            let x = this.state.mouseX - this.state.prevmouseX
            let y = this.state.mouseY - this.state.prevmouseY
            points[index] = this.translatePoint(point, x, y)
          })
          this.setState({points: points})
          // this.draw();

        }
        if (this.state.operation === "rotate") {
          let cx = document.querySelector("canvas").getContext("2d");
          cx.clearRect(0, 0, canvasWidth, canvasHeight);
          this.drawWithRotate();
        }
        this.setState({ prevmouseX: this.state.mouseX , prevmouseY: this.state.mouseY })
        this.draw()
      });
    });
  }
    
  drawDiagonal(x1, y1, x2, y2) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(x1, y1);
    cx.lineTo(x2, y2);
    cx.stroke();
  }
  drawPixel(x, y) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.fillStyle = "black";
    cx.fillRect(x, y, 1, 1);
  }
  circleAssist(cx, cy, x, y) {
    const { drawPixel } = this;
    drawPixel(cx + x, cy + y);
    drawPixel(cx - x, cy + y);
    drawPixel(cx + x, cy - y);
    drawPixel(cx - x, cy - y);
    drawPixel(cx + y, cy + x);
    drawPixel(cx - y, cy + x);
    drawPixel(cx + y, cy - x);
    drawPixel(cx - y, cy - x);
  }
  drawCircle(cx, cy, r) {
    let x = 0.0;
    let y = r;
    let p = 3 - 2 * r;

    while (x < y) {
      this.circleAssist(cx, cy, x, y);

      if (p < 0) p = p + 4 * x + 6;
      else {
        p = p + 4 * (x - y) + 10;
        y = y - 1;
      }

      x = x + 1;
    }

    if (x === y) this.circleAssist(cx, cy, x, y);
  }

  drawWithMove() {
    // const { left, top } = this.state;
    // this.bezier(
    //   200 + left,
    //   10 + top,
    //   1000 + left,
    //   400 + top,
    //   200 + left,
    //   400 + top
    // );
    // this.drawDiagonal(200 + left, 10 + top, 200 + left, 450 + top);
    // this.drawDiagonal(200 + left, 10 + top, 0 + left, 380 + top);
    // this.drawDiagonal(0 + left, 380 + top, 200 + left, 380 + top);
    // this.drawDiagonal(0 + left, 450 + top, 700 + left, 450 + top);
    // this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top);
    // this.drawDiagonal(50 + left, 450 + top, 100 + left, 530 + top);
    // this.drawDiagonal(100 + left, 450 + top, 150 + left, 530 + top);
    // this.drawDiagonal(150 + left, 450 + top, 200 + left, 530 + top);
    // this.drawDiagonal(200 + left, 450 + top, 250 + left, 530 + top);
    // this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top);
    // this.drawDiagonal(50 + left, 530 + top, 600 + left, 530 + top);
    // this.drawDiagonal(600 + left, 530 + top, 700 + left, 450 + top);

    // this.drawCircle(600 + left, 490 + top, 20, 0, 7);
    // this.drawCircle(550 + left, 490 + top, 20, 0, 7);
    // this.drawCircle(500 + left, 490 + top, 20, 0, 7);
    // this.drawCircle(450 + left, 490 + top, 20, 0, 7);
  }
  // pointCalcRotateX(x, y) {
  //   const { top } = this.state;
  //   let M_PI = 3.14159265358979323846264338327950288;
  //   let c = Math.cos(((top % 360) * M_PI) / 180);
  //   let s = Math.sin(((top % 360) * M_PI) / 180);
  //   return x * c - y * s + 200;
  // }

  // pointCalcRotateY(x, y) {
  //   const { top } = this.state;
  //   let M_PI = 3.14159265358979323846264338327950288;
  //   let c = Math.cos(((top % 360) * M_PI) / 180);
  //   let s = Math.sin(((top % 360) * M_PI) / 180);
  //   return x * s + y * c + 200;
  // }
  // drawWithRotate() {
  //   const { pointCalcRotateX, pointCalcRotateY } = this;
  //   this.bezier(
  //     pointCalcRotateX(200, 10),
  //     pointCalcRotateY(200, 10),
  //     pointCalcRotateX(1000, 400),
  //     pointCalcRotateY(1000, 400),
  //     pointCalcRotateX(200, 400),
  //     pointCalcRotateY(200, 400)
  //   );

  //   this.drawDiagonal(
  //     pointCalcRotateX(200, 10),
  //     pointCalcRotateY(200, 10),
  //     pointCalcRotateX(200, 450),
  //     pointCalcRotateY(200, 450)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(200, 10),
  //     pointCalcRotateY(200, 10),
  //     pointCalcRotateX(0, 380),
  //     pointCalcRotateY(0, 380)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(0, 380),
  //     pointCalcRotateY(0, 380),
  //     pointCalcRotateX(200, 380),
  //     pointCalcRotateY(200, 380)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(0, 450),
  //     pointCalcRotateY(0, 450),
  //     pointCalcRotateX(700, 450),
  //     pointCalcRotateY(700, 450)
  //   );

  //   this.drawDiagonal(
  //     pointCalcRotateX(0, 450),
  //     pointCalcRotateY(0, 450),
  //     pointCalcRotateX(50, 530),
  //     pointCalcRotateY(50, 530)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(50, 450),
  //     pointCalcRotateY(50, 450),
  //     pointCalcRotateX(100, 530),
  //     pointCalcRotateY(100, 530)
  //   );

  //   this.drawDiagonal(
  //     pointCalcRotateX(100, 450),
  //     pointCalcRotateY(100, 450),
  //     pointCalcRotateX(150, 530),
  //     pointCalcRotateY(150, 530)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(150, 450),
  //     pointCalcRotateY(150, 450),
  //     pointCalcRotateX(200, 530),
  //     pointCalcRotateY(200, 530)
  //   );

  //   this.drawDiagonal(
  //     pointCalcRotateX(200, 450),
  //     pointCalcRotateY(200, 450),
  //     pointCalcRotateX(250, 530),
  //     pointCalcRotateY(250, 530)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(0, 450),
  //     pointCalcRotateY(0, 450),
  //     pointCalcRotateX(50, 530),
  //     pointCalcRotateY(50, 530)
  //   );

  //   this.drawDiagonal(
  //     pointCalcRotateX(50, 530),
  //     pointCalcRotateY(50, 530),
  //     pointCalcRotateX(600, 530),
  //     pointCalcRotateY(600, 530)
  //   );
  //   this.drawDiagonal(
  //     pointCalcRotateX(600, 530),
  //     pointCalcRotateY(600, 530),
  //     pointCalcRotateX(700, 450),
  //     pointCalcRotateY(700, 450)
  //   );

  //   this.drawCircle(
  //     pointCalcRotateX(600, 490),
  //     pointCalcRotateY(600, 490),
  //     20,
  //     0,
  //     7
  //   );
  //   this.drawCircle(
  //     pointCalcRotateX(500, 490),
  //     pointCalcRotateY(500, 490),
  //     20,
  //     0,
  //     7
  //   );
  //   this.drawCircle(
  //     pointCalcRotateX(550, 490),
  //     pointCalcRotateY(550, 490),
  //     20,
  //     0,
  //     7
  //   );

  //   this.drawCircle(
  //     pointCalcRotateX(450, 490),
  //     pointCalcRotateY(450, 490),
  //     20,
  //     0,
  //     7
  //   );
  // }
  cleanScreen() {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
  drawCurve(p1, p2, p3, p4, n) {
    var ax = -1 * p1.x + 3 * p2.x - 3 * p3.x + p4.x;
    var bx = 3 * p1.x - 6 * p2.x + 3 * p3.x;
    var cx = -3 * p1.x + 3 * p2.x;
    var dx = p1.x;
    var ay = -1 * p1.y + 3 * p2.y - 3 * p3.y + p4.y;
    var by = 3 * p1.y - 6 * p2.y + 3 * p3.y;
    var cy = -3 * p1.y + 3 * p2.y;
    var dy = p1.y;

    var delta = 1 / n;
    var currX, currY;
    var prevX = p1.x;
    var prevY = p1.y;

    for (var t = 0; t <= 1; t += delta) {
      currX = ax * t * t * t + bx * t * t + cx * t + dx;
      currY = ay * t * t * t + by * t * t + cy * t + dy;
      this.drawDiagonal(currX, currY, prevX, prevY);
      prevX = currX;
      prevY = currY;
    }
  }
  drawLine(_x1, _y1, _x2, _y2) {
    var step = Math.abs(_y2 - _y1) > Math.abs(_x2 - _x1);
    var x1 = _x1;
    var y1 = _y1;
    var x2 = _x2;
    var y2 = _y2;

    if (step) {
      x1 = _y1;
      y1 = _x1;
      x2 = _y2;
      y2 = _x2;
    }

    if (x1 > x2) {
      var tx = x1;
      var ty = y1;
      x1 = x2;
      y1 = y2;
      x2 = tx;
      y2 = ty;
    }

    var dX = x2 - x1;
    var dY = Math.abs(y2 - y1);
    var err = 0.0;
    var dErr = dY / dX;
    var yStep = 1;

    if (y1 > y2) yStep = -1;

    var yp = y1;

    for (var xp = x1; xp <= x2; xp++) {
      if (step) this.drawPixel(yp, xp);
      else this.drawPixel(xp, yp);

      err = err + dErr;

      if (err >= 0.5) {
        yp = yp + yStep;
        err = err - 1;
      }
    }
  }
  draw() {
    this.cleanScreen();
    const { drawData, points } = this.state;

    drawData.map((data, index) => {
      if (data[0] === 1) {
        this.drawLine(
          points[data[1]].x,
          points[data[1]].y,
          points[data[2]].x,
          points[data[2]].y
        );
      } else if (data[0] === 2) {
        this.drawCircle(
          points[data[1]].x,
          points[data[1]].y,
          points[data[2]].x
        );
      } else if (data[0] === 3) {
        this.drawCurve(
          points[data[1]],
          points[data[2]],
          points[data[3]],
          points[data[4]],
          100
        );
      }
    });
    // this.bezier(200, 10, 1000, 400, 200, 400);
    // this.drawDiagonal(200, 10, 200, 450);
    // this.drawDiagonal(200, 10, 0, 380);
    // this.drawDiagonal(0, 380, 200, 380);
    // this.drawDiagonal(0, 450, 700, 450);
    // this.drawDiagonal(0, 450, 50, 530);
    // this.drawDiagonal(50, 450, 100, 530);
    // this.drawDiagonal(100, 450, 150, 530);
    // this.drawDiagonal(150, 450, 200, 530);
    // this.drawDiagonal(200, 450, 250, 530);
    // this.drawDiagonal(0, 450, 50, 530);
    // this.drawDiagonal(50, 530, 600, 530);
    // this.drawDiagonal(600, 530, 700, 450);

    // this.drawCircle(600, 490, 20, 0, 7);
    // this.drawCircle(550, 490, 20, 0, 7);
    // this.drawCircle(500, 490, 20, 0, 7);
    // this.drawCircle(450, 490, 20, 0, 7);
  }
  handleMoveOperation() {
    this.setState({ operation: "move" });
  }
  handleRotateOperation() {
    this.setState({ operation: "rotate" });
  }
  //adjust all the points
  findPointsProprtion() {
    let { points } = this.state;
    if (points.length > 0) {
      let Ymax, Ymin, Xmax, Xmin;
      Ymax = Ymin = points[0].y;
      Xmax = Xmin = points[0].x;
      points.map((point, index) => {
        if (index > 0 && point.z === 1) {
          //this is a point
          if (point.x < Xmin) Xmin = point.x;
          if (point.y < Ymin) Ymin = point.y;
          if (point.x > Xmax) Xmax = point.x;
          if (point.y > Ymax) Ymax = point.y;
        }
      });
      this.setState({
        Ymax: Ymax,
        Ymin: Ymin,
        Xmax: Xmax,
        Xmin: Xmin,
        pointsProportion: { x: (Xmax + Xmin) / 2, y: (Ymax + Ymin) / 2 },
      });
    }
  }
  matrixMult(axis, mtrx) {
    //####### need to change
    let rslt = { x: 0, y: 0, z: 0 };
    rslt.x = axis.x * mtrx[0][0] + axis.y * mtrx[1][0] + axis.z * mtrx[2][0];
    rslt.y = axis.x * mtrx[0][1] + axis.y * mtrx[1][1] + axis.z * mtrx[2][1];
    rslt.z = axis.x * mtrx[0][2] + axis.y * mtrx[1][2] + axis.z * mtrx[2][2];
    return rslt;
  }
  scaleCenter(p, c, sX, sY) {
    //################ change needed
    if (p.z === 1) {
      let mtrx = [
        [sX, 0, 0],
        [0, sY, 0],
        [c.x * (1 - sX), c.y * (1 - sY), 1],
      ];
      return this.matrixMult(p, mtrx);
    } else {
      let t = { x: p.x * Math.min(sX, sY), y: p.y, z: p.z };
      return t;
    }
  }
  translatePoint(p, tX, tY) {
    let mtrx = [
      [1, 0, 0],
      [0, 1, 0],
      [tX, tY, 1],
    ];
    return this.matrixMult(p, mtrx);
  }

  adjustObjectSize() {
    let { Xmax, Xmin, Ymax, Ymin, points } = this.state;
    let Xmv, Ymv, XYmv;
    Xmv = Ymv = 0;
    XYmv = 1;
    if (Xmax - Xmin > canvasWidth) XYmv = (canvasWidth / (Xmax - Xmin)) * 0.9;
    if (
      Ymax - Ymin > canvasHeight &&
      (canvasHeight / (Ymax - Ymin)) * 0.9 > XYmv
    ) {
      XYmv = (canvasHeight / (Ymax - Ymin)) * 0.9;
    }
    if (XYmv !== 1) {
      points.map((point, index) => {
        // points[index] = this.scaleCenter(point, cent, XYmv, XYmv);
      });
      this.findPointsProprtion();
      points.map((point, index) => {
        points[index] = this.translatePoint(point, -Xmin + 10, -Ymin + 10);
      });
      this.findPointsProprtion();
    }
    if (Xmin < 0) Xmv = -Xmin;
    else if (Xmax > canvasWidth) Xmv = -Xmax;

    if (Ymin < 0) Ymv = -Ymin;
    else if (Ymax > canvasHeight) Ymv = -Ymax;

    points.map((point, index) => {
      points[index] = this.translatePoint(points[index], Xmv, Ymv);
    });
    this.findPointsProprtion();
    this.setState({ points: points });
    this.draw();
  }
  parsePoints(text) {
    let lines = text.split(/\r\n|\n/g);
    let drawData = [];
    let points = [];
    lines.map((line) => {
      let pointsTmp = line.split(",");
      let point1, point2, point3, point4, radius;

      if (pointsTmp[0] === "1") {
        //Line
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        point2 = { x: parseInt(pointsTmp[3]), y: parseInt(pointsTmp[4]), z: 1 };
        drawData.push([1, points.push(point1) - 1, points.push(point2) - 1]);
      } else if (pointsTmp[0] === "2") {
        //Circle
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        radius = { x: parseInt(pointsTmp[3]), y: 0, z: 0 }; //check about rmoving t and z #############
        drawData.push([2, points.push(point1) - 1, points.push(radius) - 1]);
      } else if (pointsTmp[0] === "3") {
        //Curve
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        point2 = { x: parseInt(pointsTmp[3]), y: parseInt(pointsTmp[4]), z: 1 };
        point3 = { x: parseInt(pointsTmp[5]), y: parseInt(pointsTmp[6]), z: 1 };
        point4 = { x: parseInt(pointsTmp[7]), y: parseInt(pointsTmp[8]), z: 1 };
        drawData.push([
          3,
          points.push(point1) - 1,
          points.push(point2) - 1,
          points.push(point3) - 1,
          points.push(point4) - 1,
          100,
        ]);
      }
    });

    this.setState({ drawData: drawData, points: points });
    this.findPointsProprtion();
    this.adjustObjectSize();

    this.draw();
  }
  showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      this.parsePoints(text);
    };
    reader.readAsText(e.target.files[0]);
  };
  render() {
    return (
      <div>
        <input
          style={{ margin: 10 }}
          type="file"
          onChange={(e) => this.showFile(e)}
        />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleMoveOperation}
          >
            Move
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRotateOperation}
          >
            Rotate
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.cleanScreen}
          >
            clear
          </Button>
        </div>
        <div
          style={{
            width: 1000,
            height: 800,
            margin: "0px auto",
            borderStyle: "solid",
            borderColor: "black",
          }}
        >
          {/* <canvas width={`${this.canvasWidth}`} height={`${this.canvasHeight}`}></canvas> */}
          <canvas
            id="canvas"
            width={canvasWidth}
            height={canvasHeight}
          ></canvas>
        </div>
      </div>
    );
  }
}
export default Draw;
