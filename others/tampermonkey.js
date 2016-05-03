// ==UserScript==
// @name         Tetris
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https?:\/\/(www\.)?(.*)\?.*\&?(tetris=(\w+)).*/
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-2.2.3.js
// ==/UserScript==
/**
 */

var Point = function(x,y){
    this.x=x;
    this.y=y;
};

var Square = function(point, color) {
    var x = point.x;
    var y = point.y;
    this.color = color;

    // Init vertices
    this.vertices = [];
    this.vertices.push(new Point(x+ this.margin, y+this.margin));
    this.vertices.push(new Point(x + this.width-this.margin, y+this.margin));
    this.vertices.push(new Point(x + this.width-this.margin, y + this.width-this.margin));
    this.vertices.push(new Point(x + this.margin, y + this.width-this.margin));

};

Square.prototype.width = 25;
Square.prototype.margin = 1;
Square.prototype.draw = function(ctx) {
    ctx.beginPath();
    var numPoints = this.vertices.length;
    ctx.moveTo(this.vertices[numPoints-1].x,this.vertices[numPoints-1].y);
    for (var i=0;i<this.vertices.length;i++) {
        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle=this.color;
    ctx.fill();
};

var EmptySquare = function(point, color) {
    Square.call(this, point, color);
};

EmptySquare.prototype = Object.create(Square.prototype);
EmptySquare.prototype.draw = function(ctx) {
    ctx.setLineDash([1,2]);
    ctx.beginPath();
    var numPoints = this.vertices.length;
    ctx.moveTo(this.vertices[numPoints-1].x,this.vertices[numPoints-1].y);
    for (var i=0;i<this.vertices.length;i++) {
        ctx.lineTo(this.vertices[i].x,this.vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle=this.color;
    ctx.stroke();
};

(function() {
    'use strict';

    GM_addStyle('#tetris-canvas-container { width: 100%; padding: 10px 20px; }');
    GM_addStyle('#tetris-canvas { background-color: DarkSeaGreen; opacity: 0.5; z-index:99999;}');


    $(document).ready(function() {
        $('body').html('');
        $('<div id="tetris-canvas-container"><canvas id="tetris-canvas"></canvas></div>').prependTo($('body'));

        var canvas = document.getElementById('tetris-canvas');
        canvas.width  = 800;
        canvas.height = 600;

        var ctx = canvas.getContext("2d");


        //ctx.scale();
        // ctx.translate(width/2, height/2);
        ctx.translate(10, canvas.height - 10);
        ctx.scale(1, -1);

        //new EmptySquare(new Point(0,0), 'darkgreen').draw(ctx);
        //new Square(new Point(0,20), '#000000').draw(ctx);
        //new Square(new Point(-20,0), '#000000').draw(ctx);
        //new Square(new Point(20,0), '#000000').draw(ctx);
        //new Square(new Point(0,-20), '#000000').draw(ctx);

        var tetrominos = [
            new Tetromino([[1],[1],[1],[1]]), 
            new Tetromino([[1,1],[1,1]]), 
            new Tetromino([[1,0],[1,0],[1,1]]), 
            new Tetromino([[0,1],[0,1],[1,1]]), 
            new Tetromino([[0,1],[1,1],[1,0]]), 
            new Tetromino([[1,0],[1,1],[0,1]]), 
            new Tetromino([[1,1,1],[0,1,0]]), 
        ];

        var colors = ['black', 'darkgreen'];

        var playField = new PlayField(20, 10, tetrominos, colors);

        for (var i=0;i<playField.height();i++) {
            for (var j=0;j<playField.width();j++) {
                new EmptySquare(new Point(j*Square.prototype.width,i*Square.prototype.width), 'darkgreen').draw(ctx);
            }
        }
    });

    // Your code here...
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

    function PlayField(height, width, tetrominos, colors) {
        this.tetrominos = tetrominos;
        this.colors = colors;

        // Init grid
        this.grid = [];
        for (var i = 0; i < height; i++) {
            var row = [];
            for (var j = 0; j < width; j++) {
                row.push(null);
            }
            this.grid.push(row);
        }

        this.generateNextTetromino();
    }

    PlayField.prototype.colorIdx = 0;

    PlayField.prototype.grid = [
        []
    ];

    PlayField.prototype.height = function() {
        return this.grid.length;
    };

    PlayField.prototype.width = function() {
        return this.grid[0].length;
    };

    PlayField.prototype.putNextTetromino = function() {
        this.fallingTetromino = this.nextTetromino;

        this.fallingTetromino.x = this.grid.length;
        this.fallingTetromino.y = (this.grid[0].length - tetromino.width()) / 2;
    };

    PlayField.prototype.generateNextTetromino = function() {
        var i = Math.floor(this.tetrominos.length * Math.random());

        this.nextTetromino = {
            tetromino: this.tetrominos[i],
            color: this.colors[this.colorIdx++ % this.colors.length],
        };
    };

    PlayField.prototype.persistTetromino = function(grid) {
        if (!this.fallingTetromino) {
            return;
        }

        grid = grid || this.grid;

        var tetromino = fallingTetromino.tetromino;
        var x = fallingTetromino.x;
        var y = fallingTetromino.y;

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

    PlayField.prototype.moveCheck = function() {
        if (!this.fallingTetromino) {
            return false;
        }

        var tetromino = fallingTetromino.tetromino;
        var x = fallingTetromino.x;
        var y = fallingTetromino.y;

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

        var tetromino = fallingTetromino.tetromino;
        var x = fallingTetromino.x;
        var y = fallingTetromino.y;

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
            } else {
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

        var tetromino = fallingTetromino.tetromino;
        var x = fallingTetromino.x;
        var y = fallingTetromino.y;

        var currentGrid = [];

        // Copy existing grid
        for (var i = 0; i < this.height(); i++) {
            var row = [];
            for (var j = 0; j < this.width(); j++) {
                row.push(this.grid[i][j]);
            }
            currentGrid.push(row);
        }

        this.putTetromino(currentGrid);

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
        this.generateNextTetromino();

        return {
            grid: this.getCurrentGrid(),
            eliminatedRows: eliminatedRows,
        };


    };
})();
