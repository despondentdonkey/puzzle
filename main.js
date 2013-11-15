$(document).ready(function() {
    $("#img").load(function() {
        start();
    });
});

function start() {
    var div = $("#puzzle");

    var pieces = ['<table>'];

    //Slice count
    var hslices = 4;
    var vslices = 3;

    //Base image and the urls of the sliced images.
    var img = $("#img")[0];
    var imgURLS = [[]];

    //The width/height of each slice.
    var sliceWidth = img.width / hslices;
    var sliceHeight = img.height / vslices;

    for (var j=0; j<vslices; ++j) {
        imgURLS[j] = [];

        for (var i=0; i<hslices; ++i) {
            var canvas = document.createElement('canvas');
            canvas.width = sliceWidth;
            canvas.height = sliceHeight;

            var gc = canvas.getContext('2d');

            gc.drawImage(img, i * sliceWidth, j * sliceHeight, sliceWidth, sliceHeight, 0, 0, canvas.width, canvas.height);

            var imgURL = canvas.toDataURL();
            imgURLS[j][i] = imgURL;
        }
    }

    for (var i = 0; i < vslices; i++) {
        pieces.push('<tr>');
        for (var j = 0; j < hslices; j++) {
            pieces.push('<td>');
                pieces.push("<img src='" + imgURLS[i][j] + "'></img>");
            pieces.push('</td>');
        }
    }
    pieces.push('</table>');

    $(div).append(pieces.join(''));
}
