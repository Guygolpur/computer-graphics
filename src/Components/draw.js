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
      drawBoat: [],
      points: [],
      Ymin: 0,
      Ymax: 0,
      Xmax: 0,
      Xmin: 0,
      mouseX: 0,
      mouseY: 0,
      prevmouseX: 1,
      prevmouseY: 1,
      pointsProportion: { x: 0, y: 0 },
    };
    this.setOperationMoveState = this.setOperationMoveState.bind(this);
    this.setOperationRotateState = this.setOperationRotateState.bind(this);
    this.setOperationMirrorUpDownState = this.setOperationMirrorUpDownState.bind(
      this
    );
    this.setOperationMirrorLeftRightState = this.setOperationMirrorLeftRightState.bind(
      this
    );
    this.setOperationScallingState = this.setOperationScallingState.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  rotate(first, degree) {
    let metrix = [
      [Math.cos(degree), Math.sin(degree), 0],
      [-Math.sin(degree), Math.cos(degree), 0],
      [0, 0, 1],
    ];
    return this.multipleMatrix(first, metrix);
  }

  translateRotate(first, center, degree) {
    let afterTranslatePoint;
    if (first.z === 1) {
      afterTranslatePoint = this.translatePoint(first, -center.x, -center.y);
      afterTranslatePoint = this.rotate(afterTranslatePoint, degree);
      return this.translatePoint(afterTranslatePoint, center.x, center.y);
    }
    return first;
  }

  componentDidMount() {
    document.addEventListener("mousemove", (e) => {
      this.setState({ mouseX: e.offsetX, mouseY: e.offsetY }, () => {
        if (this.state.operation === "move") {
          let { points } = this.state;
          points.map((point, index) => {
            let x = this.state.mouseX - this.state.prevmouseX;
            let y = this.state.mouseY - this.state.prevmouseY;
            points[index] = this.translatePoint(point, x, y);
          });
          this.setState({ points: points });
        }
        if (this.state.operation === "rotate") {
          let xy = 1;
          let { prevmouseX, mouseX, prevmouseY, mouseY, points } = this.state;
          if (prevmouseX - mouseX < 0) {
            xy = Math.atan((prevmouseY - mouseY) / (prevmouseX - mouseX));
          } else if (prevmouseX - mouseX > 0) {
            xy =
              Math.PI +
              Math.atan((prevmouseY - mouseY) / (prevmouseX - mouseX));
          }
          console.log(xy);
          points.map((point, index) => {
            points[index] = this.translateRotate(
              point,
              this.state.pointsProportion,
              xy
            );
          });

          this.setState({ points: points });
        }
        if (this.state.operation === "scalling") {
          let { points } = this.state;
          console.log("scalling");
          let lastX = Math.abs(
            (this.state.prevmouseX - this.state.mouseX) /
              (this.state.Xmax - this.state.Xmin) -
              1
          );
          let lastY = Math.abs(
            1 +
              (this.state.prevmouseY - this.state.mouseY) /
                (this.state.Ymax - this.state.Ymin)
          );
          this.state.points.map((point, index) => {
            points[index] = this.scaling(
              point,
              this.state.pointsProportion,
              lastX,
              lastY
            );
          });
        }
        this.setState({
          prevmouseX: this.state.mouseX,
          prevmouseY: this.state.mouseY,
        });
        if (this.state.operation !== "clear") this.draw();
      });
    });
  }

  scale(first, sX, sY) {
    let metrix = [
      [sX, 0, 0],
      [0, sY, 0],
      [0, 0, 1],
    ];
    return this.multipleMatrix(first, metrix);
  }

  scaling(first, center, sX, sY) {
    if (first.z === 1) {
      let metrix = [
        [sX, 0, 0],
        [0, sY, 0],
        [center.x * (1 - sX), center.y * (1 - sY), 1],
      ];
      return this.multipleMatrix(first, metrix);
    } else {
      return { x: first.x * Math.min(sX, sY), y: first.y, z: first.z };
    }
  }

  MirrorLeftRight() {
    this.state.points.map((obj, index) => {
      this.state.points[index] = this.reflectionLeftRight(
        this.state.points[index],
        this.state.pointsProportion
      );
    });
    this.findPointsProprtion();
    this.draw();
  }

  MirrorUpDown() {
    let { points } = this.state;
    points.map((point, index) => {
      points[index] = this.reflectionUpDown(point, this.state.pointsProportion);
    });
    this.findPointsProprtion();
    this.draw();
  }

  reflectionLeftRight(first, center) {
    let afterTranslatePoint = this.translatePoint(first, -center.x, -center.y);
    let metrix = [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
    afterTranslatePoint = this.multipleMatrix(afterTranslatePoint, metrix);
    return this.translatePoint(afterTranslatePoint, center.x, center.y);
  }

  reflectionUpDown(first, center) {
    if (first.z === 1) {
      let afterTranslatePoint = this.translatePoint(
        first,
        -center.x,
        -center.y
      );
      let metrix = [
        [-1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      afterTranslatePoint = this.multipleMatrix(afterTranslatePoint, metrix);
      return this.translatePoint(afterTranslatePoint, center.x, center.y);
    }
    return first;
  }
  drawDiagonal(x1, y1, x2, y2) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.beginPath();
    cx.moveTo(x1, y1);
    cx.lineTo(x2, y2);
    cx.stroke();
  }

  drawSinglePixel(x, y) {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.fillStyle = "black";
    cx.fillRect(x, y, 1, 1);
  }

  circleAssist(cx, cy, x, y) {
    const { drawSinglePixel } = this;
    drawSinglePixel(cx + x, cy + y);
    drawSinglePixel(cx - x, cy + y);
    drawSinglePixel(cx + x, cy - y);
    drawSinglePixel(cx - x, cy - y);
    drawSinglePixel(cx + y, cy + x);
    drawSinglePixel(cx - y, cy + x);
    drawSinglePixel(cx + y, cy - x);
    drawSinglePixel(cx - y, cy - x);
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

  cleanScreen() {
    let cx = document.querySelector("canvas").getContext("2d");
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  drawCurve(p1, p2, p3, p4, n) {
    let ax = -1 * p1.x + 3 * p2.x - 3 * p3.x + p4.x;
    let bx = 3 * p1.x - 6 * p2.x + 3 * p3.x;
    let cx = -3 * p1.x + 3 * p2.x;
    let dx = p1.x;
    let ay = -1 * p1.y + 3 * p2.y - 3 * p3.y + p4.y;
    let by = 3 * p1.y - 6 * p2.y + 3 * p3.y;
    let cy = -3 * p1.y + 3 * p2.y;
    let dy = p1.y;

    let delta = 1 / n;
    let currX, currY;
    let prevX = p1.x;
    let prevY = p1.y;

    for (let t = 0; t <= 1; t += delta) {
      currX = ax * t * t * t + bx * t * t + cx * t + dx;
      currY = ay * t * t * t + by * t * t + cy * t + dy;
      this.drawDiagonal(currX, currY, prevX, prevY);
      prevX = currX;
      prevY = currY;
    }
  }
  drawLine(_x1, _y1, _x2, _y2) {
    let step = Math.abs(_y2 - _y1) > Math.abs(_x2 - _x1);
    let x1 = _x1;
    let y1 = _y1;
    let x2 = _x2;
    let y2 = _y2;

    if (step) {
      x1 = _y1;
      y1 = _x1;
      x2 = _y2;
      y2 = _x2;
    }

    if (x1 > x2) {
      let tx = x1;
      let ty = y1;
      x1 = x2;
      y1 = y2;
      x2 = tx;
      y2 = ty;
    }

    let dX = x2 - x1;
    let dY = Math.abs(y2 - y1);
    let err = 0.0;
    let dErr = dY / dX;
    let yStep = 1;

    if (y1 > y2) yStep = -1;

    let yp = y1;

    for (let xp = x1; xp <= x2; xp++) {
      if (step) this.drawSinglePixel(yp, xp);
      else this.drawSinglePixel(xp, yp);

      err = err + dErr;

      if (err >= 0.5) {
        yp = yp + yStep;
        err = err - 1;
      }
    }
  }

  draw() {
    this.cleanScreen();
    const { drawBoat, points } = this.state;

    drawBoat.map((data, index) => {
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
  }

  setOperationMoveState() {
    this.setState({ operation: "move" });
  }

  setOperationRotateState() {
    this.setState({ operation: "rotate" });
  }

  setOperationMirrorUpDownState() {
    this.setState({ operation: "mirror" });
    this.MirrorLeftRight();
  }

  setOperationMirrorLeftRightState() {
    this.setState({ operation: "mirror" });
    this.MirrorUpDown();
  }

  setOperationScallingState() {
    this.setState({ operation: "scalling" });
  }
  handleClear() {
    this.setState({ operation: "clear" });
    this.cleanScreen();
  }
  findPointsProprtion() {
    let { points } = this.state;
    if (points.length > 0) {
      let Ymax, Ymin, Xmax, Xmin;
      Ymax = Ymin = points[0].y;
      Xmax = Xmin = points[0].x;
      points.map((point, index) => {
        if (index > 0 && point.z === 1) {
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

  multipleMatrix(axisymmetric, metrix) {
    let result = { x: 0, y: 0, z: 0 };
    result.x =
      axisymmetric.x * metrix[0][0] +
      axisymmetric.y * metrix[1][0] +
      axisymmetric.z * metrix[2][0];
    result.y =
      axisymmetric.x * metrix[0][1] +
      axisymmetric.y * metrix[1][1] +
      axisymmetric.z * metrix[2][1];
    result.z =
      axisymmetric.x * metrix[0][2] +
      axisymmetric.y * metrix[1][2] +
      axisymmetric.z * metrix[2][2];
    return result;
  }

  translatePoint(first, tX, tY) {
    let metrix = [
      [1, 0, 0],
      [0, 1, 0],
      [tX, tY, 1],
    ];
    return this.multipleMatrix(first, metrix);
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
    let drawBoat = [];
    let points = [];
    lines.map((line) => {
      let pointsTmp = line.split(",");
      let point1, point2, point3, point4, radius;

      if (pointsTmp[0] === "1") {
        //Line
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        point2 = { x: parseInt(pointsTmp[3]), y: parseInt(pointsTmp[4]), z: 1 };
        drawBoat.push([1, points.push(point1) - 1, points.push(point2) - 1]);
      } else if (pointsTmp[0] === "2") {
        //Circle
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        radius = { x: parseInt(pointsTmp[3]), y: 0, z: 0 };
        drawBoat.push([2, points.push(point1) - 1, points.push(radius) - 1]);
      } else if (pointsTmp[0] === "3") {
        //Curve
        point1 = { x: parseInt(pointsTmp[1]), y: parseInt(pointsTmp[2]), z: 1 };
        point2 = { x: parseInt(pointsTmp[3]), y: parseInt(pointsTmp[4]), z: 1 };
        point3 = { x: parseInt(pointsTmp[5]), y: parseInt(pointsTmp[6]), z: 1 };
        point4 = { x: parseInt(pointsTmp[7]), y: parseInt(pointsTmp[8]), z: 1 };
        drawBoat.push([
          3,
          points.push(point1) - 1,
          points.push(point2) - 1,
          points.push(point3) - 1,
          points.push(point4) - 1,
          100,
        ]);
      }
    });

    this.setState({ drawBoat: drawBoat, points: points });
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
            onClick={this.setOperationMoveState}
          >
            Move
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.setOperationRotateState}
          >
            Rotate
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.setOperationMirrorLeftRightState}
          >
            Mirror left/right
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.setOperationMirrorUpDownState}
          >
            Mirror up/dows
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.setOperationScallingState}
          >
            Scalling
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleClear}
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
