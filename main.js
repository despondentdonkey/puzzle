$(document).ready(function() {
    var img = $("#img");
    var div = $("#puzzle");

    $(div).html(img);

    // Tile Size
    var w = 4;
    var h = 3;
    // Image Size
    var iw = 400;
    var ih = 300;
    // Piece Size
    var pw = 100;
    var ph = 100;
    var pieces = ['<table>'];
    for (var i = 0; i < h; i++) {
        pieces.push('<tr>');
        for (var j = 0; j < w; j++) {
            pieces.push('<td id="'+i+j+'" class="puzzle" style="background-position: '
                +-(iw/pw * j)+'px '+-(ih/ph * i)+'px"></div>');
        }
    }
    pieces.push('</table>');

    $(div).append(pieces.join(''));
});
