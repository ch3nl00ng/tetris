/*global $*/
/*global Hammer*/

function TetrisControl(canvas) {
    this.canvas = canvas;

    if (Hammer) {
        this.mc = new Hammer.Manager(this.canvas, {
            recognizers: [
                [Hammer.Tap],
                [Hammer.Swipe, {
                    direction: Hammer.DIRECTION_ALL,
                }],
            ]
        });
    }
}

TetrisControl.prototype.refreshNextControl = function(nextControl, id) {
    this.mc.off('tap');
    this.mc.on('tap', nextControl);

};

TetrisControl.prototype.disableInputControl = function(inputControl, nextControl) {
    if (!this.mc) {
        return;
    }

    this.mc.off('swipeleft swiperight swipeup swipedown');

};

TetrisControl.prototype.enableInputControl = function(inputControl, nextControl) {
    if (!this.mc) {
        return;
    }

    this.mc.on('swipeleft', function(e) {
        inputControl.moveLeft();
        e.preventDefault();
    });
    this.mc.on('swiperight', function(e) {
        inputControl.moveRight();
        e.preventDefault();
    });
    this.mc.on('swipeup', function(e) {
        inputControl.rotate();
        e.preventDefault();
    });
    this.mc.on('swipedown', function(e) {
        inputControl.drop();
        e.preventDefault();
    });
};