/*global Tetromino*/

var Tetromino = function(grid) {
    this.grid = grid;
};

Tetromino.prototype.height = function() {
    return this.squareMap.length;
};

Tetromino.prototype.width = function() {
    return this.squareMap[0].length;
};

Tetromino.prototype.cwRotate = function() {
    var h = this.grid.length;
    var w = this.grid[0].length;

    var rotatedGrid = [];
    for (var i = 0; i < w; i++) {
        var row = [];
        for (var j = h - 1; j >= 0; j--) {
            row.push(this.grid[j][i]);
        }
        rotatedGrid.push(row);
    }

    this.grid = rotatedGrid;
};

Tetromino.prototype.ccwRotate = function() {
    var h = this.grid.length;
    var w = this.grid[0].length;

    var rotatedGrid = [];
    for (var i = w - 1; i >= 0; i--) {
        var row = [];
        for (var j = h - 1; j >= 0; j--) {
            row.push(this.grid[j][i]);
        }
        rotatedGrid.push(row);
    }

    this.grid = rotatedGrid;
};

Tetromino.prototype.COLORS = ['black', 'darkgreen'];
Tetromino.prototype.TETROMINOS = [
    new Tetromino([
        [1],
        [1],
        [1],
        [1]
    ]),
    new Tetromino([
        [1, 1],
        [1, 1]
    ]),
    new Tetromino([
        [1, 0],
        [1, 0],
        [1, 1]
    ]),
    new Tetromino([
        [0, 1],
        [0, 1],
        [1, 1]
    ]),
    new Tetromino([
        [0, 1],
        [1, 1],
        [1, 0]
    ]),
    new Tetromino([
        [1, 0],
        [1, 1],
        [0, 1]
    ]),
    new Tetromino([
        [1, 1, 1],
        [0, 1, 0]
    ]),
];
