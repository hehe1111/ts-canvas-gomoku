"use strict";

drawGoBoard();
/* === 工具函数 === */

function drawGoBoard() {
  /*
   * 1. 设置网格的大小，GRID_SIZE 用于确定网格之中的线之间的间隔
   * 2. 获取 Canvas 的宽度 width、高度 height，用于计算 x 轴、y 轴需要绘画的条数
   * 3. 采用遍历的方式，绘画 x 轴的线条
   * 4. 采用遍历的方式，绘画 y 轴的线条
   */
  var BOARD_SIZE = 540;
  var COLUMNS = 18;
  var canvas = document.getElementById('canvas');
  canvas.width = BOARD_SIZE;
  canvas.height = BOARD_SIZE;
  var ctx = canvas.getContext('2d'); // 1. 设置网格大小

  var GRID_SIZE = BOARD_SIZE / COLUMNS; // 2. 获取Canvas的width、height

  var CANVAS_WIDTH = ctx.canvas.width;
  var CANCAS_HEIGHT = ctx.canvas.height; // 3、4. 绘制 x、y 轴线

  for (var i = 0; i < Math.floor(CANCAS_HEIGHT / GRID_SIZE); i++) {
    ctx.beginPath();
    ctx.moveTo(0, GRID_SIZE * i - 0.5); // - 0.5 是为了解决像素模糊问题

    ctx.lineTo(CANVAS_WIDTH, GRID_SIZE * i - 0.5);
    ctx.stroke();
    ctx.closePath();
  }

  for (var j = 0; j < Math.floor(CANVAS_WIDTH / GRID_SIZE); j++) {
    ctx.beginPath();
    ctx.moveTo(GRID_SIZE * j - 0.5, 0);
    ctx.lineTo(GRID_SIZE * j - 0.5, CANCAS_HEIGHT);
    ctx.stroke();
    ctx.closePath();
  } // 绘制星元、天元


  ;
  [[90, 90], [270, 90], [450, 90], [90, 270], [270, 270], [450, 270], [90, 450], [270, 450], [450, 450]].map(function (point) {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  });
}