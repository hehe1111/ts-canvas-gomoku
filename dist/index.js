"use strict";

var BOARD_AREA_SIZE = 540;
var COLUMNS = 18; // 设置网格大小

var GRID_SIZE = BOARD_AREA_SIZE / COLUMNS;
var OFFSET = GRID_SIZE / 2;
var goGoard = document.getElementById('canvas');
goGoard.width = BOARD_AREA_SIZE + OFFSET * 2;
goGoard.height = BOARD_AREA_SIZE + OFFSET * 2;
var ctx = goGoard.getContext('2d');
var me = true;
var occupied = [];

for (var i = 0; i < COLUMNS + 1; i++) {
  occupied[i] = [];

  for (var j = 0; j < COLUMNS + 1; j++) {
    occupied[i][j] = 0;
  }
}

drawGoBoard();
goGoard.addEventListener('click', onClickGoBoard);
/* === 工具函数 === */

function drawGoBoard() {
  // 绘制 x、y 轴线
  for (var _i = 0; _i < COLUMNS + 1; _i++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET, toLength(_i) - 0.5); // - 0.5 是为了解决像素模糊问题

    ctx.lineTo(BOARD_AREA_SIZE + OFFSET, toLength(_i) - 0.5);
    ctx.stroke();
    ctx.closePath();
  }

  for (var _j = 0; _j < COLUMNS + 1; _j++) {
    ctx.beginPath();
    ctx.moveTo(toLength(_j) - 0.5, OFFSET);
    ctx.lineTo(toLength(_j) - 0.5, BOARD_AREA_SIZE + OFFSET);
    ctx.stroke();
    ctx.closePath();
  } // 绘制星元、天元


  COLUMNS % 6 === 0 && [1 / 6, 1 / 2, 5 / 6].map(function (x) {
    ;
    [1 / 6, 1 / 2, 5 / 6].map(function (y) {
      ctx.beginPath();
      ctx.arc(x * BOARD_AREA_SIZE + OFFSET, y * BOARD_AREA_SIZE + OFFSET, GRID_SIZE / 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
  });
}

function toLength(x) {
  return GRID_SIZE * x + OFFSET;
}

function oneStep(x, y, me) {
  ctx.beginPath();
  ctx.arc(toLength(x), toLength(y), GRID_SIZE / 2, 0, 2 * Math.PI);
  var gradient = ctx.createRadialGradient( // 外圆
  toLength(x) + 2, // 让亮光偏到右上角
  toLength(y) - 2, GRID_SIZE / 2, // 内圆
  toLength(x) + 2, toLength(y) - 2, GRID_SIZE / 2 / 8);

  if (me) {
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#636766');
  } else {
    gradient.addColorStop(0, '#d1d1d1');
    gradient.addColorStop(1, '#f9f9f9');
  }

  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

function onClickGoBoard(event) {
  var x = Math.floor(event.offsetX / GRID_SIZE);
  var y = Math.floor(event.offsetY / GRID_SIZE);
  if (occupied[x][y]) return;
  oneStep(x, y, me);
  occupied[x][y] = me ? 1 : 2;
  me = !me;
}