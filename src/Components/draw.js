import React, { Component } from 'react'

class Draw extends Component {
  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      top: 0
    }
  }
  componentDidMount () {
    document.addEventListener('mousemove', e => {
      this.setState({ left: e.pageX, top: e.pageY })
    })
    this.drawBoat()
    console.log(this.state.left)
  }
  bezier = (cp1x, cp1y, cp2x, cp2y, x, y) => {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    cx.stroke()
  }
  drawDiagonal = (x1, y1, x2, y2) => {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.moveTo(x1, y1)
    cx.lineTo(x2, y2)
    cx.stroke()
  }
  drawCircle = (x, y, r, start, end) => {
    let cx = document.querySelector('canvas').getContext('2d')
    cx.beginPath()
    cx.arc(x, y, r, start, end)
    cx.stroke()
  }
  drawBoat = () => {
    const { left, top } = this.state
    this.bezier(200+left, 10+top, 1000+left, 400+top, 200+left, 400+top)
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
  render () {
    console.log(this.state.left)

    return (
      <div>
        <h1 onClick={() => this.drawBoat()}>draw</h1>
        <canvas width='1000' height='1000'></canvas>
      </div>
    )
  }
}
export default Draw
