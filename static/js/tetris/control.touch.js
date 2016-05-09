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
    this.mc.get('swipe').set({
        enable: false
    });
    this.mc.off('swipeleft swiperight swipeup swipedown');
};

TetrisControl.prototype.enableInputControl = function(inputControl, nextControl) {
    if (!this.mc) {
        return;
    }

    this.mc.get('swipe').set({
        enable: true
    });

    this.mc.on('swipeleft', inputControl.moveLeft);
    this.mc.on('swiperight', inputControl.moveRight);
    this.mc.on('swipeup', inputControl.rotate);
    this.mc.on('swipedown', inputControl.drop);
};