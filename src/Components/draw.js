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
    this.handleMoveOperation = this.handleMoveOperation.bind(this);

  }
  componentDidMount () {
    document.addEventListener('mousemove', e => {
      this.setState({ left: e.pageX - 300, top: e.pageY - 300 }, () => {
        if (
          this.state.left > 0 &&
          this.state.left < 300 &&
          this.state.top > 0 &&
          this.state.top < 800 &&
          this.state.operation === 'move'
        ) {
          let cx = document.querySelector('canvas').getContext('2d')
          cx.clearRect(0, 0, '1000', '1000')
          this.drawBoat()
        }
      })
    })
    this.drawBoat()
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
  drawBoat () {
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
  handleMoveOperation () {
    this.setState({ operation: 'move' })
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
        </div>
        <canvas width='1000' height='1000'></canvas>
      </div>
    )
  }
}
export default Draw
