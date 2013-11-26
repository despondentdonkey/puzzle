$(window).load(function() {
    // Set up puzzle infrasturcture
    $('#puzzle').append(
    '<div id="puzzle_board"></div>'+
    '<div id="puzzle_ui">'+
        '<span id="puzzle_clicks">'+PuzzleGame.clickCounterText+'0</span>'+
        '&nbsp;&nbsp;|&nbsp;&nbsp;'+
        '<input type="button" value="Reset" onClick="PuzzleGame.onResetClick()" />&nbsp;'+
        '<input type="button" value="Solve" onClick="PuzzleGame.onSolveClick()" />'+
    '</div>');

    PuzzleGame.start();
});

var PuzzleGame = {
    width: 2,
    height: 2,
    clicks: 0,

    clickCounterText: 'Clicks: ',

    // Animation Settings
    pieceXAnimationSpeed: 700,
    pieceYAnimationSpeed: 400,
    solvedAnimationSpeed: 450,

    start: function() {
        var img = $('#puzzle_img')[0];
        this.images = this.createImages(img);
        $("#puzzle_board").append(this.createBoard(this.images));
        $('.puzzle_td').click(function() {
            var slot = $(this)[0];
            PuzzleGame.handleMove(slot);
        });

        // Calculate width of puzzle div based on CSS rules
        var $p = $('#puzzle');
        var $pt = $('#puzzle_table');
        $p.css('width', (this.width * parseInt($pt.css('border-spacing').split('px')[0], 10)) +
            (parseInt($p.css('borderRightWidth').split('px')[0], 10)) +
            (parseInt($p.css('borderLeftWidth').split('px')[0], 10)) +
            img.width + 1);

    },

    handleMove: function(clickedSlot) {
        var clickedIndex = this.getIndex(clickedSlot);
        var board = this.getBoard();

        //Get the empty slot from the board.
        var emptySlot;
        for (var y=0; y < board.childNodes.length; ++y) {
            var row = board.childNodes[y];

            for (var x=0; x < row.childNodes.length; ++x) {
                var tmpSlot = row.childNodes[x];

                if (tmpSlot.childNodes.length <= 0) {
                    emptySlot = tmpSlot;
                    break;
                }
            }
        }

        var emptyIndex = this.getIndex(emptySlot);

        if (this.isValidMove(clickedIndex, emptyIndex) && !this._animating) {
            this.clicks++;
            $("#puzzle_clicks").html(this.clickCounterText + this.clicks);

            //Moves pieces horizontally/vertically. Very verbose and ugly, needs work to make it look nice.
            var clickedRow = board.childNodes[clickedIndex.y];
            var slotsToMove;
            var rows;
            var self = this;

            // get + or - direction from two points
            var getdir = function(x1, x2) {
                return (x1 - x2)/Math.abs(x1 - x2);
            };

            // Moves image from current (cur) slot to destination (dest) slot
            // also animates movement of image, actually moves when animation finishes
            // dir = 'x' or 'y'
            var mv = function(dir, dest, cur) {
                if (dest && cur) {
                    self._animating = true;

                    var img = cur.childNodes[0];
                    var y = dir === 'y' ? cur.offsetHeight * getdir(dest.offsetTop, cur.offsetTop) : 0;
                    var x = dir === 'x' ? cur.offsetWidth * getdir(dest.offsetLeft, cur.offsetLeft) : 0;
                    // x tends to move slower than y
                    var animSpeed = dir === 'x' ? self.pieceXAnimationSpeed : self.pieceYAnimationSpeed;

                    $(img).css('position', 'relative').animate({
                        left: "+="+x,
                        top: "+="+y
                    }, animSpeed, function() {
                        // Clear all css values set during animation (otherwise cray bugs)
                        $(img).css({'position': '', 'left': '', 'top': ''})
                        $(dest).html(img);
                        self._animating = false;
                        checkComplete();
                    });
                }
            };


            if (clickedIndex.y === emptyIndex.y) {
                if (clickedIndex.x > emptyIndex.x) {
                    slotsToMove = $(clickedRow.childNodes).slice(emptyIndex.x, clickedIndex.x);
                    for (var i = 0; i <= slotsToMove.length; ++i) {
                        var realIndex = emptyIndex.x + i;
                        var currentSlot = this.getSlot(realIndex, clickedIndex.y);
                        var destSlot = this.getSlot(realIndex - 1, clickedIndex.y);

                        mv('x', destSlot, currentSlot);
                    }
                } else {
                    slotsToMove = $(clickedRow.childNodes).slice(clickedIndex.x, emptyIndex.x);
                    for (var i = slotsToMove.length - 1; i >= 0; --i) {
                        var realIndex = clickedIndex.x + i;
                        var currentSlot = this.getSlot(realIndex, clickedIndex.y);
                        var destSlot = this.getSlot(realIndex + 1, clickedIndex.y);

                        mv('x', destSlot, currentSlot);
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

                        mv('y', destSlot, currentSlot);
                    }
                } else {
                    rows = $(board.childNodes).slice(emptyIndex.y, clickedIndex.y);
                    for (var i = 0; i <= rows.length; ++i) {
                        var realIndex = emptyIndex.y + i;
                        var currentSlot = this.getSlot(clickedIndex.x, realIndex);
                        var destSlot = this.getSlot(clickedIndex.x, realIndex - 1);

                        mv('y', destSlot, currentSlot);
                    }
                }
            }
        }

        var checkComplete = function() {
            if (self.isComplete(board)) {
                self.solvePuzzle(board);
            }
        };
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
        if (y < 0 || x < 0) {
            return null;
        } else {
            var row = this.getBoard().childNodes[y];
            return row.childNodes[x];
        }
    },

    onResetClick: function() {
        if (!this._animating) {
            $("#puzzle_clicks").html("Clicks: 0");
            this.clicks = 0;

            $("#puzzle_congrats").hide();

            $("#puzzle_table").remove();
            this.start();
        }
    },

    onSolveClick: function() {
        if (!this._animating)
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
        for (var y=0; y < board.childNodes.length; ++y) {
            var row = board.childNodes[y];

            for (var x=0; x < row.childNodes.length; ++x) {
                var slot = row.childNodes[x];

                if (slot.childNodes[0]) {
                    var slotIndex = this.getIndex(slot);
                    var imgIndex = this.getIndex(slot.childNodes[0]);

                    if (!(slotIndex.x === imgIndex.x && slotIndex.y === imgIndex.y)) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    onComplete: function(autoCompleted) {
        if (!this._animating) {
            var animSpeed = this.solvedAnimationSpeed;
            var self = this;
            var $table = $('#puzzle_table');

            self._animating = true;
            $("#puzzle_congrats").show();
            $table.animate({
                'border-spacing': '0px',
                'border-collapse': 'collapse'
                }, {
                    duration: animSpeed,
                    complete: function() {
                        self._animating = false;
                    },
                    step: function(now) {
                        $('#puzzle').css('width', $table.outerWidth());
                    }
                });
        }
    },

    solvePuzzle: function(board) {
        for (var y=0; y < board.childNodes.length; ++y) {
            var row = board.childNodes[y];

            for (var x=0; x < row.childNodes.length; ++x) {
                var slot = row.childNodes[x];
                $(slot).html(this.images[y][x]);
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

        for (var y = 0; y < h; y++) {
            pieces.push('<tr>');
            for (var x = 0; x < w; x++) {
                pieces.push('<td class="puzzle_td" id="puzzle_td_'+y+'|'+x+'">');
                if (!(y === h-1 && x === w-1)) {
                    pieces.push(shuffledImages[y][x]);
                }
                pieces.push('</td>');
            }
        }

        pieces.push('</table>');
        return pieces.join('');
    },

    createImages: function(img) {
        var w = this.width, h = this.height;

        var images = [];

        //The width/height of each slice.
        var sliceWidth = img.width / w;
        var sliceHeight = img.height / h;

        var canvas = document.createElement('canvas');
        var gc = canvas.getContext('2d');
        canvas.width = sliceWidth;
        canvas.height = sliceHeight;

        for (var y=0; y<h; y++) {
            images[y] = [];
            for (var x=0; x<w; x++) {
                gc.drawImage(img, x * sliceWidth, y * sliceHeight, sliceWidth, sliceHeight, 0, 0, canvas.width, canvas.height);

                var imgURL = canvas.toDataURL();
                images[y][x] = '<img src="'+imgURL+'" class="puzzle_img" id="puzzle_img_'+y+'|'+x+'" />';
            }
        }

        return images;
    }
};
