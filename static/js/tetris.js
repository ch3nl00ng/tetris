/*global $*/
/*global PlayField*/
/*global Tetromino*/

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};

var Square = function(point, color) {
    var x = point.x;
    var y = point.y;
    this.color = color;

    // Init vertices
    this.vertices = [];
    this.vertices.push(new Point(x + this.margin, y + this.margin));
    this.vertices.push(new Point(x + this.width - this.margin, y + this.margin));
    this.vertices.push(new Point(x + this.width - this.margin, y + this.width - this.margin));
    this.vertices.push(new Point(x + this.margin, y + this.width - this.margin));

};

Square.prototype.width = 25;
Square.prototype.margin = 1;
Square.prototype.draw = function(ctx) {
    ctx.beginPath();
    var numPoints = this.vertices.length;
    ctx.moveTo(this.vertices[numPoints - 1].x, this.vertices[numPoints - 1].y);
    for (var i = 0; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
};

var EmptySquare = function(point, color) {
    Square.call(this, point, color);
};

EmptySquare.prototype = Object.create(Square.prototype);
EmptySquare.prototype.draw = function(ctx) {
    ctx.setLineDash([1, 2]);
    ctx.beginPath();
    var numPoints = this.vertices.length;
    ctx.moveTo(this.vertices[numPoints - 1].x, this.vertices[numPoints - 1].y);
    for (var i = 0; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.stroke();
};

function drawCurrentGame(currentGame, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var grid = currentGame.grid;
    var gridHeight = grid.length * Square.prototype.width;
    var gridWidth = grid[0].length * Square.prototype.width;

    // Draw Grid
    var gridX = Math.floor((ctx.canvas.width - gridWidth) / 2);
    var gridY = ctx.canvas.height - Square.prototype.width - gridHeight;
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var x = j * Square.prototype.width + gridX;
            var y = gridY + gridHeight - (i + 1) * Square.prototype.width;
            if (grid[i][j]) {
                new Square(new Point(x, y), grid[i][j]).draw(ctx);
            }
            else {
                new EmptySquare(new Point(x, y), 'darkgreen').draw(ctx);
            }
        }
    }

    // Draw Info (level and score)
    function drawInfo(x, y, width, height, text) {
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = 'darkgreen';
        ctx.rect(x, y, width, height);
        ctx.stroke();

        if (text != undefined) {
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x + Math.floor(width / 2), y + Math.floor(height / 2));
        }
    }

    // Level display
    drawInfo(
        gridX - Square.prototype.width * 5,
        gridY + Square.prototype.width,
        Square.prototype.width * 4,
        Square.prototype.width * 2,
        currentGame.level.display
    );

    // Score display
    drawInfo(
        gridX - Square.prototype.width * 5,
        gridY + Square.prototype.width * 4,
        Square.prototype.width * 4,
        Square.prototype.width * 2,
        currentGame.score
    );

    // Next display
    var nextX = gridX + gridWidth + Square.prototype.width;
    var nextY = gridY + Square.prototype.width;
    var nextW = Square.prototype.width * 4;
    var nextH = Square.prototype.width * 5;
    drawInfo(nextX, nextY, nextW, nextH);

    if (currentGame.nextTetromino) {
        var tGrid = currentGame.nextTetromino.tetromino.grid;
        var tColor = currentGame.nextTetromino.color;
        var tH = tGrid.length * Square.prototype.width;
        var tW = tGrid[0].length * Square.prototype.width;

        var tX = nextX + Math.floor((nextW - tW) / 2);
        var tY = nextY + Math.floor((nextH - tH) / 2);

        for (var i = 0; i < tGrid.length; i++) {
            for (var j = 0; j < tGrid[i].length; j++) {
                if (tGrid[i][j]) {
                    var x = j * Square.prototype.width + tX;
                    var y = tY + tH - (i + 1) * Square.prototype.width;
                    new Square(new Point(x, y), tColor).draw(ctx);
                }
            }
        }
    }

}

(() => {
    $(document).ready(() => {
        console.log('tetris');

        var container = $('#tetris-canvas-container');
        var canvas = $('#tetris-canvas')[0];

        canvas.width = container.width();
        canvas.height = container.height();

        var ctx = canvas.getContext("2d");

        // ctx.translate(0, canvas.height);
        // ctx.scale(1, -1);

        var playField = new PlayField(20, 10, Tetromino.prototype.TETROMINOS, Tetromino.prototype.COLORS, (currentGame) => {
            drawCurrentGame(currentGame, ctx);
            console.log(currentGame.level);
        });

        playField.startGame();

        window.onkeydown = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;

            switch (key) {
                case 37:
                    playField.moveLeft();
                    break;
                case 38:
                    playField.rotate();
                    break;
                case 39:
                    playField.moveRight();
                    break;
                case 40:
                    playField.drop();
                    break;
                default:
            }

            e.preventDefault();
        }
    });
})();