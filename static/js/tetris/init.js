/*global $*/
/*global PlayField*/
/*global Tetromino*/
/*global TetrisControl*/
/*global Square*/
/*global drawCurrentGame*/

function initializeTetrisCard(card) {
    var canvas = $(card).find('canvas')[0];
    var container = $(canvas).parent();

    var ctx = canvas.getContext("2d");
    var tetrisControl = new TetrisControl(canvas);

    var instructionBtn = $(card).find('.tetris-instruction-btn');
    var controlBtn = $(card).find('.tetris-control-btn');
    var flipCard = $('.tetris-flip-card');
    instructionBtn.on('click', function() {
        flipCard.toggleClass('flipped');
        $(this).toggleClass('mdl-button--accent');

        if (flipCard.hasClass('flipped')) {
            controlBtn.prop('disabled', true);
        } else {
            controlBtn.prop('disabled', false);
        }
    });

    $(card).find('.tetris-flip-back').on('click', function() {
        flipCard.removeClass('flipped');
        controlBtn.prop('disabled', false);
    });

    var playField = new PlayField(20, 10, Tetromino.prototype.TETROMINOS, //
        function(currentGame) {
            drawCurrentGame(currentGame, ctx);
        }, //
        function(gameControl, status, playFieldId) {

            var nextControl = undefined;
            var nextCrtlText = undefined;

            switch (status) {
                case PlayField.prototype.Status.NEW:
                    nextCrtlText = 'Start';
                    nextControl = gameControl.startGame;
                    instructionBtn.prop('disabled', false);
                    break;
                case PlayField.prototype.Status.GAMEOVER:
                    nextCrtlText = 'Re:start';
                    nextControl = gameControl.restartGame;
                    instructionBtn.prop('disabled', false);
                    break;
                case PlayField.prototype.Status.PAUSED:
                    nextCrtlText = 'Resume';
                    nextControl = gameControl.resumeGame;
                    instructionBtn.prop('disabled', false);
                    break;
                default:
                    nextCrtlText = 'Pause';
                    nextControl = gameControl.pauseGame;
                    instructionBtn.prop('disabled', true);
                    break;
            }

            if (status == PlayField.prototype.Status.IN_PROGRESS) {
                tetrisControl.enableInputControl(gameControl.inputControl, playFieldId);
            }
            else {
                tetrisControl.disableInputControl(gameControl.inputControl, playFieldId);
            }

            tetrisControl.refreshNextControl(nextControl, playFieldId);

            if (nextControl) {
                controlBtn.html(nextCrtlText);
                controlBtn.unbind('click.tetris_control');
                controlBtn.bind('click.tetris_control', nextControl);
            }
        }
    );

    function resizeCanvas(playField) {
        var pfHeight = window.innerHeight - $(card).find('.mdl-card__title').outerHeight() - $(card).find('.mdl-card__actions').outerHeight();
        var pfWidth = container.width();
        var squareWidth = Math.floor(Math.min(pfWidth / (playField.grid[0].length + 7), pfHeight / (playField.grid.length + 2)));

        canvas.height = pfHeight;
        canvas.width = pfWidth;
        $(canvas).closest('.mdl-card__media').height(pfHeight);
        Square.prototype.width = squareWidth;

        drawCurrentGame(playField.getGameDisplay(), ctx);
    }
    $(window).on('resize', function() {
        resizeCanvas(playField);
    });
    resizeCanvas(playField);
}