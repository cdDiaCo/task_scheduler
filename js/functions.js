/**
 * Created by claudia on 12.09.2016.
 */

function rotateTriangleIcon(elem) {
    var currentClass = elem.childNodes[0].className;
    var res = new RegExp("left").test(currentClass);

    if( res ) {
        // remove 'left' class
        elem.childNodes[0].className = currentClass.replace(new RegExp('\\b' + 'left' + '\\b'), '');
    }
    else {
        // add 'left' class
        elem.childNodes[0].className += ' left';
    }
}