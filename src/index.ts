const BOARD_AREA_SIZE = 540
const LINES = 19
// 设置网格大小
const GRID_SIZE = BOARD_AREA_SIZE / (LINES - 1)
const OFFSET = GRID_SIZE / 2

const goGoard = document.getElementById('canvas')! as HTMLCanvasElement
goGoard.width = BOARD_AREA_SIZE + OFFSET * 2
goGoard.height = BOARD_AREA_SIZE + OFFSET * 2
const ctx = goGoard.getContext('2d')!

let user: boolean = true
const occupied: number[][] = []
for (let i = 0; i < LINES; i++) {
  occupied[i] = []
  for (let j = 0; j < LINES; j++) {
    occupied[i][j] = 0
  }
}

const { waysToWin, wins } = calculateWins()
// 用户在各种获胜方法中已经下了多少手
const userWins: number[] = Array(waysToWin).fill(0)
// 电脑在各种获胜方法中已经下了多少手
const computerWins: number[] = Array(waysToWin).fill(0)
// 游戏是否结束
let over = false

drawGoBoard()
goGoard.addEventListener('click', onUserClick)

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

function oneStep(x: number, y: number, user: boolean): void {
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
  if (user) {
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

function calculateWins() {
  // 获胜方法总数
  let waysToWin = 0
  // 获胜方法数组
  const wins: boolean[][][] = []
  for (let i = 0; i < LINES; i++) {
    wins[i] = []
    for (let j = 0; j < LINES; j++) {
      wins[i][j] = []
    }
  }
  // 横线获胜方法
  for (let i = 0; i < LINES; i++) {
    for (let j = 0; j < LINES - 4; j++) {
      for (let k = 0; k < 5; k++) {
        wins[i][j + k][waysToWin] = true
      }
      waysToWin += 1
    }
  }
  // 竖线获胜方法
  for (let i = 0; i < LINES - 4; i++) {
    for (let j = 0; j < LINES; j++) {
      for (let k = 0; k < 5; k++) {
        wins[i + k][j][waysToWin] = true
      }
      waysToWin += 1
    }
  }
  // 左上到右下获胜方法
  for (let i = 0; i < LINES - 4; i++) {
    for (let j = 0; j < LINES - 4; j++) {
      for (let k = 0; k < 5; k++) {
        wins[j + k][i + k][waysToWin] = true
      }
      waysToWin += 1
    }
  }
  // 右上到左下获胜方法
  for (let i = 0; i < LINES - 4; i++) {
    for (let j = LINES - 1; j > 3; j--) {
      for (let k = 0; k < 5; k++) {
        wins[i + k][j - k][waysToWin] = true
      }
      waysToWin += 1
    }
  }

  return { waysToWin, wins }
}

function onUserClick(event: MouseEvent): void {
  if (over || !user) return

  const x = Math.floor(event.offsetX / GRID_SIZE)
  const y = Math.floor(event.offsetY / GRID_SIZE)
  if (occupied[x][y]) return
  oneStep(x, y, user)
  occupied[x][y] = 1
  checkWin({ x, y, isUser: true })
}

function computersRound(): void {
  let max = 0
  let maxX = 0
  let maxY = 0
  const userScores: number[][] = []
  const computerScores: number[][] = []
  for (let i = 0; i < LINES; i++) {
    userScores[i] = []
    computerScores[i] = []
    for (let j = 0; j < LINES; j++) {
      userScores[i][j] = 0
      computerScores[i][j] = 0
    }
  }

  // 找出最有价值的点（棋子的最优落点）
  for (let i = 0; i < LINES; i++) {
    for (let j = 0; j < LINES; j++) {
      if (occupied[i][j]) continue

      // 如果该点可落子
      for (let k = 0; k < waysToWin; k++) {
        // 如果该点是某个胜法的其中一个点。如果一个点出现在多种胜法里，则分数会进行累加
        if (wins[i][j][k]) {
          // 根据用户在该种胜法中已经下了多少手，给予不同权重，便于拦截用户
          switch (userWins[k]) {
            case 1:
              userScores[i][j] += 10
              break
            case 2:
              userScores[i][j] += 100
              break
            case 3:
              userScores[i][j] += 1000
              break
            case 4:
              userScores[i][j] += 10000
              break
          }

          // 根据电脑在该种胜法中已经下了多少手，给予不同权重，便于电脑取胜
          switch (computerWins[k]) {
            case 1:
              computerScores[i][j] += 20
              break
            case 2:
              computerScores[i][j] += 200
              break
            case 3:
              computerScores[i][j] += 2000
              break
            case 4:
              computerScores[i][j] += 20000
              break
          }
        }
      }

      // 找出 userScores 和 computerScores 两者中最优的点
      if (userScores[i][j] > max) {
        max = userScores[i][j]
        maxX = i
        maxY = j
      } else if (userScores[i][j] === max) {
        if (computerScores[i][j] > computerScores[maxX][maxY]) {
          maxX = i
          maxY = j
        }
      }
      if (computerScores[i][j] > max) {
        max = computerScores[i][j]
        maxX = i
        maxY = j
      } else if (computerScores[i][j] === max) {
        if (userScores[i][j] > userScores[maxX][maxY]) {
          maxX = i
          maxY = j
        }
      }
    }
  }

  oneStep(maxX, maxY, false)
  occupied[maxX][maxY] = 2
  checkWin({ x: maxX, y: maxY, isUser: false })
}

function checkWin({ x, y, isUser }: { x: number; y: number; isUser: boolean }) {
  const willWin = isUser ? userWins : computerWins
  const willLose = isUser ? computerWins : userWins
  for (let k = 0; k < waysToWin; k++) {
    if (wins[x][y][k]) {
      willWin[k] += 1
      willLose[k] = 6 // 另一方永远不可能再以这种赢法获胜
      if (willWin[k] === 5) {
        setTimeout(() => {
          window.alert(`${isUser ? '你' : '计算机'}赢了`)
          over = true
        }, 0)
      }
    }
  }

  if (!over) {
    const _user = user
    user = !user
    _user && computersRound()
  }
}
