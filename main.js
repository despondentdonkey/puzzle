$(document).ready(function() {
    var img = $("#img");
    //img.style.visiblility = "visible";
    var div = $("#puzzle");

    $(div).html(img);
    console.log("hello world!");

    var pieces = ['<table>'];
    var w = 400;
    var h = 300;
    for (var i = 0; i < w; i+=100) {
        pieces.push('<tr>');
        for (var j = 0; j < h; j+=100) {
            pieces.push('<td class="puzzle" style="background-position: '+-i+'px '+-j+'px"></div>');
        }
    }
    pieces.push('</table');

    console.log(pieces);
    $(div).append(pieces.join(''));

});
