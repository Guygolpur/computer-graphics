import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

class Draw extends Component {
  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
      operation: ''
    }
    this.handleMoveOperation = this.handleMoveOperation.bind(this)
    this.handleRotateOperation = this.handleRotateOperation.bind(this)
  }
  componentDidMount () {
    this.drawBoat()
    document.addEventListener('mousemove', e => {
      this.setState({ left: e.pageX - 500, top: e.pageY - 300 }, () => {
        if (
          this.state.left > 0 &&
          this.state.left < 300 &&
          this.state.top > 0 &&
          this.state.top < 300 &&
          this.state.operation === 'move'
        ) {
          let cx = document.querySelector('canvas').getContext('2d')
          cx.clearRect(0, 0, '1000', '1000')
          this.drawBoatWithMove()
        }
        if (this.state.operation === 'rotate') {
          let cx = document.querySelector('canvas').getContext('2d')
          cx.clearRect(0, 0, '1000', '1000')
          this.drawBoatWithRotate()
        }
      })
    })
  }
  bezier (cp1x, cp1y, cp2x, cp2y, x, y) {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    cx.stroke()
  }
  drawDiagonal (x1, y1, x2, y2) {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.moveTo(x1, y1)
    cx.lineTo(x2, y2)
    cx.stroke()
  }
  drawCircle (x, y, r, start, end) {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.arc(x, y, r, start, end)
    cx.stroke()
  }

  drawBoatWithMove () {
    const { left, top } = this.state
    this.bezier(
      200 + left,
      10 + top,
      1000 + left,
      400 + top,
      200 + left,
      400 + top
    )
    this.drawDiagonal(200 + left, 10 + top, 200 + left, 450 + top)
    this.drawDiagonal(200 + left, 10 + top, 0 + left, 380 + top)
    this.drawDiagonal(0 + left, 380 + top, 200 + left, 380 + top)
    this.drawDiagonal(0 + left, 450 + top, 700 + left, 450 + top)
    this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top)
    this.drawDiagonal(50 + left, 450 + top, 100 + left, 530 + top)
    this.drawDiagonal(100 + left, 450 + top, 150 + left, 530 + top)
    this.drawDiagonal(150 + left, 450 + top, 200 + left, 530 + top)
    this.drawDiagonal(200 + left, 450 + top, 250 + left, 530 + top)
    this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top)
    this.drawDiagonal(50 + left, 530 + top, 600 + left, 530 + top)
    this.drawDiagonal(600 + left, 530 + top, 700 + left, 450 + top)

    this.drawCircle(600 + left, 490 + top, 20, 0, 7)
    this.drawCircle(550 + left, 490 + top, 20, 0, 7)
    this.drawCircle(500 + left, 490 + top, 20, 0, 7)
    this.drawCircle(450 + left, 490 + top, 20, 0, 7)
  }
  pointCalcRotateX (x, y) {
    const { top } = this.state
    let M_PI = 3.14159265358979323846264338327950288
    let c = Math.cos((top % 360) * (M_PI / 180))
    let s = Math.sin((top % 360) * (M_PI / 180))
    return x * c + y * s
  }

  pointCalcRotateY (x, y) {
    const { top } = this.state
    let M_PI = 3.14159265358979323846264338327950288
    let c = Math.cos((top % 360) * (M_PI / 180))
    let s = Math.sin((top % 360) * (M_PI / 180))
    return -x * s + y * c
  }
  drawBoatWithRotate () {
    const { left, top } = this.state
    let M_PI = 3.14159265358979323846264338327950288
    let c = Math.cos((top % 360) * (M_PI / 180))
    let s = Math.sin((top % 360) * (M_PI / 180))
    // this.bezier(
    //   200 * c + 10 * s,
    //   -200 * s + 10 * c,
    //   1000 * c + 400 * s,
    //   -1000 * s + 400 * c,
    //   200 * c +400 * s,
    //   -200 * s + 400 * c
    // )
    this.bezier(
      this.pointCalcRotateX(200, 10) ,
      this.pointCalcRotateY(200, 10),
      this.pointCalcRotateX(1000, 400) ,
      this.pointCalcRotateY(1000, 400) ,
      this.pointCalcRotateX(200, 400) ,
      this.pointCalcRotateY(200, 400) 
    )

    this.drawDiagonal(this.pointCalcRotateX(200, 10), this.pointCalcRotateY(200, 10), this.pointCalcRotateX(200,450), this.pointCalcRotateY(200,450))
    // this.drawDiagonal(200 + left, 10 + top, 0 + left, 380 + top)
    // this.drawDiagonal(0 + left, 380 + top, 200 + left, 380 + top)
    // this.drawDiagonal(0 + left, 450 + top, 700 + left, 450 + top)
    // this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top)
    // this.drawDiagonal(50 + left, 450 + top, 100 + left, 530 + top)
    // this.drawDiagonal(100 + left, 450 + top, 150 + left, 530 + top)
    // this.drawDiagonal(150 + left, 450 + top, 200 + left, 530 + top)
    // this.drawDiagonal(200 + left, 450 + top, 250 + left, 530 + top)
    // this.drawDiagonal(0 + left, 450 + top, 50 + left, 530 + top)
    // this.drawDiagonal(50 + left, 530 + top, 600 + left, 530 + top)
    // this.drawDiagonal(600 + left, 530 + top, 700 + left, 450 + top)

    // this.drawCircle(600 + left, 490 + top, 20, 0, 7)
    // this.drawCircle(550 + left, 490 + top, 20, 0, 7)
    // this.drawCircle(500 + left, 490 + top, 20, 0, 7)
    // this.drawCircle(450 + left, 490 + top, 20, 0, 7)
  }
  drawBoat () {
    this.bezier(200, 10, 1000, 400, 200, 400)
    this.drawDiagonal(200, 10, 200, 450)
    this.drawDiagonal(200, 10, 0, 380)
    this.drawDiagonal(0, 380, 200, 380)
    this.drawDiagonal(0, 450, 700, 450)
    this.drawDiagonal(0, 450, 50, 530)
    this.drawDiagonal(50, 450, 100, 530)
    this.drawDiagonal(100, 450, 150, 530)
    this.drawDiagonal(150, 450, 200, 530)
    this.drawDiagonal(200, 450, 250, 530)
    this.drawDiagonal(0, 450, 50, 530)
    this.drawDiagonal(50, 530, 600, 530)
    this.drawDiagonal(600, 530, 700, 450)

    this.drawCircle(600, 490, 20, 0, 7)
    this.drawCircle(550, 490, 20, 0, 7)
    this.drawCircle(500, 490, 20, 0, 7)
    this.drawCircle(450, 490, 20, 0, 7)
  }
  handleMoveOperation () {
    this.setState({ operation: 'move' })
  }
  handleRotateOperation () {
    this.setState({ operation: 'rotate' })
  }
  render () {
    return (
      <div>
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleMoveOperation}
          >
            Move
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleRotateOperation}
          >
            Rotate
          </Button>
        </div>
        <div
          style={{
            width: 1000,
            height: 800,
            margin: '0px auto',
            borderStyle: 'solid',
            borderColor: 'black'
          }}
        >
          <canvas width='1000' height='800'></canvas>
        </div>
      </div>
    )
  }
}
export default Draw
