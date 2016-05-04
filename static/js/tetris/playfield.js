var PlayField = function(height, width, tetrominos, colors, displayCallback) {
    this.tetrominos = tetrominos;
    this.colors = colors;
    this.height = height;
    this.width = width;
    this.displayCallback = displayCallback;

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
    new PlayField.prototype.Level('Level Max', null, 10, 100),
];

PlayField.prototype.redraw = function() {
    if (this.displayCallback) {
        this.displayCallback(this.getCurrentGame());
    }
};

PlayField.prototype.reset = function() {
    this.status = PlayField.prototype.Status.NEW;
    this.score = 0;
    this.colorIdx = 0;
    this.levelIdx = 0;
    this.lastEliminatedRows = [];

    // Init grid
    this.grid = [];
    for (var i = 0; i < this.height; i++) {
        var row = [];
        for (var j = 0; j < this.width; j++) {
            row.push(null);
        }
        this.grid.push(row);
    }

    this.nextTetromino = this.generateNextTetromino();

    this.redraw();
};

PlayField.prototype.generateNextTetromino = function() {
    var i = Math.floor(this.tetrominos.length * Math.random());

    var colorIdx = this.colorIdx;
    this.colorIdx = (colorIdx + 1) % this.colors.length;

    return {
        tetromino: this.tetrominos[i],
        color: this.colors[colorIdx],
    };
};

PlayField.prototype.getCurrentGame = function() {
    return {
        grid: this.getCurrentGrid(),
        status: this.status,
        score: this.score,
        nextTetromino: this.nextTetromino,
        level: PlayField.prototype.LEVELS[this.levelIdx],
        lastEliminatedRows: this.lastEliminatedRows,
    };
};

PlayField.prototype.startGame = function() {
    this.putNextTetromino();

    var next = () => {
        if (this.status != PlayField.prototype.Status.GAMEOVER) {
            this.fall();
            setTimeout(next, this.LEVELS[this.levelIdx].interval);
        }
        this.redraw();
    };

    next();
};

PlayField.prototype.putNextTetromino = function() {
    this.fallingTetromino = this.nextTetromino;
    this.fallingTetromino.x = this.grid.length;
    var tW = this.fallingTetromino.tetromino.grid[0].length;
    this.fallingTetromino.y = Math.floor((this.grid[0].length - tW) / 2);

    this.nextTetromino = this.generateNextTetromino();
};

PlayField.prototype.persistTetromino = function(grid) {
    if (!this.fallingTetromino) {
        return;
    }

    grid = grid || this.grid;

    var tetromino = this.fallingTetromino.tetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;
    var color = this.fallingTetromino.color;

    for (var i = 0; i < tetromino.grid.length; i++) {
        for (var j = 0; j < tetromino.grid[0].length; j++) {
            if (tetromino.grid[i][j]) {
                if (x + i >= 0 //
                    && x + i < this.grid.length //
                    && y + j >= 0 //
                    && y + j < this.grid[0].length) {
                    grid[x + i][y + j] = color;
                }
            }
        }
    }
};

PlayField.prototype.canMoveTo = function(x, y, tetromino) {
    if (!tetromino) {
        if (this.fallingTetromino && this.fallingTetromino.tetromino) {
            tetromino = this.fallingTetromino.tetromino;
        }
        else {
            return;
        }
    }

    for (var i = 0; i < tetromino.grid.length; i++) {
        for (var j = 0; j < tetromino.grid[i].length; j++) {
            if (tetromino.grid[i][j]) {
                if (x + i < 0 || y + j < 0 || y + j >= this.width) {
                    return false;
                }

                if (x + i < this.height && this.grid[x + i][y + j]) {
                    return false;
                }
            }
        }
    }

    return true;
};

PlayField.prototype.isGameOver = function() {
    if (!this.fallingTetromino) {
        return false;
    }

    var tetromino = this.fallingTetromino.tetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    for (var i = 0; i < tetromino.grid.length; i++) {
        for (var j = 0; j < tetromino.grid[0].length; j++) {
            if (tetromino.grid[i][j]) {
                // Check if any point is out of the board
                if (x + i < 0 || x + i >= this.grid.length || y + j < 0 || y + j >= this.grid[0].length) {
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

    for (var i = 0; i < this.grid.length; i++) {
        var full = true;
        for (var j = 0; j < this.grid[i].length; j++) {
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

    for (var i = newGrid.length; i < this.grid.length; i++) {
        var newLine = [];
        for (var j = 0; j < this.grid[0].length; j++) {
            newLine.push(null);
        }
        newGrid.push(newLine);
    }

    this.grid = newGrid;

    var level = this.LEVELS[this.levelIdx];
    this.score += eliminatedRows.length * level.scoreDelta;
    if (level.nextLevelScore && this.score >= level.nextLevelScore) {
        this.levelIdx++;
    }

    return eliminatedRows;
};

PlayField.prototype.getCurrentGrid = function() {
    if (!this.fallingTetromino) {
        return this.grid;
    }

    var currentGrid = [];

    // Copy existing grid
    for (var i = 0; i < this.grid.length; i++) {
        var row = [];
        for (var j = 0; j < this.grid[0].length; j++) {
            row.push(this.grid[i][j]);
        }
        currentGrid.push(row);
    }

    this.persistTetromino(currentGrid);

    return currentGrid;
};

PlayField.prototype.fall = function() {
    if (!this.fallingTetromino) {
        return;
    }

    this.lastEliminatedRows = [];

    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    if (this.canMoveTo(x - 1, y)) {
        this.fallingTetromino.x = x - 1;
        return;
    }

    if (this.isGameOver()) {
        this.status = PlayField.prototype.Status.GAMEOVER;
        return;
    }

    this.persistTetromino();
    this.putNextTetromino();

    this.lastEliminatedRows = this.eliminate();
    this.fall();
};

PlayField.prototype.moveLeft = function() {
    if (!this.fallingTetromino) {
        return;
    }

    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    if (this.canMoveTo(x, y - 1)) {
        this.fallingTetromino.y = y - 1;
        this.redraw();
    }
}

PlayField.prototype.moveRight = function() {
    if (!this.fallingTetromino) {
        return;
    }

    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    if (this.canMoveTo(x, y + 1)) {
        this.fallingTetromino.y = y + 1;
        this.redraw();
    }
}

PlayField.prototype.rotate = function() {
    if (!this.fallingTetromino) {
        return;
    }

    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;
    var tetromino = this.fallingTetromino.tetromino;
    var rotatedTetromino = tetromino.getCwRotate();

    if (this.canMoveTo(x, y, rotatedTetromino)) {
        this.fallingTetromino.tetromino = rotatedTetromino;
        this.redraw();
    }
}

PlayField.prototype.drop = function() {
    if (!this.fallingTetromino) {
        return;
    }

    var currentFallingTetromino = this.fallingTetromino;
    var x = this.fallingTetromino.x;
    var y = this.fallingTetromino.y;

    while (this.fallingTetromino == currentFallingTetromino) {
        this.fall();
    }

    this.redraw();
}