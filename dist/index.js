"use strict";

var BOARD_AREA_SIZE = 540;
var LINES = 19; // 设置网格大小

var GRID_SIZE = BOARD_AREA_SIZE / (LINES - 1);
var OFFSET = GRID_SIZE / 2;
var goGoard = document.getElementById('canvas');
goGoard.width = BOARD_AREA_SIZE + OFFSET * 2;
goGoard.height = BOARD_AREA_SIZE + OFFSET * 2;
var ctx = goGoard.getContext('2d');
var user = true;
var occupied = [];

for (var i = 0; i < LINES; i++) {
  occupied[i] = [];

  for (var j = 0; j < LINES; j++) {
    occupied[i][j] = 0;
  }
}

var _calculateWins = calculateWins(),
    waysToWin = _calculateWins.waysToWin,
    wins = _calculateWins.wins; // 用户在各种获胜方法中已经下了多少手


var userWins = Array(waysToWin).fill(0); // 电脑在各种获胜方法中已经下了多少手

var computerWins = Array(waysToWin).fill(0); // 游戏是否结束

var over = false;
drawGoBoard();
goGoard.addEventListener('click', onUserClick);
/* === 工具函数 === */

function drawGoBoard() {
  // 绘制 x、y 轴线
  for (var _i = 0; _i < LINES; _i++) {
    ctx.beginPath();
    ctx.moveTo(OFFSET, toLength(_i) - 0.5); // - 0.5 是为了解决像素模糊问题

    ctx.lineTo(BOARD_AREA_SIZE + OFFSET, toLength(_i) - 0.5);
    ctx.stroke();
    ctx.closePath();
  }

  for (var _j = 0; _j < LINES; _j++) {
    ctx.beginPath();
    ctx.moveTo(toLength(_j) - 0.5, OFFSET);
    ctx.lineTo(toLength(_j) - 0.5, BOARD_AREA_SIZE + OFFSET);
    ctx.stroke();
    ctx.closePath();
  } // 绘制星元、天元


  ;
  (LINES - 1) % 6 === 0 && [1 / 6, 1 / 2, 5 / 6].map(function (x) {
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

function oneStep(x, y, user) {
  ctx.beginPath();
  ctx.arc(toLength(x), toLength(y), GRID_SIZE / 2, 0, 2 * Math.PI);
  var gradient = ctx.createRadialGradient( // 外圆
  toLength(x) + 2, // 让亮光偏到右上角
  toLength(y) - 2, GRID_SIZE / 2, // 内圆
  toLength(x) + 2, toLength(y) - 2, GRID_SIZE / 2 / 8);

  if (user) {
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

function calculateWins() {
  // 获胜方法总数
  var waysToWin = 0; // 获胜方法数组

  var wins = [];

  for (var _i2 = 0; _i2 < LINES; _i2++) {
    wins[_i2] = [];

    for (var _j2 = 0; _j2 < LINES; _j2++) {
      wins[_i2][_j2] = [];
    }
  } // 横线获胜方法


  for (var _i3 = 0; _i3 < LINES; _i3++) {
    for (var _j3 = 0; _j3 < LINES - 4; _j3++) {
      for (var k = 0; k < 5; k++) {
        wins[_i3][_j3 + k][waysToWin] = true;
      }

      waysToWin += 1;
    }
  } // 竖线获胜方法


  for (var _i4 = 0; _i4 < LINES - 4; _i4++) {
    for (var _j4 = 0; _j4 < LINES; _j4++) {
      for (var _k = 0; _k < 5; _k++) {
        wins[_i4 + _k][_j4][waysToWin] = true;
      }

      waysToWin += 1;
    }
  } // 左上到右下获胜方法


  for (var _i5 = 0; _i5 < LINES - 4; _i5++) {
    for (var _j5 = 0; _j5 < LINES - 4; _j5++) {
      for (var _k2 = 0; _k2 < 5; _k2++) {
        wins[_j5 + _k2][_i5 + _k2][waysToWin] = true;
      }

      waysToWin += 1;
    }
  } // 右上到左下获胜方法


  for (var _i6 = 0; _i6 < LINES - 4; _i6++) {
    for (var _j6 = LINES - 1; _j6 > 3; _j6--) {
      for (var _k3 = 0; _k3 < 5; _k3++) {
        wins[_i6 + _k3][_j6 - _k3][waysToWin] = true;
      }

      waysToWin += 1;
    }
  }

  return {
    waysToWin: waysToWin,
    wins: wins
  };
}

function onUserClick(event) {
  if (over || !user) return;
  var x = Math.floor(event.offsetX / GRID_SIZE);
  var y = Math.floor(event.offsetY / GRID_SIZE);
  if (occupied[x][y]) return;
  oneStep(x, y, user);
  occupied[x][y] = 1;
  checkWin({
    x: x,
    y: y,
    isUser: true
  });
}

function computersRound() {
  var max = 0;
  var maxX = 0;
  var maxY = 0;
  var userScores = [];
  var computerScores = [];

  for (var _i7 = 0; _i7 < LINES; _i7++) {
    userScores[_i7] = [];
    computerScores[_i7] = [];

    for (var _j7 = 0; _j7 < LINES; _j7++) {
      userScores[_i7][_j7] = 0;
      computerScores[_i7][_j7] = 0;
    }
  } // 找出最有价值的点（棋子的最优落点）


  for (var _i8 = 0; _i8 < LINES; _i8++) {
    for (var _j8 = 0; _j8 < LINES; _j8++) {
      if (occupied[_i8][_j8]) continue; // 如果该点可落子

      for (var k = 0; k < waysToWin; k++) {
        // 如果该点是某个胜法的其中一个点。如果一个点出现在多种胜法里，则分数会进行累加
        if (wins[_i8][_j8][k]) {
          // 根据用户在该种胜法中已经下了多少手，给予不同权重，便于拦截用户
          switch (userWins[k]) {
            case 1:
              userScores[_i8][_j8] += 10;
              break;

            case 2:
              userScores[_i8][_j8] += 100;
              break;

            case 3:
              userScores[_i8][_j8] += 1000;
              break;

            case 4:
              userScores[_i8][_j8] += 10000;
              break;
          } // 根据电脑在该种胜法中已经下了多少手，给予不同权重，便于电脑取胜


          switch (computerWins[k]) {
            case 1:
              computerScores[_i8][_j8] += 20;
              break;

            case 2:
              computerScores[_i8][_j8] += 200;
              break;

            case 3:
              computerScores[_i8][_j8] += 2000;
              break;

            case 4:
              computerScores[_i8][_j8] += 20000;
              break;
          }
        }
      } // 找出 userScores 和 computerScores 两者中最优的点


      if (userScores[_i8][_j8] > max) {
        max = userScores[_i8][_j8];
        maxX = _i8;
        maxY = _j8;
      } else if (userScores[_i8][_j8] === max) {
        if (computerScores[_i8][_j8] > computerScores[maxX][maxY]) {
          maxX = _i8;
          maxY = _j8;
        }
      }

      if (computerScores[_i8][_j8] > max) {
        max = computerScores[_i8][_j8];
        maxX = _i8;
        maxY = _j8;
      } else if (computerScores[_i8][_j8] === max) {
        if (userScores[_i8][_j8] > userScores[maxX][maxY]) {
          maxX = _i8;
          maxY = _j8;
        }
      }
    }
  }

  oneStep(maxX, maxY, false);
  occupied[maxX][maxY] = 2;
  checkWin({
    x: maxX,
    y: maxY,
    isUser: false
  });
}

function checkWin(_ref) {
  var x = _ref.x,
      y = _ref.y,
      isUser = _ref.isUser;
  var willWin = isUser ? userWins : computerWins;
  var willLose = isUser ? computerWins : userWins;

  for (var k = 0; k < waysToWin; k++) {
    if (wins[x][y][k]) {
      willWin[k] += 1;
      willLose[k] = 6; // 另一方永远不可能再以这种赢法获胜

      if (willWin[k] === 5) {
        setTimeout(function () {
          window.alert("".concat(isUser ? '你' : '计算机', "\u8D62\u4E86"));
          over = true;
        }, 0);
      }
    }
  }

  if (!over) {
    var _user = user;
    user = !user;
    _user && computersRound();
  }
}