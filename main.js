$(document).ready(function() {
    $("#puzzle_img").load(function() {
        PuzzleGame.start();
    });
});
var PuzzleGame = {
    // Tile Width/Height
    width: 4,
    height: 3,
    start: function() {
        var div = $("#puzzle");

        //Base image and the urls of the sliced images.
        var img = $("#puzzle_img")[0];


        $(div).append(this.createBoard(this.createImages(img)));
    },

    createBoard: function(images) {
        var w = this.width, h = this.height;
        var pieces = ['<table id="puzzle_table">'];
        for (var i = 0; i < h; i++) {
            pieces.push('<tr>');
            for (var j = 0; j < w; j++) {
                pieces.push('<td id="puzzle_td_'+i+j+'">'+
                    images[i][j]+'</td>');
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
                images[i][j] = '<img src="'+imgURL+'" id="puzzle_img_'+i+j+'" />';
                //gc.clearRect(0, 0, canvas.width, canvas.height); // necessary?
            }
        }

        return images;
    }

};
