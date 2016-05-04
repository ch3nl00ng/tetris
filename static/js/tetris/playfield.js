var PlayField = function(height, width, tetrominos, colors) {
    this.tetrominos = tetrominos;
    this.colors = colors;
    this.height = height;
    this.width = width;

    this.reset();
}

/* Public static */
PlayField.prototype.Status = {
    NEW: 0,
    IN_PROGRESS: 1,
    GAMEOVER: 2,
};

PlayField.prototype.Level = function(display, nextLevelScore, scoreDelta, interval) {
    this.display = display;
    this.nextLevelScore = nextLevelScore;
    this.scoreDelta = scoreDelta;
    this.interval = interval;
};

PlayField.prototype.LEVELS = [
    new PlayField.prototype.Level('Level 1', 10, 1, 1000),
    new PlayField.prototype.Level('Level 2', 30, 2, 900),
    new PlayField.prototype.Level('Level 3', 60, 3, 800),
    new PlayField.prototype.Level('Level 4', 100, 4, 700),
    new PlayField.prototype.Level('Level 5', 150, 5, 600),
    new PlayField.prototype.Level('Level 6', 210, 6, 500),
    new PlayField.prototype.Level('Level 7', 280, 7, 400),
    new PlayField.prototype.Level('Level 8', 360, 8, 300),
    new PlayField.prototype.Level('Level 9', 450, 9, 200),
    new PlayField.prototype.Level('Level Max', 550, 10, 100),
];

PlayField.prototype.reset = function() {
    this.status = PlayField.prototype.Status.NEW;
    this.score = 0;
    this.colorIdx = 0;
    this.levelIdx = 0;

    // Init grid
    this.grid = [];
    for (var i = 0; i < this.height; i++) {
        var row = [];
        for (var j = 0; j < this.width; j++) {
            row.push(null);
        }
        this.grid.push(row);
    }

    this.nextTetromino = this.getNextTetromino();
};

PlayField.prototype.getNextTetromino = function() {
    var i = Math.floor(this.tetrominos.length * Math.random());

    return {
        tetromino: this.tetrominos[i],
        color: this.colors[this.colorIdx++ % this.colors.length],
    };
};

PlayField.prototype.getCurrentGame = function() {
    return {
        grid: this.getCurrentGrid(),
        status: this.status,
        score: this.score,
        nextTetromino: this.nextTetromino,
        level: PlayField.prototype.LEVELS[this.levelIdx],
    };
};

PlayField.prototype.putNextTetromino = function() {
    this.fallingTetromino = this.nextTetromino;

    this.fallingTetromino.x = this.grid.length;
    this.fallingTetromino.y = (this.grid[0].length - this.fallingTetromino.tetromino.width()) / 2;
};

PlayField.prototype.persistTetromino = function(grid) {
    if (!this.fallingTetromino) {
        return;
    }

    grid = grid || this.grid;

    var tetromino = this.fallingTetromino.tetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    for (var i = 0; i < tetromino.height(); i++) {
        for (var j = 0; j < tetromino.width(); j++) {
            if (tetromino.squareMap[i][j]) {
                if (x + i < this.height() && y + j < this.width() && !this.grid[x + i][y + j]) {
                    grid[x + i][y + j] = tetromino.grid[i][j];
                }
            }
        }
    }
};

PlayField.prototype.fallCheck = function() {
    if (!this.fallingTetromino) {
        return false;
    }

    var tetromino = this.fallingTetromino.tetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    for (var i = 0; i < tetromino.height(); i++) {
        for (var j = 0; j < tetromino.width(); j++) {
            if (tetromino.squareMap[i][j]) {
                if (x + i < this.height() && y + j < this.width() && this.grid[x + i][y + j]) {
                    return false;
                }
            }
        }
    }

    return true;
};

PlayField.prototype.gameOverCheck = function() {
    if (!this.fallingTetromino) {
        return;
    }

    var tetromino = this.fallingTetromino.tetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    for (var i = 0; i < tetromino.height(); i++) {
        for (var j = 0; j < tetromino.width(); j++) {
            if (tetromino.squareMap[i][j]) {
                if (x + i >= this.height() || y + j >= this.width()) {
                    return true;
                }
            }
        }
    }

    return false;
};

PlayField.prototype.addEliminateScore = function(eliminatedRows) {
    this.score += eliminatedRows.length * this.level;
};

/**
 * Eliminate rows and return list of eliminated row number
 */
PlayField.prototype.eliminate = function() {
    var newGrid = [];
    var eliminatedRows = [];

    for (var i = 0; i < this.height(); i++) {
        var full = true;
        for (var j = 0; j < this.width(); j++) {
            if (!this.grid[i][j]) {
                full = false;
                break;
            }
        }

        if (!full) {
            newGrid.push(this.grid[i]);
        }
        else {
            eliminatedRows.push(i);
        }
    }

    for (var i = newGrid.length; i < this.height(); i++) {
        var newLine = [];
        for (var j = 0; j < this.width(); j++) {
            newLine.push(null);
        }
        newGrid.push(newLine);
    }

    this.grid = newGrid;

    return eliminatedRows;
};

PlayField.prototype.getCurrentGrid = function() {
    if (!this.fallingTetromino) {
        return this.grid;
    }

    var currentGrid = [];

    // Copy existing grid
    for (var i = 0; i < this.height(); i++) {
        var row = [];
        for (var j = 0; j < this.width(); j++) {
            row.push(this.grid[i][j]);
        }
        currentGrid.push(row);
    }

    this.persistTetromino(currentGrid);

    return currentGrid;
};

PlayField.prototype.move = function() {


    if (this.moveCheck()) {
        var currentGrid = this.getCurrentGrid();

        this.fallingTetromino.x--;

        return {
            grid: currentGrid,
        };
    }

    if (this.gameOverCheck()) {
        return {
            grid: this.getCurrentGrid(),
            gameover: 1,
        };
    }

    var eliminatedRows = this.eliminate();
    if (eliminatedRows.length > 0) {
        return {
            grid: this.getCurrentGrid(),
            eliminatedRows: eliminatedRows,
        };
    }

    this.persistTetromino();
    this.putNextTetromino();
    this.nextTetromino = this.getNextTetromino();

    return {
        grid: this.getCurrentGrid(),
        eliminatedRows: eliminatedRows,
    };


};