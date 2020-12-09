const BOARD_AREA_SIZE = 540
const COLUMNS = 18
// 设置网格大小
const GRID_SIZE = BOARD_AREA_SIZE / COLUMNS
const OFFSET = GRID_SIZE / 2

const canvas = document.getElementById('canvas')! as HTMLCanvasElement
canvas.width = BOARD_AREA_SIZE + OFFSET * 2
canvas.height = BOARD_AREA_SIZE + OFFSET * 2
const ctx = canvas.getContext('2d')!

drawGoBoard()

/* === 工具函数 === */

function drawGoBoard(): void {
  // 绘制 x、y 轴线
  for (let i = 0; i < COLUMNS + 1; i++) {
    ctx.beginPath()
    ctx.moveTo(OFFSET, toLength(i) - 0.5) // - 0.5 是为了解决像素模糊问题
    ctx.lineTo(BOARD_AREA_SIZE + OFFSET, toLength(i) - 0.5)
    ctx.stroke()
    ctx.closePath()
  }
  for (let j = 0; j < COLUMNS + 1; j++) {
    ctx.beginPath()
    ctx.moveTo(toLength(j) - 0.5, OFFSET)
    ctx.lineTo(toLength(j) - 0.5, BOARD_AREA_SIZE + OFFSET)
    ctx.stroke()
    ctx.closePath()
  }

  // 绘制星元、天元
  COLUMNS % 6 === 0 &&
    [1 / 6, 1 / 2, 5 / 6].map(x => {
      ;[1 / 6, 1 / 2, 5 / 6].map(y => {
        ctx.beginPath()
        ctx.arc(
          x * BOARD_AREA_SIZE + OFFSET,
          y * BOARD_AREA_SIZE + OFFSET,
          GRID_SIZE / 8,
          0,
          2 * Math.PI
        )
        ctx.fill()
        ctx.closePath()
      })
    })
}

function toLength(x: number): number {
  return GRID_SIZE * x + OFFSET
}
