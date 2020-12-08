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

## 创建 public/index.html、public/style.css

`public/index.html`

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

`public/style.css`

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
}

#canvas {
  border: 1px solid black;
}
```

## 参考链接

- [使用指南](https://www.babeljs.cn/docs/usage)
- [@babel/preset-typescript](https://www.babeljs.cn/docs/babel-preset-typescript)
- [Canvas 绘制网格](https://juejin.cn/post/6844904042062151688)
- [CanvasRenderingContext2D.arc()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc)
