/*global Tetromino*/

var Tetromino = function(grid, color) {
    this.grid = grid;
    this.color = color;
};

Tetromino.prototype.getCwRotate = function() {
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

    return new Tetromino(rotatedGrid, this.color);
};

Tetromino.prototype.getCcwRotate = function() {
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

    return new Tetromino(rotatedGrid, this.color);
};

Tetromino.prototype.TETROMINOS = [
    new Tetromino([
        [1],
        [1],
        [1],
        [1]
    ], 'blue'),
    new Tetromino([
        [1, 1],
        [1, 1]
    ], 'grey'),
    new Tetromino([
        [1, 0],
        [1, 0],
        [1, 1]
    ], 'purple'),
    new Tetromino([
        [0, 1],
        [0, 1],
        [1, 1]
    ], 'yellow'),
    new Tetromino([
        [0, 1],
        [1, 1],
        [1, 0]
    ], 'red'),
    new Tetromino([
        [1, 0],
        [1, 1],
        [0, 1]
    ], 'orange'),
    new Tetromino([
        [1, 1, 1],
        [0, 1, 0]
    ], 'green'),
];
