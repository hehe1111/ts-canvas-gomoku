# 笔记

## 创建项目

```bash
mkdir ts-canvas-gomoku
cd ts-canvas-gomoku
yarn init -y
```

## 安装依赖

TypeScript + Babel

```bash
yarn add @babel/core @babel/cli @babel/preset-env -D
yarn add typescript -D
yarn add @babel/preset-typescript -D
```

创建 `.babelrc`

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

更新 `package.json`

```jsonc
{
  // ...
  "scripts": {
    "compile": "babel ./src/ --out-dir ./dist/ --extensions .ts",
    "compile:w": "babel --watch ./src/ --out-dir ./dist/ --extensions .ts"
  }
}
```

## 使用 Canvas

```html
<canvas id="canvas"></canvas>
```

```ts
const canvas = document.getElementById('canvas')! as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
```

### 画线

```ts
ctx.beginPath() // 开始
ctx.moveTo(<x1 坐标>, <y1 坐标>) // 起点
ctx.lineTo(<x2 坐标>, <y2 坐标>) // 终点
ctx.strokeStyle = "#f00" // 线的颜色。默认黑色
ctx.stroke() // 画线
ctx.closePath() // 结束
```

画横线：起终点的 y 坐标减去 0.5 可以解决像素模糊问题

画竖线：起终点的 x 坐标减去 0.5 可以解决像素模糊问题

### 画弧线/圆

画弧线

```ts
ctx.beginPath()
ctx.arc(<x 坐标>, <y 坐标>, <半径>, <起点弧度>, <终点弧度>)
ctx.strokeStyle = "#f00"
ctx.stroke()
ctx.closePath()
```

画弧线（填充）

```ts
ctx.beginPath()
ctx.arc(<x 坐标>, <y 坐标>, <半径>, <起点弧度>, <终点弧度>)
ctx.fillStyle = "#f00" // 填充颜色。默认黑色
ctx.fill() // 填充
ctx.closePath()
```

画圆（实心）

```ts
ctx.beginPath()
ctx.arc(<x 坐标>, <y 坐标>, <半径>, 0, 2 * Math.PI)
ctx.fillStyle = "#f00"
ctx.fill()
ctx.closePath()
```

画圆（空心）

```ts
ctx.beginPath()
ctx.arc(<x 坐标>, <y 坐标>, <半径>, 0, 2 * Math.PI)
ctx.strokeStyle = "#f00"
ctx.stroke()
ctx.closePath()
```

## 渐变

渐变实心圆：两种颜色的交界之间，会自动做渐变

```ts
ctx.beginPath()
ctx.arc(<x 坐标>, <y 坐标>, <半径>, 0, 2 * Math.PI)
const gradient = ctx.createRadialGradient(
  <x 坐标>, <y 坐标>,
  <半径（作为外圆的半径）>,
  <x 坐标>, <y 坐标>,
  <半径2（作为内圆的半径）>,
)
// 0 -> 1 从外圆到内圆
gradient.addColorStop(0, '<外圆填充颜色>')
gradient.addColorStop(1, '<内圆填充颜色>')
ctx.fillStyle = gradient
ctx.fill()
ctx.closePath()
```

## 画围棋棋盘

```html
<!DOCTYPE html>
<html lang="zh-Hangs">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <title>五子棋</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div class="container">
      <canvas id="canvas"></canvas>
    </div>

    <script src="../dist/index.js"></script>
  </body>
</html>
```

```css
*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.container {
  margin: 10px;
  padding: 10px;
  background-color: #dabb4f;
  display: inline-block;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.6);
}
```

```ts
const BOARD_AREA_SIZE = 540
const LINES = 19
// 设置网格大小
const GRID_SIZE = BOARD_AREA_SIZE / (LINES - 1)
const OFFSET = GRID_SIZE / 2

const goGoard = document.getElementById('canvas')! as HTMLCanvasElement
goGoard.width = BOARD_AREA_SIZE + OFFSET * 2
goGoard.height = BOARD_AREA_SIZE + OFFSET * 2
const ctx = goGoard.getContext('2d')!

drawGoBoard()

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
```

## 画棋子

```ts
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
```

## 用二维数组记录下过的地方

```ts
let user: boolean = true
const occupied: number[][] = []
for (let i = 0; i < LINES; i++) {
  occupied[i] = []
  for (let j = 0; j < LINES; j++) {
    occupied[i][j] = 0
  }
}

// ...

goGoard.addEventListener('click', onUserClick)

// ...

function onUserClick(event: MouseEvent): void {
  const x = Math.floor(event.offsetX / GRID_SIZE)
  const y = Math.floor(event.offsetY / GRID_SIZE)
  if (occupied[x][y]) return
  oneStep(x, y, user)
  occupied[x][y] = user ? 1 : 2
  user = !user
}
```

## 用三维数组记录全部可以获得胜利的方法

分四种：横线、竖线、左上到右下、右下到左上

- 以 `wins[i][j][k]` 为例：
  - `i` 代表横线
  - `j` 代表竖线
  - `k` 代表第几种赢法

```ts
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
```

## 参考链接

- [使用指南](https://www.babeljs.cn/docs/usage)
- [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)
- [Canvas 绘制网格](https://juejin.cn/post/6844904042062151688)
- [CanvasRenderingContext2D.arc()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc)
