const BOARD_AREA_SIZE = 540
const LINES = 19
// 设置网格大小
const GRID_SIZE = BOARD_AREA_SIZE / (LINES - 1)
const OFFSET = GRID_SIZE / 2

const goGoard = document.getElementById('canvas')! as HTMLCanvasElement
goGoard.width = BOARD_AREA_SIZE + OFFSET * 2
goGoard.height = BOARD_AREA_SIZE + OFFSET * 2
const ctx = goGoard.getContext('2d')!

let me: boolean = true
const occupied: number[][] = []
for (let i = 0; i < LINES; i++) {
  occupied[i] = []
  for (let j = 0; j < LINES; j++) {
    occupied[i][j] = 0
  }
}

drawGoBoard()
goGoard.addEventListener('click', onClickGoBoard)

/* === 工具函数 === */

function drawGoBoard(): void {
  // 绘制 x、y 轴线
  for (let i = 0; i < LINES; i++) {
    ctx.beginPath()
    ctx.moveTo(OFFSET, toLength(i) - 0.5) // - 0.5 是为了解决像素模糊问题
    ctx.lineTo(BOARD_AREA_SIZE + OFFSET, toLength(i) - 0.5)
    ctx.stroke()
    ctx.closePath()
  }
  for (let j = 0; j < LINES; j++) {
    ctx.beginPath()
    ctx.moveTo(toLength(j) - 0.5, OFFSET)
    ctx.lineTo(toLength(j) - 0.5, BOARD_AREA_SIZE + OFFSET)
    ctx.stroke()
    ctx.closePath()
  }

  // 绘制星元、天元
  ;(LINES - 1) % 6 === 0 &&
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

function oneStep(x: number, y: number, me: boolean): void {
  ctx.beginPath()
  ctx.arc(toLength(x), toLength(y), GRID_SIZE / 2, 0, 2 * Math.PI)
  const gradient = ctx.createRadialGradient(
    // 外圆
    toLength(x) + 2, // 让亮光偏到右上角
    toLength(y) - 2,
    GRID_SIZE / 2,
    // 内圆
    toLength(x) + 2,
    toLength(y) - 2,
    GRID_SIZE / 2 / 8
  )
  if (me) {
    gradient.addColorStop(0, '#0a0a0a')
    gradient.addColorStop(1, '#636766')
  } else {
    gradient.addColorStop(0, '#d1d1d1')
    gradient.addColorStop(1, '#f9f9f9')
  }
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.closePath()
}

function onClickGoBoard(event: MouseEvent): void {
  const x = Math.floor(event.offsetX / GRID_SIZE)
  const y = Math.floor(event.offsetY / GRID_SIZE)
  if (occupied[x][y]) return
  oneStep(x, y, me)
  occupied[x][y] = me ? 1 : 2
  me = !me
}
