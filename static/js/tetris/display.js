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

var gridColor = 'white';

function drawCurrentGame(currentGame, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var grid = currentGame.grid;
    var gridHeight = grid.length * Square.prototype.width;
    var gridWidth = grid[0].length * Square.prototype.width;
    var eliminatedRows = currentGame.lastEliminatedRows;

    // Draw Grid
    var gridX = Math.floor((ctx.canvas.width - gridWidth - Square.prototype.width * 5) / 2);
    var gridY = Math.floor((ctx.canvas.height - gridHeight) / 2);
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var x = j * Square.prototype.width + gridX;
            var y = gridY + gridHeight - (i + 1) * Square.prototype.width;
            if (!grid[i][j]) {
                new EmptySquare(new Point(x, y), gridColor).draw(ctx);
            }
            // If not in eliminated rows
            else if (eliminatedRows.indexOf(i) < 0) {
                new Square(new Point(x, y), grid[i][j]).draw(ctx);
            }
            else {
                new EmptySquare(new Point(x, y), gridColor).draw(ctx);
            }
        }
    }

    // Draw Info (level and score)
    function drawInfo(x, y, width, height, text) {
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = gridColor;
        ctx.rect(x, y, width, height);
        ctx.stroke();

        if (text != undefined) {
            ctx.font = (Square.prototype.width - 4) + 'px Arial';
            ctx.fillStyle = gridColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x + Math.floor(width / 2), y + Math.floor(height / 2));
        }

        ctx.closePath();
    }

    // Next display
    var nextW = Square.prototype.width * 4;
    var nextH = Square.prototype.width * 5;
    var nextX = gridX + gridWidth + Square.prototype.width;
    var nextY = gridY;
    drawInfo(nextX, nextY, nextW, nextH);

    if (currentGame.nextTetromino) {
        var tGrid = currentGame.nextTetromino.tetromino.grid;
        var tColor = currentGame.nextTetromino.tetromino.color;
        var tH = tGrid.length * Square.prototype.width;
        var tW = tGrid[0].length * Square.prototype.width;

        var tX = nextX + Math.floor((nextW - tW) / 2);
        var tY = nextY + Math.floor((nextH - tH) / 2);

        for (var i = 0; i < tGrid.length; i++) {
            for (var j = 0; j < tGrid[i].length; j++) {
                if (tGrid[i][j]) {
                    var nX = j * Square.prototype.width + tX;
                    var nY = tY + tH - (i + 1) * Square.prototype.width;
                    new Square(new Point(nX, nY), tColor).draw(ctx);
                }
            }
        }
    }

    // Level display
    var levelY = nextY + nextH + Square.prototype.width;
    var levelH = Square.prototype.width * 2;
    drawInfo(
        gridX + gridWidth + Square.prototype.width,
        levelY,
        Square.prototype.width * 4,
        levelH,
        currentGame.level.display
    );

    // Score display
    var scoreY = levelY + levelH + Square.prototype.width;
    var scoreH = Square.prototype.width * 2;
    drawInfo(
        gridX + gridWidth + Square.prototype.width,
        scoreY,
        Square.prototype.width * 4,
        scoreH,
        currentGame.score
    );
}
