/**
 * Created by claudia on 12.09.2016.
 */

$(document).ready(function(){
    $(".triangleIconWrapper").click(rotateTriangleIcon);
});

function rotateTriangleIcon() {
    var triangleIcon =  $(this).find("i");

    if( triangleIcon.hasClass("left") ) {
        triangleIcon.removeClass("left");
    }
    else {
        triangleIcon.addClass("left");
    }
}