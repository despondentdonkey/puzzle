$(document).ready(function() {
    $("#puzzle_img").load(function() {
        PuzzleGame.start();
    });
});
var PuzzleGame = {
    // Tile Width/Height
    width: 10,
    height: 10,
    clicks: 0,
    start: function() {
        var div = $("#puzzle");

        //Base image and the urls of the sliced images.
        var img = $("#puzzle_img")[0];

        $(div).append(this.createBoard(this.createImages(img)));

        var getIndex = this.getIndex;
        var clicks = this.clicks;

        $('.puzzle_td').click(function() {
            var slot = $(this)[0];
            console.log('td id: ' + slot.id.substr(-3));
            console.log('img id: ' + slot.firstChild.id.substr(-3));
            clicks++; //Make this only increment if it is a valid move.
            $("#clicks").html("Clicks: " + clicks);
        });
    },

    //Gets the index of the object from the id. Must have a format of #|#.
    getIndex: function(object) {
        var id = object.id;
        return {
            x: id.split("|")[1],
            y: /[0-9]+/.exec(id)[0]
        };
    },

    createBoard: function(images) {
        var w = this.width, h = this.height;
        var pieces = ['<table id="puzzle_table">'];
        for (var i = 0; i < h; i++) {
            pieces.push('<tr>');
            for (var j = 0; j < w; j++) {
                pieces.push('<td class="puzzle_td" id="puzzle_td_'+i+'|'+j+'">');
                if (!(i === h-1 && j === w-1)) {
                    pieces.push(images[i][j]);
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

        for (var i=0; i<h; i++) {
            images[i] = [];
            for (var j=0; j<w; j++) {
                gc.drawImage(img, j * sliceWidth, i * sliceHeight, sliceWidth, sliceHeight, 0, 0, canvas.width, canvas.height);

                var imgURL = canvas.toDataURL();
                images[i][j] = '<img src="'+imgURL+'" class="puzzle_img" id="puzzle_img_'+i+'|'+j+'" />';
            }
        }

        return images;
    }

};
