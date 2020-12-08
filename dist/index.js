"use strict";

drawGoBoard();
/* === 工具函数 === */

function drawGoBoard() {
  /*
   * 1. 设置网格的大小，GRID_SIZE 用于确定网格之中的线之间的间隔
   * 2. 采用遍历的方式，绘画 x、y 轴的线条
   */
  var BOARD_SIZE = 540;
  var COLUMNS = 18;
  var canvas = document.getElementById('canvas');
  canvas.width = BOARD_SIZE;
  canvas.height = BOARD_SIZE;
  var ctx = canvas.getContext('2d'); // 1. 设置网格大小

  var GRID_SIZE = BOARD_SIZE / COLUMNS; // 2. 绘制 x、y 轴线

  for (var i = 0; i < COLUMNS + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(0, GRID_SIZE * i - 0.5); // - 0.5 是为了解决像素模糊问题

    ctx.lineTo(BOARD_SIZE, GRID_SIZE * i - 0.5);
    ctx.stroke();
    ctx.closePath();
  }

  for (var j = 0; j < COLUMNS + 1; j++) {
    ctx.beginPath();
    ctx.moveTo(GRID_SIZE * j - 0.5, 0);
    ctx.lineTo(GRID_SIZE * j - 0.5, BOARD_SIZE);
    ctx.stroke();
    ctx.closePath();
  } // 绘制星元、天元


  COLUMNS % 6 === 0 && [1 / 6, 1 / 2, 5 / 6].map(function (x) {
    ;
    [1 / 6, 1 / 2, 5 / 6].map(function (y) {
      ctx.beginPath();
      ctx.arc(x * BOARD_SIZE, y * BOARD_SIZE, GRID_SIZE / 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    });
  });
}