$(document).ready(function() {
    $("#puzzle_img").load(function() {
        PuzzleGame.start();
    });
});

var PuzzleGame = {
    // Tile Width/Height
    width: 2,
    height: 2,
    clicks: 0,

    start: function() {
        var div = $("#puzzle_board");

        //Base image and the urls of the sliced images.
        var img = $("#puzzle_img")[0];

        $(div).append(this.createBoard(this.createImages(img)));

        $('.puzzle_td').click(function() {
            var slot = $(this)[0];
            PuzzleGame.handleMove(slot);
        });
    },

    handleMove: function(clickedSlot) {
        var clickedIndex = this.getIndex(clickedSlot);
        var board = this.getBoard();

        //Get the empty slot from the board.
        var emptySlot;
        for (var i=0; i < board.childNodes.length; ++i) {
            var row = board.childNodes[i];

            for (var j=0; j < row.childNodes.length; ++j) {
                var tmpSlot = row.childNodes[j];

                if (tmpSlot.childNodes.length <= 0) {
                    emptySlot = tmpSlot;
                    break;
                }
            }
        }

        var emptyIndex = this.getIndex(emptySlot);

        if (this.isValidMove(clickedIndex, emptyIndex)) {
            this.clicks++;
            $("#puzzle_clicks").html("Clicks: " + this.clicks);

            //Some basic horizontal slot movement. Probably a much better way to do it.
            var clickedRow = board.childNodes[clickedIndex.y];
            var slotsToMove;
            var rows;

            if (clickedIndex.y === emptyIndex.y) {
                if (clickedIndex.x > emptyIndex.x) {
                    slotsToMove = $(clickedRow.childNodes).slice(emptyIndex.x, clickedIndex.x);
                    for (var i = 0; i <= slotsToMove.length; ++i) {
                        var realIndex = emptyIndex.x + i;
                        var currentSlot = this.getSlot(realIndex, clickedIndex.y);
                        var destSlot = this.getSlot(realIndex - 1, clickedIndex.y);

                        $(destSlot).html(currentSlot.childNodes[0]);
                    }
                } else {
                    slotsToMove = $(clickedRow.childNodes).slice(clickedIndex.x, emptyIndex.x);
                    for (var i = slotsToMove.length - 1; i >= 0; --i) {
                        var realIndex = clickedIndex.x + i;
                        var currentSlot = this.getSlot(realIndex, clickedIndex.y);
                        var destSlot = this.getSlot(realIndex + 1, clickedIndex.y);

                        $(destSlot).html(currentSlot.childNodes[0]);
                    }
                }
            } else if (clickedIndex.x === emptyIndex.x) {
                //do vertical stuff
                if (clickedIndex.y < emptyIndex.y) {
                    rows = $(board.childNodes).slice(clickedIndex.y, emptyIndex.y);
                    for (var i = rows.length - 1; i >= 0; --i) {
                        var realIndex = clickedIndex.y + i;
                        var currentSlot = this.getSlot(clickedIndex.x, realIndex);
                        var destSlot = this.getSlot(clickedIndex.x, realIndex + 1);

                        $(destSlot).html(currentSlot.childNodes[0]);
                    }
                } else {
                    rows = $(board.childNodes).slice(emptyIndex.y, clickedIndex.y);
                    for (var i = 0; i <= rows.length; ++i) {
                        var realIndex = emptyIndex.y + i;
                        var currentSlot = this.getSlot(clickedIndex.x, realIndex);
                        var destSlot = this.getSlot(clickedIndex.x, realIndex - 1);

                        $(destSlot).html(currentSlot.childNodes[0]);
                    }
                }
            }
        }

        if (this.isComplete(board)) {
            this.solvePuzzle(board);
        }
    },

    //Gets the index of the object from the id. Must have a format of #|#.
    getIndex: function(object) {
        var id = object.id;
        return {
            x: parseInt(id.split("|")[1], 10),
            y: parseInt(/[0-9]+/.exec(id)[0], 10)
        };
    },

    getBoard: function() {
        return $("#puzzle_table")[0].childNodes[0];
    },

    getSlot: function(x, y) {
        var board = this.getBoard();

        if (y < 0 || x < 0) {
            return null;
        } else {
            var row = board.childNodes[y];
            return row.childNodes[x];
        }
    },

    onResetClick: function() {
        $("#puzzle_clicks").html("Clicks: 0");
        this.clicks = 0;

        $("#puzzle_congrats").hide();

        $("#puzzle_table").remove();
        this.start();
    },

    onSolveClick: function() {
        this.solvePuzzle(this.getBoard());
    },

    isValidMove: function(clickedSlot, emptySlot) {
        if (clickedSlot.x === emptySlot.x && clickedSlot.y === emptySlot.y)
            return false;
        else
            return (clickedSlot.x === emptySlot.x || clickedSlot.y === emptySlot.y);
    },

    //Checks if the puzzle has been completed.
    isComplete: function(board) {
        var complete = false;

        for (var i=0; i < board.childNodes.length; ++i) {
            var row = board.childNodes[i];

            for (var j=0; j < row.childNodes.length; ++j) {
                var slot = row.childNodes[j];

                if (slot.childNodes[0]) {
                    var slotIndex = this.getIndex(slot);
                    var imgIndex = this.getIndex(slot.childNodes[0]);
                    console.log("NEW____")
                    console.log("SLOT");
                    console.log(slotIndex);
                    console.log("IMG\n");
                    console.log(imgIndex);
                    console.log(slot.childNodes[0]);

                    if (slotIndex.x === imgIndex.x && slotIndex.y === imgIndex.y) {
                        complete = true;
                    } else {
                        complete = false;
                        break;
                    }
                }
            }
        }

        return complete;
    },

    onComplete: function(autoCompleted) {
        $("#puzzle_congrats").html("Congratulations, you solved the puzzle in "+PuzzleGame.clicks+" clicks!");
        $("#puzzle_congrats").show();
    },

    solvePuzzle: function(board) {
        for (var i=0; i < board.childNodes.length; ++i) {
            var row = board.childNodes[i];

            for (var j=0; j < row.childNodes.length; ++j) {
                var tmpSlot = row.childNodes[j];
                $(tmpSlot).html(this.images[i][j]);
            }
        }

        this.onComplete();
    },

    shuffle2DArray: function(array) {
        //Copy rows
        var arrayCopy = array.slice();

        //Copy columns
        for (var i = 0; i < array.length; ++i)
            arrayCopy[i] = array[i].slice();

        //Shuffle rows
        arrayCopy.sort(function() {
            return Math.random() - 0.5;
        });

        //Shuffle columns
        for (var i = 0; i < arrayCopy.length; ++i) {
            arrayCopy[i].sort(function() {
                return Math.random() - 0.5;
            });
        }

        return arrayCopy;
    },

    createBoard: function(images) {
        var w = this.width, h = this.height;
        var pieces = ['<table id="puzzle_table">'];
        var shuffledImages = this.shuffle2DArray(images);

        for (var i = 0; i < h; i++) {
            pieces.push('<tr>');
            for (var j = 0; j < w; j++) {
                pieces.push('<td class="puzzle_td" id="puzzle_td_'+i+'|'+j+'">');
                if (!(i === h-1 && j === w-1)) {
                    pieces.push(shuffledImages[i][j]);
                }
                pieces.push('</td>');
            }
        }

        pieces.push('</table>');

        return pieces.join('');
    },

    createImages: function(img) {
        var w = this.width, h = this.height;

        this.images = [];

        //The width/height of each slice.
        var sliceWidth = img.width / w;
        var sliceHeight = img.height / h;

        var canvas = document.createElement('canvas');
        var gc = canvas.getContext('2d');
        canvas.width = sliceWidth;
        canvas.height = sliceHeight;

        for (var i=0; i<h; i++) {
            this.images[i] = [];
            for (var j=0; j<w; j++) {
                gc.drawImage(img, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 0, 0, canvas.width, canvas.height);

                var imgURL = canvas.toDataURL();
                this.images[i][j] = '<img src="'+imgURL+'" class="puzzle_img" id="puzzle_img_'+i+'|'+j+'" />';
            }
        }

        return this.images;
    }
};
