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
    var grid = currentGame.grid;
    var gridHeight = grid.length * Square.prototype.width;
    var gridWidth = grid[0].length * Square.prototype.width;

    // Draw Grid
    var gridX = Math.floor((ctx.canvas.width - gridWidth) / 2);
    var gridY = 10;
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var x = j * Square.prototype.width + gridX;
            var y = i * Square.prototype.width + gridY;
            if (grid[i][j]) {
                new Square(new Point(x, y), grid[i][j]).draw(ctx);
            }
            else {
                new EmptySquare(new Point(x, y), 'darkgreen').draw(ctx);
            }
        }
    }

    // Draw Info (level and score)
    var infoWidth = Square.prototype.width * 4;
    var infoHeight = Square.prototype.width * 4;
    var infoX = gridX - infoWidth - Square.prototype.width;
    var infoY = gridY + gridHeight - infoHeight - Square.prototype.width;
    ctx.setLineDash([1, 2]);
    ctx.strokeStyle = 'darkgreen';
    ctx.rect(infoX, infoY, infoWidth, infoHeight);
    ctx.stroke();

    ctx.font = "30px Arial";
    ctx.fillText("Level", infoX + Square.prototype.width, infoY + Square.prototype.width * 4);
}

(() => {
    $(document).ready(() => {
        console.log('tetris');

        var container = $('#tetris-canvas-container');
        var canvas = $('#tetris-canvas')[0];

        canvas.width = container.width();
        canvas.height = container.height();

        var ctx = canvas.getContext("2d");

        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);

        var playField = new PlayField(20, 10, Tetromino.prototype.TETROMINOS, Tetromino.prototype.COLORS);
        var currentGame = playField.getCurrentGame();
        drawCurrentGame(currentGame, ctx);

        console.log(JSON.stringify(currentGame, null, 2));
    });
})();