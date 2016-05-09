/*global $*/

function TetrisControl(canvas) {
    this.canvas = canvas;
}

TetrisControl.prototype.refreshNextControl = function(nextControl, id) {
    $(window).unbind('keydown.tetris_control.' + id);
    $(window).bind('keydown.tetris_control.' + id, function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 32 && nextControl) {
            nextControl();
            e.preventDefault();
        }
    });
};

TetrisControl.prototype.disableInputControl = function(inputControl, id) {
    $(window).unbind('keydown.tetris_input.' + id);
};

TetrisControl.prototype.enableInputControl = function(inputControl, id) {
    $(window).bind('keydown.tetris_input.' + id, function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        switch (key) {
            case 37:
                inputControl.moveLeft();
                e.preventDefault();
                break;
            case 38:
                inputControl.rotate();
                e.preventDefault();
                break;
            case 39:
                inputControl.moveRight();
                e.preventDefault();
                break;
            case 40:
                inputControl.drop();
                e.preventDefault();
                break;
            default:
        }
    });
};